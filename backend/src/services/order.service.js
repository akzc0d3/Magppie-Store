import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import mongoose from "mongoose";
import logger from "../utils/logger.js";
import AppError from "../utils/app-error.js";


export const order = async function (userId, orders) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // 1. Fetch products
        const productIds = orders.map(product => product.id);

        const products = await Product.find({
            _id: { $in: productIds }
        }).session(session);

        const productMap = new Map(
            products.map(product => [product._id.toString(), product])
        );


        let totalAmount = 0;

        // 2. Build order items
        const orderItems = orders.map(item => {
            const product = productMap.get(item.id);

            if (!product) {
                throw new new AppError({
                    statusCode: 404,
                    message: "Product not found [Order]",
                    data: {
                        id: product.id
                    }
                })
            }

            if (product.stock < item.quantity) {
                throw new AppError({
                    statusCode: 400,
                    message: "Insufficient Stock [Order]",
                    data: product
                })
            }

            const subtotal = product.price * item.quantity;
            totalAmount += subtotal;


            return {
                product: product._id,
                name: product.name,
                images:product.images,
                priceAtPurchase: product.price,
                quantity: item.quantity,
                subtotal,
            };
        });

        // 3. Deduct stock safely
        for (const product of orders) {
            const updated = await Product.updateOne(
                {
                    _id: product.id,
                    stock: { $gte: product.quantity },
                },
                {
                    $inc: { stock: -product.quantity },
                },
                { session }
            );

            if (updated.modifiedCount === 0) {
                throw new AppError({
                    statusCode: 422,
                    message: "Stock changed, try again [Order]",
                    data: null
                })
            }

            
        }
        
        // 4. Create order

        const [order] = await Order.create(
            [
                {
                    userId,
                    items: orderItems,
                    totalAmount,
                    status: 'pending',
                    statusHistory: [{ status: 'pending' }],
                },
            ],
            { session }
        );
        await session.commitTransaction();
        session.endSession();
        return order;

    } catch (error) {
        logger.error(error)
        await session.abortTransaction();
        session.endSession();
        throw error
    }

}

export const view = (userId) => {
    try {
        const orders = Order.find({
            userId
        })
        return orders
    } catch (error) {
        logger.error(error)
        throw new AppError({
            statusCode: 500,
            message: "Internal Error: Unable to view [Order]",
            data: null
        })
    }

}

export const viewOrder = async (userId, orderId) => {
    const order = await Order.findById(orderId )
    
    if (userId !== order.userId.toString()) {
        throw new AppError({
            statusCode: 401,
            message: "Unauthorized [Order]",
            data: userId
        })
    }

    return order

}

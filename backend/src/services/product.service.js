import Product from '../models/product.model.js';
import AppError from '../utils/app-error.js';
import logger from '../utils/logger.js';
import { invalidateCache } from '../utils/redis.js';

export const create = async (products) => {

    try {
        const insertedProducts = await Product.insertMany(products, { ordered: false, });
        invalidateCache()

        return {
            count: insertedProducts.length,
            products: insertedProducts
        }


    } catch (error) {

        if (error?.name === 'BulkWriteError' || err?.writeErrors) {

            throw new AppError({
                statusCode: 409,
                message: "Insertion failed",
                data: {
                    success: error.result.nInserted,
                    failure: {
                        count: error.writeErrors,
                        products: error.writeErrors.map(err => ({
                            index: err.index,
                            reason: err.errmsg,
                            data: products[err.index]
                        }))
                    }
                }

            });
        } else {
            logger.error(error)
            throw new AppError({
                statusCode: 500,
                message: "Internal Error: Unable to bulk insert [Product]",
                data: null
            })
        }


    }
}


export const search = async (name, category, priceMin, priceMax, page, limit, isActive ) => {
    const query = {};

 

    if (name) {
        query.$text = { $search: name };
    }

    if (category) {
        query.category = category;
    }

    if (priceMin !== undefined || priceMax !== undefined) {
        query.price = {};
        if (priceMin !== undefined) query.price.$gte = Number(priceMin);
        if (priceMax !== undefined) query.price.$lte = Number(priceMax);
    }

    const skip = (page - 1) * limit;


    const [products, total] = await Promise.all([
        Product.find(query)
            .sort(name ? { score: { $meta: 'textScore' } } : { createdAt: -1, _id: -1 })
            .skip(skip)
            .limit(limit),

        Product.countDocuments(query)
    ]);

    return {
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
        products,
    };
};

export const update = async (product) => {
    try {

        const updatedProduct = await Product.findByIdAndUpdate(
            product.id,
            { $set: product },
            { returnDocument: 'after', runValidators: true }
        );

        invalidateCache()

        return updatedProduct;
    } catch (error) {
        logger.error(error)
        throw new AppError({
            statusCode: 500,
            message: "Internal Error: Unable to update [Product]",
            data: null
        })
    }

}


export const remove = async (productIds) => {
    try {
        const result = await Product.deleteMany({ _id: { $in: productIds } })
        invalidateCache()

        return result.deletedCount;
    } catch (error) {
        logger.error(error)
        throw new AppError({
            statusCode: 500,
            message: "Internal Error: Unable to delete [Product]",
            data: null
        })
    }
}


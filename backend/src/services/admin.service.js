
import Order from "../models/order.model.js"


export const orders = async (req, res)=>{
    const allOrders = await Order.find({})
    return allOrders
}


export const update = async (orderId, status, io) => {
    try {

        const updates = await Order.findByIdAndUpdate(
            orderId,
            {
                $set: { status },
                $push: {
                    statusHistory: { status },
                },
            },

            { returnDocument: 'after', runValidators: true }
        )


        io.to(`user:${updates.userId}`).emit("order:statusUpdated", {
            orderId: updates.id,
            status: updates.status
        });

        return updates

    } catch (error) {
        logger.error(error)
        throw new AppError({
            statusCode: 500,
            message: "Internal Error: Unable to update [Order]",
            data: null
        })
    }

}


export const viewOrder = async (orderId) => {
    const order = await Order.findById(orderId )
    return order

}
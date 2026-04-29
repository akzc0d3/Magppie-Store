import * as orderService from '../services/order.service.js'
import ApiResponse from '../utils/api-response.js'


export const order = async (req, res) => {

    const orders = req.body
    const placedOrders = await orderService.order(req.user.id, orders)

    return ApiResponse.send(res, {
        statusCode: 200,
        message: "Order successfully placed",
        data: placedOrders
    })

}

export const view = async (req, res) => {
    const userId = req.user.id;

    const orders = await orderService.view(userId)


    return ApiResponse.send(res, {
        statusCode: 200,
        message: "Current orders",
        data: orders
    })

}


export const viewOrder = async (req, res) => {

    const { orderId } = req.params
    const userId = req.user.id
    const order = await orderService.viewOrder(userId, orderId)

    return ApiResponse.send(res, {
        statusCode: 200,
        message: "Orders",
        data: order
    })
}


import * as adminService from "../services/admin.service.js";
import ApiResponse from "../utils/api-response.js";

export const orders = async (req, res) => {

    const allOrders = await adminService.orders()


    return ApiResponse.send(res, {
        statusCode: 200,
        message: "Orders",
        data: allOrders
    })
}
export const update = async (req, res) => {
    const { orderId, status } = req.params;

    const updates = await adminService.update(orderId, status, req.io);


    return ApiResponse.send(res, {
        statusCode: 200,
        message: "Order updated",
        data: updates
    })

}


export const viewOrder = async (req, res) => {

    
    const { orderId } = req.params
    const order = await adminService.viewOrder(orderId)
    
    return ApiResponse.send(res, {
        statusCode: 200,
        message: "Orders",
        data: order
    })
}

import * as productService from '../services/product.service.js'
import ApiResponse from '../utils/api-response.js';
import logger from '../utils/logger.js';
import { env, redisClient } from '../config/index.js';



export const create = async (req, res) => {

    const products = req.body
    const insertedProducts = await productService.create(products)


    return ApiResponse.send(res, {
        statusCode: 200,
        message: "Products created",
        data: insertedProducts
    })

}

export const update = async (req, res) => {
    const  product  = req.body;

    const updatedProduct = await productService.update(product)

    return ApiResponse.send(res, {
        statusCode: 200,
        message: "Product updated",
        data: updatedProduct
    })

}

export const search = async (req, res) => {

    const { name, category, priceMin, priceMax, page = 1, limit = 10, isActive = true } = req.query;


    const products = await productService.search(name, category, priceMin, priceMax, page, limit)
    const response = {
        statusCode: 200,
        message: "Product search results",
        data: products
    }

    if (res.locals.cacheKey) {
        redisClient.set(res.locals.cacheKey, JSON.stringify(response), 'EX', env.cacheTTL)
    }
    return ApiResponse.send(res, response)


}

export const remove = async (req, res) => {

    const ids  = req.body
    const count = await productService.remove(ids)

    return ApiResponse.send(res, {
        statusCode: 200,
        message: "Products deleted",
        data: count
    })

}
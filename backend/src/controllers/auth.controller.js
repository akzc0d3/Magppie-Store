import ApiResponse from "../utils/api-response.js"
import * as authService from "../services/auth.service.js";
import { env } from "../config/index.js";
import logger from "../utils/logger.js";



export const signup = async (req, res) => {

    const { email, password, role } = req.body

    const user = await authService.signup(email, password, role)

    return ApiResponse.send(res, {
        statusCode: 200,
        message: "User registered successfully",
        data: user
    })

}

export const login = async (req, res) => {

    const { email, password } = req.body

    const user = await authService.login(email, password)

    return ApiResponse.send(res, {
        statusCode: 200,
        message: "Login successfully",
        data: user
    },

        {

            cookies: [
                {
                    name: "refreshToken",
                    value: user.refreshToken,
                    config: {
                        httpOnly: true,
                        secure: env.NODE_ENV === "production",
                        sameSite: env.NODE_ENV === "production" ? "strict" : "lax",
                        path: "/",
                        maxAge: env.refreshTokenTTL * 1000
                    },
                },
            ],
        }
    )

}

export const refresh = async (req, res) => {

    const { refreshToken } = req.cookies

    const user = await authService.refresh(refreshToken)
 

    return ApiResponse.send(res, {
        statusCode: 200,
        message: "Token refreshed",
        data: user
    },

        {
            cookies: [
                {
                    name: "refreshToken",
                    value: user.refreshToken,
                    config: {
                        httpOnly: true,
                        secure: env.NODE_ENV === "production",
                        sameSite: env.NODE_ENV === "production" ? "strict" : "lax",
                        path: "/",
                        maxAge: env.refreshTokenTTL * 1000
                    },
                },
            ],
        }
    )
}
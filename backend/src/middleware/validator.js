import * as z from "zod";
import AppError from "../utils/app-error.js";


export const signupSchema = z.object({
    body: z.object({
        email: z.email("Please provide a valid email"),
        password: z
            .string("Please provide a password")
            .min(12, "Password must be at least 12 characters")
            .max(128, "Password must not exceed 128 characters")
            .regex(/[A-Z]/, "Password must include at least one uppercase letter")
            .regex(/[a-z]/, "Password must include at least one lowercase letter")
            .regex(/[0-9]/, "Password must include at least one number")
            .regex(/[^A-Za-z0-9]/, "Password must include at least one special character"),
        role: z.enum(["user", "admin"],  "Role must be either 'user' or 'admin'" )

    }),
});


export const loginSchema = z.object({
    body: z.object({
        email: z.email("Invalid email address"),
        password: z.string("Please provide a password").min(12, "Password must be at least 12 characters")
    }),
});

export const authSchema = z.object({
    headers: z.object({
        authorization: z.string("Authorization header is required").regex(/^Bearer\s.+$/, "Authorization header is invalid. Expected : Bearer <token>"),

    })
});

export const refreshTokenSchema = z.object({
    cookies: z.object({
        refreshToken: z.string("Refresh token is required").min(1, "Refresh token is invalid")
    })
});



export const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse({
        body: req.body || {},
        query: req.query || {},
        params: req.params || {},
        headers: req.headers || {},
        cookies: req.cookies || {},
    });



    if (!result.success) {
        throw new AppError({
            statusCode: 400,
            message: "Validation failed",
            data: result.error.issues.map(issue => issue.message)
        })

    }

    next();
};
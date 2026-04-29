import AppError from "../utils/app-error.js";

export default function (req, res, next) {

    const { role } = req.user;

    if (role !== "admin") {
        throw new AppError({
            statusCode: 401,
            message: "Unauthorized",
            data: null
        });
    }

    next()

}
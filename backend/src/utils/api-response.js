

export default class ApiResponse {
  static send(res, { statusCode, message, data = null }, options = {}) {

    if (options.headers) {
      Object.entries(options.headers).forEach(([key, value]) => {
        res.set(key, value);
      });
    }

    if (options.cookies) {
      options.cookies.forEach(({ name, value, config }) => {
        res.cookie(name, value, config);
      });
    }

    return res.status(statusCode).json({
      success: statusCode < 400,
      message,
      data,
    });
  }
}
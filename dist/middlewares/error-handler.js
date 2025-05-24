"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (error, request, response, next) => {
    if (error.message === 'Invalid RSAES-OAEP padding.') {
        response.status(400).json({
            code: 'BAD_REQUEST',
            message: 'Invalid RSAES-OAEP padding. 😥'
        });
        return;
    }
    response.status(500).json({
        code: error.code || 'UNCONTROLLER_ERROR',
        message: error.message || 'An unexpected error has occurred. 😥'
    });
};
exports.errorHandler = errorHandler;

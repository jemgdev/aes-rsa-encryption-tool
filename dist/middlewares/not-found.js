"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = void 0;
const notFound = (request, response) => {
    response.status(404).json({
        code: 'NOT_FOUND',
        message: 'Reource not found'
    });
};
exports.notFound = notFound;

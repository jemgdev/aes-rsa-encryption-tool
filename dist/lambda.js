"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const aws_serverless_express_1 = __importDefault(require("aws-serverless-express"));
const main_1 = require("./main"); // Import the Express app
// Create a server instance for aws-serverless-express
const binaryMimeTypes = ['*/*'];
const server = aws_serverless_express_1.default.createServer(main_1.app, undefined, binaryMimeTypes);
// Export the handler function
const handler = (event, context) => {
    aws_serverless_express_1.default.proxy(server, event, context);
};
exports.handler = handler;

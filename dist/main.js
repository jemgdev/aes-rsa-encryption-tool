"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
exports.app = app;
const constants_1 = __importDefault(require("./utils/constants"));
const error_handler_1 = require("./middlewares/error-handler");
const not_found_1 = require("./middlewares/not-found");
const key_management_routes_1 = require("./routes/key-management.routes");
const encrypt_routes_1 = require("./routes/encrypt.routes");
const decrypt_routes_1 = require("./routes/decrypt.routes");
app.set('PORT', constants_1.default.port);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api/v1/', key_management_routes_1.keyManagementRouter);
app.use('/api/v1/', encrypt_routes_1.encryptRouter);
app.use('/api/v1/', decrypt_routes_1.decryptRouter);
app.use(error_handler_1.errorHandler);
app.use(not_found_1.notFound);
if (require.main === module) { // Add this condition
    app.listen(app.get('PORT'), () => {
        console.log(`aes-rsa-encryption on http://localhost:${app.get('PORT')}`);
    });
}

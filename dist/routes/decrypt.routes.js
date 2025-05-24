"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptRouter = void 0;
const express_1 = require("express");
const decryptRouter = (0, express_1.Router)();
exports.decryptRouter = decryptRouter;
const decrypt_controller_1 = require("../controllers/decrypt.controller");
decryptRouter.post('/decrypt', decrypt_controller_1.decrypt);

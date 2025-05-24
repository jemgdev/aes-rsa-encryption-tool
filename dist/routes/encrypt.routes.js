"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encryptRouter = void 0;
const express_1 = require("express");
const encryptRouter = (0, express_1.Router)();
exports.encryptRouter = encryptRouter;
const encrypt_controller_1 = require("../controllers/encrypt.controller");
encryptRouter.post('/encrypt', encrypt_controller_1.encrypt);

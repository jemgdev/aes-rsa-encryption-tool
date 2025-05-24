"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keyManagementRouter = void 0;
const express_1 = require("express");
const keyManagementRouter = (0, express_1.Router)();
exports.keyManagementRouter = keyManagementRouter;
const key_management_controller_1 = require("../controllers/key-management.controller");
keyManagementRouter
    .get('/get-key', key_management_controller_1.getPublicKey)
    .get('/load-keys', key_management_controller_1.loadKeyPairs);

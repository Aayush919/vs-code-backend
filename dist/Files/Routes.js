"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Files_Controller_1 = require("./Files.Controller");
const router = express_1.default.Router();
router.get("/files", Files_Controller_1.getAllFiles);
router.get("/files/:id", Files_Controller_1.getFileById);
router.post("/files/create", Files_Controller_1.createFile);
router.put("/files/:id", Files_Controller_1.updateFile);
router.put("/files/move/:id", Files_Controller_1.moveFile);
router.delete("/files/:id", Files_Controller_1.deleteFile);
exports.default = router;

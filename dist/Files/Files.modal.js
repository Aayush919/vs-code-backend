"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const fileSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ["file", "folder"], required: true },
    parentId: { type: String, default: null },
    content: { type: String },
    isExpanded: { type: Boolean },
    created: { type: String, default: () => new Date().toISOString() },
    modified: { type: String, default: () => new Date().toISOString() },
});
exports.FileModel = mongoose_1.default.model("File", fileSchema);

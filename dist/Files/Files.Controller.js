"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = exports.moveFile = exports.updateFile = exports.createFile = exports.getFileById = exports.getAllFiles = void 0;
const Files_modal_1 = require("./Files.modal");
// GET all files
const getAllFiles = async (req, res) => {
    try {
        const files = await Files_modal_1.FileModel.find();
        res.json(files);
    }
    catch (err) {
        res.status(500).json({ error: "Error fetching files" });
    }
};
exports.getAllFiles = getAllFiles;
// GET file by ID
const getFileById = async (req, res) => {
    try {
        const file = await Files_modal_1.FileModel.findById(req.params.id);
        if (!file)
            return res.status(404).json({ error: "File not found" });
        res.status(200).json(file);
    }
    catch (err) {
        res.status(500).json({ error: "Error fetching file" });
    }
};
exports.getFileById = getFileById;
// POST create file/folder
const createFile = async (req, res) => {
    try {
        const { name, type, parentId, content, isExpanded } = req.body;
        if (!name || !type) {
            return res.status(400).json({ error: "Name and type are required." });
        }
        const newFile = new Files_modal_1.FileModel({
            name,
            type,
            parentId: parentId || null,
            content: type === "file" ? content || "" : undefined,
            isExpanded: type === "folder" ? isExpanded || false : undefined,
            created: new Date().toISOString(),
            modified: new Date().toISOString(),
        });
        await newFile.save();
        res.status(201).json(newFile);
    }
    catch (err) {
        res.status(500).json({ error: "Error creating file" });
    }
};
exports.createFile = createFile;
// PUT update file/folder
const updateFile = async (req, res) => {
    try {
        const updated = await Files_modal_1.FileModel.findByIdAndUpdate(req.params.id, { ...req.body, modified: new Date().toISOString() }, { new: true });
        if (!updated)
            return res.status(404).json({ error: "File not found" });
        res.json(updated);
    }
    catch (err) {
        res.status(500).json({ error: "Error updating file" });
    }
};
exports.updateFile = updateFile;
// PUT move file/folder
const moveFile = async (req, res) => {
    try {
        const { newParentId } = req.body;
        const updated = await Files_modal_1.FileModel.findByIdAndUpdate(req.params.id, { parentId: newParentId, modified: new Date().toISOString() }, { new: true });
        if (!updated)
            return res.status(404).json({ error: "File not found" });
        res.json(updated);
    }
    catch (err) {
        res.status(500).json({ error: "Error moving file" });
    }
};
exports.moveFile = moveFile;
const deleteFile = async (req, res) => {
    try {
        const toDeleteIds = [];
        const collectChildren = async (id) => {
            const idStr = id.toString();
            toDeleteIds.push(idStr);
            const children = await Files_modal_1.FileModel.find({ parentId: idStr });
            for (const child of children) {
                await collectChildren(child._id);
            }
        };
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ error: "File ID is required" });
        }
        await collectChildren(id);
        await Files_modal_1.FileModel.deleteMany({ _id: { $in: toDeleteIds } });
        res.json({ success: true });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error deleting file" });
    }
};
exports.deleteFile = deleteFile;

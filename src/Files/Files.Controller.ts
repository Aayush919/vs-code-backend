import { Request, Response } from "express";
import { FileModel } from "./Files.modal";



// GET all files
export const getAllFiles = async (req: Request, res: Response): Promise<any> => {
    try {
        const files = await FileModel.find();
        res.json(files);
    } catch (err) {
        res.status(500).json({ error: "Error fetching files" });
    }
};

// GET file by ID
export const getFileById = async (req: Request, res: Response): Promise<any> => {
    try {

      
        const file = await FileModel.findById(req.params.id);
        if (!file) return res.status(404).json({ error: "File not found" });
        res.status(200).json(file);
    } catch (err) {
        res.status(500).json({ error: "Error fetching file" });
    }
};

// POST create file/folder
export const createFile = async (req: Request, res: Response): Promise<any> => {
    try {
        const { name, type, parentId, content, isExpanded } = req.body;

        if (!name || !type) {
            return res.status(400).json({ error: "Name and type are required." });
        }

        const newFile = new FileModel({
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
    } catch (err) {
        res.status(500).json({ error: "Error creating file" });
    }
};

// PUT update file/folder
export const updateFile = async (req: Request, res: Response): Promise<any> => {
    try {
     
        const updated = await FileModel.findByIdAndUpdate(
            req.params.id,
            { ...req.body, modified: new Date().toISOString() },
            { new: true }
        );
        if (!updated) return res.status(404).json({ error: "File not found" });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: "Error updating file" });
    }
};

// PUT move file/folder
export const moveFile = async (req: Request, res: Response): Promise<any> => {
    try {
        const { newParentId } = req.body;

       

        const updated = await FileModel.findByIdAndUpdate(
            req.params.id,
            { parentId: newParentId, modified: new Date().toISOString() },
            { new: true }
        );
        if (!updated) return res.status(404).json({ error: "File not found" });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: "Error moving file" });
    }
};



export const deleteFile = async (req: Request, res: Response): Promise<any> => {
    try {
        const toDeleteIds: string[] = [];
        const collectChildren = async (id: string | any) => {
            const idStr = id.toString();
            toDeleteIds.push(idStr);
            const children = await FileModel.find({ parentId: idStr });
            for (const child of children) {
                await collectChildren(child._id);
            }
        };


        const id = req.params.id as string;
        if (!id) {
            return res.status(400).json({ error: "File ID is required" });
        }

        await collectChildren(id);
        await FileModel.deleteMany({ _id: { $in: toDeleteIds } });

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error deleting file" });
    }
};

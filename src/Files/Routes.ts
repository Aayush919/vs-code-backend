import express from "express";
import {
  getAllFiles,
  getFileById,
  createFile,
  updateFile,
  moveFile,
   deleteFile

} from "./Files.Controller";

const router = express.Router();

router.get("/files", getAllFiles);
router.get("/files/:id", getFileById);
router.post("/files/create", createFile);
router.put("/files/:id", updateFile);
router.put("/files/move/:id", moveFile);
router.delete("/files/:id", deleteFile);

export default router;

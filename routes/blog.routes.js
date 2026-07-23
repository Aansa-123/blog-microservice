import express from "express";

import verifyUser from "../middlewares/blogs.middleware.js";

import {
    createBlog,
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
    deleteAllBlogs,
    purchaseBlog
} from "../controllers/blog.controllers.js";

const router = express.Router();

router.post("/", verifyUser, createBlog);

router.get("/", verifyUser, getAllBlogs);

router.get("/:id", verifyUser, getBlogById);

router.put("/:id", verifyUser, updateBlog);

router.put("/:id/purchase", verifyUser, purchaseBlog);

router.delete("/:id", verifyUser, deleteBlog);

router.delete("/", verifyUser, deleteAllBlogs);

export default router;
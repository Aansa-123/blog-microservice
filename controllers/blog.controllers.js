import * as blogService from "../services/blog.services.js";

export const createBlog = async (req, res) => {

    try {

        const blog = await blogService.createBlog(req);

        return res.status(201).json({

            message: "Blog created successfully",

            blog

        });

    } catch (error) {

        return res.status(500).json({

            message: error.message

        });

    }

};

export const getAllBlogs = async (req, res) => {

    try {

        const blogs = await blogService.getAllBlogs();

        return res.status(200).json(blogs);

    } catch (error) {

        return res.status(500).json({

            message: error.message

        });

    }

};

export const getBlogById = async (req, res) => {

    try {

        const blog = await blogService.getBlogById(req.params.id);

        if (!blog) {

            return res.status(404).json({

                message: "Blog not found"

            });

        }

        return res.status(200).json(blog);

    } catch (error) {

        return res.status(500).json({

            message: error.message

        });

    }

};

export const updateBlog = async (req, res) => {

    try {

        const blog = await blogService.updateBlog(

            req.params.id,

            req.user.id,

            req.body

        );

        if (!blog) {

            return res.status(404).json({

                message: "Blog not found"

            });

        }

        return res.status(200).json({

            message: "Blog updated successfully",

            blog

        });

    } catch (error) {

        return res.status(500).json({

            message: error.message

        });

    }

};

export const deleteBlog = async (req, res) => {

    try {

        const blog = await blogService.deleteBlog(

            req.params.id,

            req.user.id

        );

        if (!blog) {

            return res.status(404).json({

                message: "Blog not found"

            });

        }

        return res.status(200).json({

            message: "Blog deleted successfully"

        });

    } catch (error) {

        return res.status(500).json({

            message: error.message

        });

    }

};

export const deleteAllBlogs = async (req, res) => {

    try {

        await blogService.deleteAllBlogs(req.user.id);

        return res.status(200).json({

            message: "All blogs deleted successfully"

        });

    } catch (error) {

        return res.status(500).json({

            message: error.message

        });

    }

};

export const purchaseBlog = async (req, res) => {

    try {

        const blog = await blogService.addBuyer(
            req.params.id,
            req.body.userId || req.user.id,
            req.body.buyerName || req.user.name
        );

        return res.status(200).json({
            message: "Blog purchased successfully",
            blog
        });

    } catch (error) {

        return res.status(400).json({
            message: error.message
        });

    }

};

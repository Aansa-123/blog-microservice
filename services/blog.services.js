import Blog from "../models/Blogs.js";

export const createBlog = async (req) => {

    return await Blog.create({

        title: req.body.title,

        description: req.body.description,

        content: req.body.content,

        price: req.body.price,

        authorName: req.user.name,

        userId: Number(req.user.id)

    });

};

export const getAllBlogs = async (req) => {

    return await Blog.find().select(
        "_id title description authorName price userId"
    );

};

export const getBlogById = async (id) => {

    return await Blog.findById(id);

};

export const addBuyer = async (blogId, userId, buyerName) => {

    const normalizedUserId = Number(userId);

    const blog = await Blog.findById(blogId);

    if (!blog) {
        throw new Error("Blog not found");
    }

    const alreadyPurchased = blog.buyers.some(
        buyer => Number(buyer.userId) === normalizedUserId
    );

    if (!alreadyPurchased) {
        blog.buyers.push({
            userId: normalizedUserId,
            buyerName,
            purchasedAt: new Date()
        });

        blog.totalPurchases += 1;

        await blog.save();
    }

    return blog;

};

export const updateBlog = async (id, userId, body) => {
    const normalizedUserId = Number(userId);

    return await Blog.findOneAndUpdate(

        {

            _id: id,

            userId: normalizedUserId

        },

        {

            title: body.title,

            description: body.description,

            content: body.content,

            price: body.price

        },

        {

            new: true

        }

    );

};

export const deleteBlog = async (id, userId) => {
    const normalizedUserId = Number(userId);

    return await Blog.findOneAndDelete({

        _id: id,

        userId: normalizedUserId

    });

};

export const deleteAllBlogs = async (userId) => {
    const normalizedUserId = Number(userId);

    return await Blog.deleteMany({

        userId: normalizedUserId

    });

};
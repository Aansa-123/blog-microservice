import mongoose from "mongoose";


const blogSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true
    },


    description: {
        type: String,
        required: true
    },


    content: {
        type: String,
        required: true
    },


    authorName: {
        type: String,
        required: true
    },


    userId: {
        type: Number,
        required: true
    },


    price: {
        type: Number,
        required: true,
        min:0
    },


    buyers: [
        {

            userId: {
                type: Number,
                required: true
            },


            buyerName: {
                type:String,
                required:true
            },


            purchasedAt:{
                type:Date,
                default:Date.now
            }

        }
    ],


    totalPurchases:{
        type:Number,
        default:0
    }


},
{
    timestamps:true
});


const Blog = mongoose.model(
    "Blog",
    blogSchema
);


export default Blog;
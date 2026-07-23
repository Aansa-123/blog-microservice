import { Kafka } from "kafkajs";
import dotenv from "dotenv";
import Blog from "../../models/Blogs.js";

dotenv.config();

const kafka = new Kafka({
    clientId: "blog-service",
    brokers: [
        process.env.KAFKA_BROKER
    ],
});

const consumer = kafka.consumer({
    groupId: "blog-service-group",
});


export const startPaymentConsumer = async () => {

    await consumer.connect();

    console.log(
        "Blog Kafka Consumer Connected"
    );


    await consumer.subscribe({

        topic: "payment-successful-events",

        fromBeginning: false

    });


    await consumer.run({

        eachMessage: async ({ message }) => {

            try {

                const event = JSON.parse(
                    message.value.toString()
                );


                console.log(
                    "Blog Service received payment event:",
                    event
                );


                if (
                    event.eventType !==
                    "PAYMENT_SUCCESSFUL"
                ) {

                    return;

                }


                const {

                    blogId,

                    userId,

                    buyerName

                } = event.paymentData;


                // Find blog
                const blog =
                    await Blog.findById(
                        blogId
                    );


                if (!blog) {

                    console.error(
                        `Blog ${blogId} not found`
                    );

                    return;

                }


                // Prevent duplicate purchase
                const alreadyPurchased =
                    blog.buyers.some(

                        buyer =>
                            buyer.userId === userId

                    );


                if (
                    alreadyPurchased
                ) {

                    console.log(

                        `User ${userId} already purchased blog ${blogId}`

                    );

                    return;

                }


                // Add buyer
                blog.buyers.push({

                    userId: userId,

                    buyerName: buyerName

                });


                // Increase purchase count
                blog.totalPurchases =
                    blog.totalPurchases + 1;


                await blog.save();


                console.log(

                    `Buyer ${buyerName} added successfully`

                );


                console.log(

                    `Total purchases: ${blog.totalPurchases}`

                );


            } catch (error) {

                console.error(

                    "Error processing payment event:",

                    error

                );

            }

        }

    });

};
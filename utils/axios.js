import axios from "axios";

const userAPI = axios.create({
    baseURL: process.env.USER_API,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json"
    }
});

export default userAPI;
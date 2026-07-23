import userAPI from "../utils/axios.js";

const verifyUser = async (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "Authorization token missing"
            });
        }

        const response = await userAPI.get("/users/verify", {
            headers: {
                Authorization: authHeader
            }
        });

        req.user = response.data;
        req.user.id = Number(req.user.id);

        next();

    } catch (error) {

        return res.status(401).json({
            message: "Unauthorized User"
        });

    }

};

export default verifyUser;
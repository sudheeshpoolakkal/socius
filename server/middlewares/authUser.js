import jwt from 'jsonwebtoken'

//user authentication middleware
const authUser = async (req,res,next) => {
    try {
        const { authorization } = req.headers;
        if (!authorization || !authorization.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: "Not authorized. Login again" });
        }
        const token = authorization.split(' ')[1];
        const token_decode = jwt.verify(token,process.env.JWT_SECRET)
        req.userId = token_decode.id
        req.userType = 'user'  // Set user type for authorization checks

        next()

    } catch (error) {
        console.error(error); // Log the error for better debugging
        return res.status(401).json({ success: false, message: "Not authorized. Login again"});
    }
}

export default authUser
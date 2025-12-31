import jwt from 'jsonwebtoken'

//admin authentication middleware
const authAdmin = async (req,res,next) => {
    try {
        const {atoken, aToken} = req.headers
        const token = atoken || aToken; // Accept both header names for compatibility
        
        if(!token){
            return res.json({success:false,message:"Not authorized. Login again"})
        }
        const token_decode = jwt.verify(token,process.env.JWT_SECRET)
        if(token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD){
            return res.json({success:false,message:"Not authorized. Login again"})
        }
        
        req.userType = 'admin'  // Set user type for authorization checks

        next()

    } catch (error) {
        console.error(error); // Log the error for better debugging
        res.json({ success: false, message:error.message});
    }
}

export default authAdmin
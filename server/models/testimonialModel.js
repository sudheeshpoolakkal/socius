import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema({
    quote: {type:String, required:true},
    name: {type:String, required:true},
    image: {type:String, required:true},
})

const testimonialModel = mongoose.models.testimonial || mongoose.model('testimonial',testimonialSchema)

export default testimonialModel;
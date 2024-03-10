import { Schema, model, models } from "mongoose"


const bookSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    article: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['Horror', "Information", "Technology"]
    },
    idBook: {
        type: String,
        required: true
    },
    yearRelease: {
        type: Number,
        required: true
    },
}, {timestamps: true})

const BookModel = models.book || model('book', bookSchema);

export default BookModel;
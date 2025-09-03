import {model, models, Schema} from "mongoose";

const LogSchema = new Schema({
    previewLink: {type: String, required: false},
    logoUrl: {type: String, required: false},
    logDetails: {type: String, required: true},
    price: {type: Number, required: true},
    sold: {type: Boolean, required: false, default: false},
    category: {type: String, required: true, ref: "Category"},
    subCategory: {type: String, required: true, ref: "SubCategory"},
}, {
    timestamps: true
});

export default models.Log || model("Log", LogSchema);

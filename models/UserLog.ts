import {model, models, Schema} from "mongoose";

const LogSchema = new Schema({
    user: {type: Schema.Types.ObjectId, required: true, ref: "User"},
    previewLink: {type: String, required: false},
    logoUrl: {type: String, required: false},
    logDetails: {type: String, required: true},
    price: {type: Number, required: true},
    category: {type: Schema.Types.ObjectId, required: true, ref: "Category"},
    subCategory: {type: Schema.Types.ObjectId, required: true, ref: "SubCategory"},
}, {
    timestamps: true
});

export default models.UserLog || model("UserLog", LogSchema);
 
import {model, models, Schema} from "mongoose";

const SubCategorySchema = new Schema({
    name: {type: String, required: true, unique: true},
    logoUrl: {type: String, required: false},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    category: {type: Schema.Types.ObjectId, required: true, ref: "Category"},
}, {
    timestamps: true
});

export default models.SubCategory || model("SubCategory", SubCategorySchema);

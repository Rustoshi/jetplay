import {model, models, Schema} from "mongoose";

const CategorySchema = new Schema({
    name: {type: String, required: true, unique: true},
    logoUrl: {type: String, required: false}
}, {
    timestamps: true
});

export default models.Category || model("Category", CategorySchema);
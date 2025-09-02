import {model, models, Schema} from "mongoose";

const UserSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    phone: {type: String, required: false, unique: false},
    address: {type: String, required: false},
    city: {type: String, required: false},
    state: {type: String, required: false},
    country: {type: String, required: false},
    password: {type: String, required: true},
    role: {type: String, enum: ["user", "admin"], default: "user"},
    balance: {type: Number, required: false, default: 0},
    spent: {type: Number, required: false, default: 0}
}, {
    timestamps: true
});

export default models.User || model("User", UserSchema);

import {model, models, Schema} from 'mongoose';

const TransactionSchema = new Schema({
    user: {type: String, required: true, ref: "User"},
    type: {type: String, enum: ["credit", "purchase"]},
    amount: {type: Number, required: true}
}, {
    timestamps: true
});

export default models.Transaction || model("Transaction", TransactionSchema);
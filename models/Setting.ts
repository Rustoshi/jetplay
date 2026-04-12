import {model, models, Schema} from "mongoose";

const SettingSchema = new Schema({
    key: {type: String, required: true, unique: true},
    value: {type: Schema.Types.Mixed, required: true}
}, {
    timestamps: true
});

export default models.Setting || model("Setting", SettingSchema);

import mongoose from "mongoose";

const AlertSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    severity: {
        type: String,
        enum: ["Info", "Warning", "Critical"],
        default: "Info",
    },
    isRead: {
        type: Boolean,
        default: false
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
});

const Alert = mongoose.model("Alert", AlertSchema);

export default Alert;

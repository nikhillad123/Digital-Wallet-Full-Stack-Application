const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema({
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    action: {
        type: String,
        enum: [
            "FREEZE_USER",
            "UNFREEZE_USER"
        ],
        required: true
    },
    targetUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    }
}, {
    timestamps: true
});

auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ admin: 1 });

const auditLogModel = mongoose.model("auditLog", auditLogSchema);

module.exports = auditLogModel;
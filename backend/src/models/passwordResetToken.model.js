const mongoose = require("mongoose");

const passwordResetTokenSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
            index: true
        },

        token: {
            type: String,
            required: true,
            unique: true
        },

        expiresAt: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true
    }
);

// Automatically delete expired reset tokens
passwordResetTokenSchema.index(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 }
);

const passwordResetTokenModel = mongoose.model("passwordResetToken", passwordResetTokenSchema);

module.exports = passwordResetTokenModel;
const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "Transaction must belong to a user"],
        index: true
    },

    fromAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        index: true
    },

    toAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        index: true
    },

    type: {
        type: String,
        enum: {
            values: ["CREDIT", "DEBIT"],
            message: "Type must be either CREDIT or DEBIT"
        },
        required: true,
        immutable: true
    },

    amount: {
        type: Number,
        required: [true, "Amount is required"],
        min: [1, "Amount must be greater than 0"],
        immutable: true
    },

    status: {
        type: String,
        enum: {
            values: ["PENDING", "SUCCESS", "FAILED", "REVERSED"],
            message: "Invalid transaction status"
        },
        default: "PENDING"
    },

    idempotencyKey: {
        type: String
    },

    description: {
        type: String,
        trim: true
    }

}, {
    timestamps: true
});


// Compound unique index
transactionSchema.index(
    { user: 1, idempotencyKey: 1 },
    {
        unique: true,
        partialFilterExpression: {
            idempotencyKey: { $type: "string" }
        }
    }
);

transactionSchema.index({
    user: 1,
    createdAt: -1
});

// Ensure at least one of fromAccount or toAccount exists
transactionSchema.pre("save", function () {
    if (!this.fromAccount && !this.toAccount) {
        throw new Error("Transaction must have either fromAccount or toAccount");
    }
});

const transactionModel = mongoose.model("transaction", transactionSchema); 

module.exports = transactionModel;
const mongoose = require("mongoose");
const crypto = require("node:crypto");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            minlength: 3,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            unique: false,
            minlength: 8,
        },
        salt: {
            type: String,
            default: () => crypto.randomBytes(64).toString("hex"),
        },
    },
    {
        timestamps: true
    }
);

userSchema.pre("save", function(next) {
    if (!this.isModified("password")) return next();

    if (!this.salt) {
        this.salt = crypto.randomBytes(64).toString("hex");
    }

    this.password = crypto.scryptSync(this.password, this.salt, 64).toString("hex");
    next();
});

userSchema.methods.comparePassword = function (inputPassword) {
    const hashed = crypto.scryptSync(inputPassword, this.salt,64).toString("hex");
    return this.password === hashed;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
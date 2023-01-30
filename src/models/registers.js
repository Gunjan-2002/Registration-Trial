const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: true
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    confirmpassword: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

// GENERATING TOKENS
employeeSchema.methods.generateAuthToken = async function() {
    try {
        console.log(this._id);
        const token = jwt.sign({_id : this._id.toString()} , process.env.SECRET_KEY )
        this.tokens = this.tokens.concat({token : token})
        await this.save();
        return token;
    } catch (error) {
        res.send("The error part " + error);
        console.log("The error part " + error); 
    }
}



// CONVERTING PASSWORD INTO HASH
employeeSchema.pre("save", async function (next) {

    if (this.isModified("password")) {
        console.log(`The current password is ${this.password}`);
        this.password = await bcrypt.hash(this.password, 10);
        console.log(`The current password is ${this.password}`);

        this.confirmpassword = await bcrypt.hash(this.confirmpassword, 10);
    }

    next();
})

// now we need to create a collection 

const Register = new mongoose.model("Register", employeeSchema);

module.exports = Register;
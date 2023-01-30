require("dotenv").config()
const express = require('express')
const path = require('path')
const app = express();
const ejs = require("ejs")
const bcrypt = require("bcryptjs")
const cookieParser = require("cookie-parser")

require("./db/conn");
const Register = require("./models/registers");


const port = process.env.PORT || 3000

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(static_path))
app.set("view engine", "ejs");
app.set("views", template_path);

app.get("/", (req, res) => {
    res.render("register", { msg: '' });
})


app.post("/register", async (req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.cpassword;

        if (password === cpassword) {
            const registerEmployee = new Register({
                name: req.body.name,
                email: req.body.email,
                age: req.body.age,
                phone: req.body.phone,
                password: password,
                confirmpassword: cpassword
            })

            console.log("The success part " + registerEmployee);

            const token = await registerEmployee.generateAuthToken();
            console.log("The token part " + token);

            // The res.cokie() function is used to set the cokie name to value.
            // The value parameter may be a string or object converted to JSON

            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 30000),
                httpOnly: true
            });
            // console.log(cookie);

            // hash password before saving code is written in model file

            const registered = await registerEmployee.save();
            console.log("The page part " + registered);

            res.status(201).render("register", { msg: 'Registered Succesfully' });
        }
        else {
            // res.send("Invalid Credentials")
            res.render("register", { msg: 'Password did not match' });
        }
    } catch (error) {
        res.status(400).send(error)
    }
})

app.get("/login", (req, res) => {
    res.render("login", { msg: '' })
})

app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const usermail = await Register.findOne({ email: email });

        const isMatch = await bcrypt.compare(password, usermail.password);

        const token = await usermail.generateAuthToken();
        console.log("The token part " + token);

        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 50000),
            httpOnly: true
        });
        // console.log(cookie);

        console.log(`This is the cookie awesome ${req.cookies.jwt} `);

        console.log(isMatch);

        if (isMatch) {
            res.status(201).render("index");
        }
        else {
            // res.send("Invalid Credentials");
            res.render("login", { msg: 'Invalid Credentials' });
        }

    } catch (error) {
        // res.status(400).send("Invalid Credentials")
        res.render("login", { msg: 'Invalid Credentials' });
    }
})

app.listen(port, () => {
    console.log(`Server is running in port no ${port}`);
})
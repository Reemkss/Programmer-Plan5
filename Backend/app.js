const express = require("express");
const db = require("./models");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const multer = require("multer");
const path = require('path');
const { profile, log } = require("console");

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/uploads', express.static(__dirname + '/uploads'));

// Profile Image Storage
const imageStorage = multer.diskStorage({
    destination: "uploads",
    filename: function (req, file, cb) {
        cb(
            null,
            Date.now() + path.extname(file.originalname)
        );
    },
});

function checkImageFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (!mimetype && !extname) return cb(new Error('Invalid profile picture'));
    cb(null, true);
}

const uploadProfileImage = multer({
    storage: imageStorage,
    fileFilter: function (req, file, cb) {
        checkImageFileType(file, cb);
    }
}).single("profile");


app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if(!email) res.status(400).send("Email is missing");
    else if(!password) res.status(400).send("Password is missing");
    else {
      const user = await db.user.findOne({ where: { email }});
      if(user) {
        const isValidPass = bcrypt.compareSync(password, user.password);
        if(isValidPass) return res.send(user);
        else return res.status(400).send("Invalid credentials.");
      } else return res.status(400).send("Invalid credentials.");
    }
});

app.post("/register", uploadProfileImage, async (req, res) => {
    const { name, email, password } = req.body;
    try {
        
        const existingUser = await db.user.findOne({ where: { email } });

        if (existingUser) {
         
            return res.status(400).send("User already exists.");
        }
        const imagePath = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : '';

        const newUser = await db.user.create({
            name,
            email,
            password,
            picture: imagePath
        });

        res.status(201).send(newUser);
    } catch (error) {
        console.error("Error during registration:", error.message);
        res.status(500).send("Internal Server Error");
    }
});


app.post("/reset-password", async (req, res) => {
    const { email, password } = req.body;
   
    if (!email) {
        return res.status(400).send("Email is missing");
    }
   
    if (!password) {
        return res.status(400).send("Password is missing");
    }

    try {
        
        const existingUser = await db.user.findOne({ where: { email } });

        if (!existingUser) {
            return res.status(404).send("User not found.");
        }
        const encryptedPassword = await bcrypt.hash(password, 10);

     
        const updatedUser = await db.user.update(
            { password: encryptedPassword },
            { where: { email } }
        );

       
        res.status(200).send("Password updated successfully.");
    } catch (error) {
        
        console.error("Error during password reset:", error.message);
        res.status(500).send("Internal Server Error");
    }
});


app.listen(3000, () => {
    db.sequelize.sync();
    console.log("Server is running on port", 3000);
});




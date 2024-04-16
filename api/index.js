const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require('./models/User');
const Post = require('./models/Post')
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });

const app = express();
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(cookieParser());

// Serving static files
const path = require('path');
const uploadsDirectory = path.join(__dirname, 'uploads');
console.log("Uploads directory:", uploadsDirectory);
app.use('/uploads', express.static(uploadsDirectory));
// app.use(express.static(uploadsDirectory));
app.use('/uploads', express.static('uploads'));

// app.use('/uploads', express.static(__dirname, '/uploads'))

const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
const secret = "rameshsowmyapoojapavithra";
const fs = require('fs');

// Database connection
const dbURI = 'mongodb://localhost:27017/blog-website';
mongoose.connect(dbURI);

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    console.log(username, password)
    try {
        const userDoc = await User.create({
            username,
            password: bcrypt.hashSync(password, salt)
        })
        console.log(userDoc)
        res.json(userDoc);
    } catch (e) {
        res.status(400).json(e)
    }
})

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const userDoc = await User.findOne({ username });
        const passok = bcrypt.compareSync(password, userDoc.password)
        if (passok) {
            jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
                if (err) throw err;
                else res.cookie('jwt', token).json({
                    id: userDoc._id,
                    username
                });
            })
        }
    } catch (e) {
        console.log(e);
    }
})

app.get('/profile', (req, res) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, secret, {}, (err, info) => {
        if (err) throw err;
        else res.json(info);
    });
})

app.get('/post', async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('author', ['username'])
            .sort({ createdAt: -1 })
            .limit(20)
        res.json(posts);
    } catch (e) {
        res.json("error")
    }
})

app.post('/logout', (req, res) => {
    res.cookie('jwt', '').json("ok");
})

app.post('/post',
    uploadMiddleware.single('file'),
    async (req, res) => {
        try {
            const { originalname, path } = req.file;
            const parts = originalname.split('.');
            const ext = parts[parts.length - 1];
            const newPath = path + '.' + ext;
            fs.renameSync(path, newPath);

            const token = req.cookies.jwt;

            jwt.verify(token, secret, {}, async (err, info) => {
                if (err) throw err;
                const { title, summary, content } = req.body;
                const postDoc = await Post.create({
                    title,
                    summary,
                    content,
                    cover: newPath,
                    author: info.id
                })
                res.json(postDoc);
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    })
app.get('/post/:id', async (req, res) => {
    const { id } = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);
    if (postDoc) {
        console.log(postDoc)
        res.json(postDoc);
    }
    else res.json([])

})
app.put('/post/:id', uploadMiddleware.single('file'), async (req, res) => {
    let newPath = null;
    if (req.file) {
        const { originalname, path } = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
    }
    const token = req.cookies.jwt;
    jwt.verify(token, secret, {}, async (err, info) => {
        console.log("info,req", info, req.body);
        if (err) throw err;
        const { id, title, summary, content } = req.body;
        const postDoc = await Post.findById(id);
        console.log(postDoc.author, info.id);
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id)
        if (!isAuthor) {
            return res.status(400).json('you are not supposed to edit the page');
        }
        if (title) postDoc.title = title;
        if (summary) postDoc.summary = summary;
        if (content) postDoc.content = content;
        if (newPath) postDoc.cover = newPath;
        await postDoc.save();
        res.json(postDoc);
    });
})
app.listen(4000);

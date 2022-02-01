const express = require('express');
const { render } = require('express/lib/response');
const { result } = require('lodash');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const app = express();
const blog = require('./models/blog');
const multer = require('multer');
const path = require('path');
const dotenv = require('dotenv');
const authRoute = require('./routes/auth');
const User = require('./models/user');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const { registerValidation } = require('./routes/validation')
const { loginValidation } = require('./routes/validation');

var uname=null;

app.set('view engine', 'ejs');

dotenv.config();

//middleware
app.use(express.json());
//routes use

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
        console.log("connected");
    }).catch((err) => {
        console.log(err);
    });

    app.listen(3000);
    
    app.use(express.static(__dirname + '/public'));
    app.use(express.urlencoded({ extended: true }));
    
    if (typeof localStorage === "undefined" || typeof localStorage === null) {
        const LocalStorage = require('node-localstorage').LocalStorage;
        localStorage = new LocalStorage('./scretch');
    }
    
    var Storage = multer.diskStorage({
        destination: './public/uploads',
        filename: (req, file, cb) => {
            cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
        },
    });
    
    var upload = multer({
        storage: Storage,
    }).single('myfile');
    
    //image handling
    
    
    //image upload
    app.get('/register', (req,res)=> {
        res.status(200).render('signin');
    });
    
    //app registration
    app.post('/register', async (req, res) => {
        registerValidation(req.body);
        
        const EmailExist = await User.findOne({ email: req.body.email });
        if (EmailExist) return res.status(200).send("Email exist");
        
        //making hash password
        const salt = await bcryptjs.genSalt(10);
        
        const pass = await bcryptjs.hash(req.body.password, salt);
        
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: pass
        });
        user.save().then((result) => {
            res.redirect('/login');
        }).catch(err => res.status(300).send(err));
    });
    //just homepage
    app.get('/', (req, res) => {
        res.status(304).redirect('/register');
    });
    
    //login page
    app.get('/login', (req, res) => {
        res.status(200).render('login');
    });
    
    //post login logics
    app.post('/login', async (req, res) => {
        loginValidation(req.body);
    
        const EmailExist = await User.findOne({ email: req.body.email });
        if (!EmailExist) {
            res.status(400).send("Email Doesnt exist");
        }
        //making hash password
        const validPass = await bcryptjs.compare(req.body.password, EmailExist.password);
    
        if (!validPass) res.status(400).send("Incorrect Password");

        uname = EmailExist.name;
    
        const token = jwt.sign({_id: EmailExist._id}, process.env.TOKEN_SECRET);
        res.status(304).redirect('/blogs');
    });

    //about page
    app.get('/about', (req, res) => {
        res.status(200).render('about');
    });
    
    //blogs all
    app.get('/blogs', (req, res) => {
    blog.find().sort({ createdAt: -1 })
        .then((result) => {
            res.render('index', { blogs: result ,usrname: uname});
        }).catch((err) => {
            console.log(err);
        });
});

//pge for id wise
app.get('/blogs/:id', (req, res) => {
    const id = req.params.id;
    blog.findById(id)
        .then((result) => {
            res.render('./details', { blog: result, title: 'Blog Details',usrname: uname});
        }).catch((err) => {
            console.log(err);
        });
});

app.get('/blogs/update/:id', (req, res) => {
    const id = req.params.id;
    blog.findById(id).then(result => {
        res.render('edit', { blog: result });
    }).catch(err => res.send(err));
});

app.post('/blogs/update/:id', (req, res) => {
    var today = new Date();
    var dates = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const id = req.params.id;
    req.body.date = dates;
    blog.findByIdAndUpdate(id,req.body).then(result => {
        res.redirect(`/blogs/${id}`)
    }).catch(err => res.send(err));
})

app.post('/blogs', upload, (req, res) => {
    var today = new Date();
    var dates = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const newBlog = new blog({
        title: req.body.title,
        snippet: req.body.snippet,
        desc: req.body.desc,
        author: uname,
        image: req.file.filename,
        date: dates
    });

    newBlog.save()
        .then((result) => {
            res.redirect('/blogs');
        }).catch((err) => {
            console.log(err);
        });
});

//delete req
app.delete('/blogs/:id', (req, res) => {
    const id = req.params.id;
    blog.findByIdAndDelete(id)
        .then(result => {
            res.json({ redirect: '/blogs' });
        }).catch((err) => {
            console.log(err);
        });
});

//create page
app.get('/create', (req, res) => {
    res.status(200).render('create', { usrname: uname});
});

//aboutus redirect
app.get('/about-us', (req, res) => {
    res.status(304).redirect('/about', { usrname: uname});
});

//404
app.use((req, res) => {
    res.status(404).render('404', { usrname: uname});
});

//get login request
app.get('/login', (req,res) => {
    res.status(400).render('login');
})


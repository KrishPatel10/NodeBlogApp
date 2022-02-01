const router = require('express').Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const { registerValidation } = require('./validation')
const { loginValidation } = require('./validation');
const user = require('../models/user');

router.post('/register', async (req, res) => {
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
        res.send({ user: user._id });
    }).catch(err => res.status(300).send(err));
})

router.post('/login', async (req, res) => {
    loginValidation(req.body);

    const EmailExist = await User.findOne({ email: req.body.email });
    if (!EmailExist) {
        res.status(400).send("Email Doesnt exist");
    }
    //making hash password
    const validPass = await bcryptjs.compare(req.body.password, EmailExist.password);

    if (!validPass) res.status(400).send("Incorrect Password");

    const token = jwt.sign({_id: EmailExist._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
});

module.exports = router;
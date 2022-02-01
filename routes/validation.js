//validation
const Joi = require('@hapi/joi');

const registerValidation = (data) => {
    const schema = {
        name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password:  Joi.string().min(6).required()
    }

    const {error} = new Joi.ValidationError(data, schema);
    if(error) res.status(400).send(error.details[0].message);
}

const loginValidation = (data) => {
    const schema = {
        email: Joi.string().min(6).required().email(),
        password:  Joi.string().min(6).required()
    }

    const {error} = new Joi.ValidationError(data, schema);
    if(error) res.status(400).send(error.details[0].message);
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;

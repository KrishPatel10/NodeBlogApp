const mongoose = require("mongoose");
const schema = mongoose.Schema;

const blogSchema = new schema({
    title: {
        type: String,
        required: true
    },
    snippet: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    }
}, {timeStamps: true});

const blog = mongoose.model('blog', blogSchema);

module.exports = blog;
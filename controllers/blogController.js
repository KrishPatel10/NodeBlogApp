const Blog = require('../models/blog');

const blog_index = (req, res) => {
  Blog.find().sort({ "date": -1 })
    .then(result => {
      res.render('index', { blogs: result, title: 'All blogs' });
    })
    .catch(err => {
      console.log(err);
    });
}

const blog_details = (req, res) => {
  const id = req.params.id;
  Blog.findById(id)
    .then(result => {
      res.render('details', { blog: result, title: 'Blog Details' });
    })
    .catch(err => {
      console.log(err);
    });
}

const blog_reg = (reg, res) => {
  res.status(200).render('signin')
}

const blog_create_get = (req, res) => {
  res.render('create', { title: 'Create a new blog' });
}

const blog_create_post = (req, res) => {  
  console.log(req.body.author+"s");
  var today = new Date();
  var dates = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  const b = {
        title: req.body.title,
        snippet: req.body.snippet,
        desc: req.body.desc,
        author: req.body.author,
        image: req.file.filename,
        date: dates
  }
  const blog = new Blog(b);
  blog.save()
    .then(result => {
      console.log('dddd');
      res.redirect('/blogs');
    })
    .catch(err => {
      console.log(err);
    });
}

const blog_delete = (req, res) => {
  const id = req.params.id;
  Blog.findByIdAndDelete(id)
    .then(result => {
      res.json({ redirect: '/blogs' });
    })
    .catch(err => {
      console.log(err);
    });
};

const blog_update_get = (req,res)=> {
  console.log('recieved');
  const id = req.params.id;
  blog.findById(id).then(result => {
      res.render('edit',{blog:result});
  }).catch(err => res.send(err));
};

const blog_update_post = (req,res) => {
  const id = req.params.id;
  blog.findByIdAndUpdate(id,req.body).then(result => {
      res.redirect(`/blogs/${id}`)
  }).catch(err => res.send(err));
};

module.exports = {
  blog_index, 
  blog_details, 
  blog_create_get, 
  blog_create_post, 
  blog_delete,
  blog_update_get,
  blog_update_post
}
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
mongoose.set('strictQuery', false);
const ejs = require("ejs");
const _ = require("lodash");


//mongoose.connect("mongodb://127.0.0.1:27017/blogDB");
const uri = process.env.MONGODB_URI;
mongoose.connect(uri, { useNewUrlParser: true });

const blogSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Blog = mongoose.model('Blog', blogSchema);

const homeStartingContent = `Welcome to my blog! My name is Ritu Raj and I am excited to share my thoughts, ideas, and experiences with you.

This blog is a platform for me to share my passion for new emerging technologies. Here, you will find a wide variety of content including tutorials, personal reflections, and insights on the latest developments in the field.

Whether you're a beginner or an expert, there is something for everyone here. I strive to create high-quality, informative, and engaging content that will inspire and educate my readers.

I hope you will enjoy reading my blog as much as I enjoy creating it. Thank you for visiting and I look forward to connecting with you in the comments section.

Make sure to subscribe to stay updated on new post and follow me on social media to get even more insights.`;

const aboutContent = `I am a B.Tech student at MNIT Jaipur, and I am currently pursuing my degree in Civil Engineering. Throughout my academic journey, I have developed a keen interest in software development and web development. I have always been fascinated by the power of technology and the impact it has on our daily lives.

I have a strong foundation in programming languages such as C, C++, and Python. I have used these languages to develop various projects and have gained a deep understanding of their concepts and applications. In addition, I have experience working with the MERN stack, which includes MongoDB, Express.js, React, and Node.js. This stack allows me to develop web applications using a JavaScript-based technology stack, which is a popular choice for many developers.

In addition to my technical skills, I am a quick learner and an avid problem solver. I am always eager to take on new challenges and am dedicated to finding creative solutions to any problem that I may encounter. I am also an excellent team player, and I enjoy collaborating with others to achieve common goals.

As a software developer and web developer, I am constantly looking for opportunities to improve my skills and stay up-to-date with the latest technologies. I have a deep interest in front-end and back-end development, and I am always looking for ways to improve the user experience of web applications. I am also interested in data analytics, machine learning, and artificial intelligence, and I believe these technologies have the potential to change the way we live and work.

In the future, I hope to work as a software developer or web developer in a company that values innovation and creativity. I am excited about the opportunity to work on projects that have a real impact on people's lives and make a positive difference in the world. I am also eager to continue learning and growing my skills in the field, and I believe that my passion for software development and web development will lead me to a successful and fulfilling career.`;

const contactContent = `Thank you for visiting my blog! I hope you found the information and resources on my website helpful. If you have any questions, comments, or suggestions, please don't hesitate to contact me.

The best way to reach me is through email at rajritu2084@gmail.com. I will do my best to respond to your inquiry as soon as possible.

You can also connect with me on social media. You can find my profile links on the top or bottom of the website.

I would love to hear from you and I am always open to suggestions for new content or ways to improve my blog. If you have an idea for a post or a topic you'd like me to cover, please don't hesitate to let me know.

Thank you for your support, and I look forward to connecting with you!`

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){
   Blog.find({}, function(err, foundPosts){
    if(err) throw err;
    else{
      res.render("home", {startingContent: homeStartingContent, posts : foundPosts});
    }
  });
  
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});


app.post("/compose", function(req, res){
  const newPost = new Blog({
    title: req.body.postTitle,
    content: req.body.postContent
  });
  newPost.save(function(err){
    if(!err){
      res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res){

  const requestedPostId = req.params.postId;

  Blog.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      postTitle: post.title,
      postContent: post.content
    });
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server has started successfully");
});

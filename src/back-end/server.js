const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

const Posts = require("./schemas/Post");

mongoose
  .connect(
    "mongodb+srv://root:s4saPqI6r9d52AHA@cluster0.joo18xk.mongodb.net/noticias?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("conectado");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.use("/public", express.static(path.join(__dirname, "../public")));
app.set("views", path.join(__dirname, "../pages"));

app.get("/", async(req, res) => {
  const { busca } = req.query;

  if (busca == null) {
    const dataPosts = await Posts.find({}).sort({ _id: -1 }).exec();

    const dataMostReadPosts = await Posts.find({})
      .sort({ views: -1 })
      .limit(3)
      .exec();

    res.render("home", { posts: dataPosts, mostRead: dataMostReadPosts });
  } else {

    const searchPosts = await Posts.find({titulo: {$regex: busca, $options: "i"}}).then((post) => post);
    const postLength = searchPosts.length;

    res.render("busca", {posts: searchPosts, postLength: postLength});
  }
});

app.get("/:slug", async (req, res) => {
  const postSingle = req.params.slug;

  const postDB = await Posts.findOneAndUpdate(
    { slug: postSingle },
    { $inc: { views: 1 } },
    { new: true }
  ).then((post) => post);

  const dataMostReadPosts = await Posts.find({})
    .sort({ views: -1 })
    .limit(3)
    .exec();

  if (postDB !== null) {
    res.render("single", { noticia: postDB, mostRead: dataMostReadPosts });
  } else {
    res.redirect("/");
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log("server está rodando!");
});

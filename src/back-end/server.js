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

app.get("/", async (req, res) => {
  const { busca } = req.query;

  if (busca == null) {
    const dataPosts = await Posts.find({})
      .sort({ _id: -1 })
      .exec()
      .then((posts) => {
       return posts.map((post)=>{
            return {
                titulo: post.titulo,
                imagem: post.imagem,
                categoria: post.categoria,
                conteudo: post.conteudo,
                conteudoCurto: post.conteudo.substring(0, 150),
                slug: post.slug
              }
        }) 
      });

    res.render("home", { posts: dataPosts });
  } else {
    res.render("busca", {});
  }
});

app.get("/:slug", (req, res) => {
    const postSingle = req.params.slug;
    Posts.findOneAndUpdate({postSingle}, {$inc: { views: 1 }}, {new: true}).then(single =>{
        console.log(single);
    })
  res.render("single", {});
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log("server está rodando!");
});

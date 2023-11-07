const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//cria um estrutura da nossa coleção para realizar consultas
//segundo para é a coleção conrrespondente a esse schema
const postSchema = new Schema(
  {
    titulo: String,
    imagem: String,
    categoria: String,
    conteudo: String,
    slug: String,
    author: String,
    views: Number
  },
  { collection: "posts" }
);

//cria o modelo usando o mongoose 
const Posts = mongoose.model("Posts", postSchema);

module.exports = Posts;

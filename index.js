const express = require('express');
const cors = require('cors');
// const MongoClient = require ('mongodb').MongoClient;
require('dotenv').config()
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5h4lz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();

app.use(express.json());
app.use(cors());

const port= 5000;

app.get('/', (req, res) => {
    res.send('Hello news portal!')
  })
  
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  client.connect(err => {
    const adminCollection = client.db(`${process.env.DB_NAME}`).collection("admin");
    const newsCollection = client.db(`${process.env.DB_NAME}`).collection("news");

    app.post('/addAdmin',(req,res)=>{
      adminCollection.insertOne(req.body)
            .then(result => res.send(!!result.insertedCount))
    })
    
    app.post('/addNews', (req,res)=> {
      newsCollection.insertOne(req.body)
      .then(result=> res.send(!!result.insertedCount))
    })

    app.get('/news',(req,res)=>{
      newsCollection.find({})
      .toArray((err,docs)=>res.send(docs))
    })

    app.post('/isAdmin', (req, res)=>{
      const email = req.body.email;
      adminCollection.find({ email: email})
      .toArray((err, admin)=>{
       res.send(admin.length> 0);
      })
})
      

  })



  app.listen(process.env.PORT || port)
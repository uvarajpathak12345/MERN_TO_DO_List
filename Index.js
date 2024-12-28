const express = require("express");
const cors = require('cors');
const {connection , getDb} = require('./Dbconn')
const app = express();
const {ObjectId} = require('mongodb')

app.use(cors());
app.use(express.json())


let dbdata

connection ((err) => {
    if(!err){
        app.listen(3000, () => {
            console.log("port is listening in 3000")
        }) 
        dbdata = getDb()
    }
})

app.get('/get', (req, res) => {
    dbdata.collection('Todo')
        .find()
        .toArray() // Converts the cursor to an array of documents using this it do not print the repeated data
        .then(datas => {
            res.status(200).json(datas); // Sends the array directly
        })
        .catch(err => {
            console.error("Error fetching data:", err); // Log error for debugging
            res.status(500).json({ message: "Failed to fetch data", error: err });
        });
});


app.post('/add', (req,res) => {
    let data = req.body.Todos

    dbdata.collection('Todo')
    .insertOne(data)
    .then(result => {
        res.status(200).json(result)
    })
    .catch(err => {
        res.status(500).json({err: 'failed to add data'})
    })
})

app.patch('/update/:id', (req,res) => {
    let id = req.params
    let donedata = req.body.done
    dbdata.collection('Todo')
    .updateOne({_id:new ObjectId (id)} ,{$set : {done:donedata}})
    .then(result => {
        res.status(200).json(result)

    })
    .catch(Err => {
        res.status(500).json(err)
    }) 
})


app.delete('/delete/:id',(req,res) => {
    let id = req.params.id
    dbdata.collection('Todo')
    .deleteOne({_id: new ObjectId(id)})
    .then(result => {
        res.status(200).json(result)
    })
    .catch(err => {
        res.status(500).json(err) 
    })
})

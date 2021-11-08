const { MongoClient } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;
// middleware
app.use(cors());
app.use(express.json());

// MongoDb Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.trmxc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri);

async function run() {
    try {
        await client.connect();
        const database = client.db('events-service');
        const eventCollection = database.collection("events");
        const bookingCollection = database.collection('booking')
        // Get Api
        app.get('/events', async (req, res) => {
            const cursor = eventCollection.find({});
            const events = await cursor.toArray();
            res.send(events);
        })
        // Send Post
        app.post('/events', async (req, res) => {
            const newUser = req.body;
            const result = await eventCollection.insertOne(newUser);
            res.json(result)
        })
        // Delete Post
        app.delete('/events:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await eventCollection.deleteOne(query);
            res.json(result)
        })
        // booking post collection
        app.post('/booking', async (req, res) => {
            const newUser = req.body;
            const result = await bookingCollection.insertOne(newUser);
            res.json(result)
        })



    }
    finally {
        // await client.close();
    }


}
run().catch(console.dir)




app.get('/', (req, res) => {
    res.send('MT server is running ok')
})

app.listen(port, () => {
    console.log('Server running at port', port);
})
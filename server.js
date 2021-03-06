const express = require("express");
const routes = require('./routes/api');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require("cors");

//set up express app
const app = express();

app.use(bodyParser.json(), cors());
app.use(bodyParser.urlencoded({ extended: true }));

//connect to MongoAtlas
const MongoClient = require('mongodb').MongoClient;
const path = require('path');
const PORT = process.env.PORT || 5000;
const MongoAtlasURL = 'mongodb+srv://Taras:Qaz123@cluster0-xhxir.mongodb.net/cookBook?retryWrites=true&w=majority';

const option = {
	socketTimeoutMS: 30000,
	keepAlive: true,
	reconnectTries: 30000,
	useUnifiedTopology: true,
	useNewUrlParser: true,
	useFindAndModify: false
};

MongoClient.connect(MongoAtlasURL, (err, client) => {
	if (err) {
		console.log('Error occurred while connecting to MongoDB...', err);
	}
	console.log('Connected to Mongodb');
	const collection = client.db('cookBook').collection('recipeItems');
	client.close();
});

mongoose.Promise = Promise;
mongoose.connect(MongoAtlasURL, option);
mongoose.Promise = global.Promise;

app.use(express.static(path.join(__dirname, '/client/build')));

//initialize routes
app.use('/', routes)

//error handling middleware
app.use((err, req, res, next) => {
    res.send({error: err.message})
})

//listen for requests
app.listen(PORT, function(){
    console.log('now listening for request')
})
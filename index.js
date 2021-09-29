const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const TestModel = require('./model/Test')

app.use(express.json()); // enable to use JSON type from API
// app.use(cors());         // enable cross origin to cooperate 

// ** MIDDLEWARE ** //
const whitelist = ['http://localhost:3000','http://localhost:8080','https://shrouded-journey-38552.heroku.com']
const corsOptions = {
  origin: function (origin, callback) {
    console.log("** Origin of request " + origin)
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      console.log("Origin acceptable")
      callback(null, true)
    } else {
      console.log("Origin rejected")
      callback(new Error('Not allowed by CORS'))
    }
  }
}
app.use(cors(corsOptions))

mongoose.connect('mongodb+srv://brent:brentPW12@cluster-starter.g5eso.mongodb.net/mern?retryWrites=true&w=majority',{
    useNewUrlParser: true,
});

app.use("/allData", (req,res) => {
    TestModel.find({}, (error, result) => {
        if (error){
            res.send(error);
        }
        res.send(result);
    }
    );
})


app.get('/:email', (req, res) => {    
    if (!req.params.email){
        return;
    }
    let email = req.params.email;
    TestModel.findOne({email: email})
        .then(result => {
            console.log(email);
            res.send(result);
        });
});

app.post('/add', async (req,res) =>{

    const name = req.body.name
    const email = req.body.email
    const password = req.body.password
    const amount = req.body.amount

    const test = new TestModel({name: name, email: email, password: password, amount: amount});

    try{
        await test.save();
    } catch (error) {
        console.log(error);
    }
});

app.put('/update', async (req,res) =>{

    const changedPassword = req.body.changedPassword
    const id = req.body.id

    try{
        await TestModel.findById(id, (error, updatePassword)=>{
            updatePassword.password = changedPassword
            updatePassword.save();
            res.send('update');
        });
    } catch (error) {
        console.log(error);
    };
});

app.put('/updateAmount', async (req,res) =>{

    const changedAmount = req.body.changedAmount
    const id = req.body.id

    try{
        await TestModel.findById(id, (error, updateAmount)=>{
            updateAmount.amount = changedAmount
            updateAmount.save();
            res.send('update');
        });
    } catch (error) {
        console.log(error);
    };
});

app.put('/addedFund', async (req,res) =>{

    const addedFund = req.body.addedFund
    const email = req.body.email

    try{
        await TestModel.findById(email, (error, updateAddedFund)=>{
            updateAddedFund.amount = addedFund
            updateAddedFund.save();
            res.send('update');
        });
    } catch (error) {
        console.log(error);
    };
});

app.delete('/delete/:id', async (req, res) => {
    const id = req.params.id;

    await TestModel.findByIdAndRemove(id).exec();
    res.send('deleted');
});


if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, 'client/build')));
  // Handle React routing, return all requests to React app
    app.get('*', function(req, res) {
      res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
  }

app.listen(3001, () =>{
    console.log('running on 3001')
});
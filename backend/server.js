const express = require ('express');
const cors = require ('cors');
const mongoose = require ('mongoose')
require ('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/airafi" ;
mongoose.connect(mongoURI)
    .then(()=>console.log('connected to db'))
    .catch((error)=> console.error('db connection error : ', error));

app.get('/' , (req,res) => {
    res.send('Airafi\'s backend is reachable');
});


const PORT = process.env.PORT || 8000 ; 

app.listen(PORT , () => {
    console.log(`server id on port ${PORT}`);
});


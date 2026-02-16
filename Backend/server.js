const express=require('express')
const mongoose=require('mongoose')
const app=express()
const dotenv=require('dotenv')
dotenv.config();
const user=require('./routes/userRoute.js')
const cors=require('cors')

mongoose.connect(process.env.MONGO_URL).then(()=>console.log("mongodb connected")).catch((err) => console.log(err));

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());



app.use('/user',user)

app.get('/',(req,res)=>{
    res.send("hello");
})

app.listen(5000,()=>{
    console.log('server is running on port 5000')
})
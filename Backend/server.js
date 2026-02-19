const express=require('express')
const app=express()
const dotenv=require('dotenv')
dotenv.config();
const user=require('./routes/userRoute.js')
const cors=require('cors')


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
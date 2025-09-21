const express=require('express');
const app=express();

const path=require('path');
const mongoose=require('mongoose');
 
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI,{dbName:'contacts_app'}).then(()=>console.log('MongoDb connected'))
.catch((e)=>{console.error(e); process.exit(1);});



app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
//static files woh files hoti jisme aap video,audio,images 
app.use(express.static(path.join(__dirname,"public")));

app.get('/',function(req,res){
    res.render("index");
});
//here we are doing route mounting 
app.use('/contacts',require('./routes/contacts'));

//if user lets hits any routes that we did not defined that start with /contacts
app.use((req,res,next)=>{
    if(req.path.startsWith('/contacts')){
        return res.status(404).json({ok:false,error:'Not found'});
    }
    next();
});

app.use((err,req,res,next)=>{
    console.error(err);
    res.status(500).json({ok:false,error:'Internal server error'});
});

const PORT=process.env.PORT||3000;
app.listen(PORT,()=>console.log(`http://localhost:${PORT}`));
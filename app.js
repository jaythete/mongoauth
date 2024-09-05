const express = require('express');
const app =express();
const usermodel= require("./models/user");
const postmodel = require("./models/post");
const cookieParser = require('cookie-parser');
const bcrypt= require('bcrypt');
const jwt = require('jsonwebtoken');

app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.get('/',(req , res)=>{
  res.render("index");
})

app.get('/profile', isLoggedIn ,async (req, res)=>{
  let user = await usermodel.findOne({email: req.user.email})
    console.log(req.user);
    res.render("profile", {user});
})

app.post('/register', async (req,res)=>{
  let {email, password, username ,name, age} = req.body;
//   let user = await usermodel.findOne({email});
//   if(user) return res.status(500).send("User Already Registeres");

  bcrypt.genSalt(10,(err,salt)=>{
    bcrypt.hash(password, salt, async (err,hash)=>{
       await usermodel.create({
            usermodel,
            email,
            age,
            name,
            password: hash
        });
        let token= jwt.sign({email:email , userid: usermodel._id},"mine");
        res.cookie("token", token);
        res.send("registered");
    })
  })

});

app.get('/login', (req, res)=>{
    res.render("login");
});

app.post('/login', async (req,res)=>{
    let {email, password} = req.body;
    let user = await usermodel.findOne({email});
    if(!user) return res.status(500).send("Not A User");
    
    bcrypt.compare(password, user.password, function(err, result){
        if(result){ 
            let token= jwt.sign({email:email , userid: usermodel._id},"mine");
            res.cookie("token", token);
            res.status(200).redirect("/profile");
        }
        else res.redirect("/login");
    });
  
  });

app.get("/logout", (req, res)=>{
    res.cookie("token","" );
    res.redirect("/login");
});

function isLoggedIn(req, res, next){
    if(req.cookies.token==="")res.redirect("/login");
    else{
       let data = jwt.verify(req.cookies.token,"mine");
       req.user = data;
    }
        next();
}

app.listen(3000);
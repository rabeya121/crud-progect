const express = require('express');
const router = express.Router();
const Student=require('../models/student');
const multer= require('multer');
const student = require('../models/student');
const fs = require('fs');

//image uplode
var storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./uplodes');
    },
    filename:function(req,file,cb) {
        cb(null,file.fieldname+"_"+Date.now()+"_"+file.originalname);
    },
});
var uplode = multer({
   storage:storage, 
}).single('image'); 

//Insert an user into database route
router.post("/add", uplode, (req, res) => {
    const student =new Student({
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone,
        image: req.file.filename,
    });
    student.save((error)=>{
        if(err){
            res.json({message:err.message, type:denger});
        }else{
            req.session.message ={
                type : "success",
                message:"Student added successfully!",

            };
            res.redirect("/");
        }

    })
});

//get all students route
router.get("/", async (req, res) => {
    try {
        const students = await Student.find().exec();
        res.render("index", {
            title: "Home page",
            student: students,
        });
    } catch (error) {
        res.json({ message: error.message });
    }
});

 

router.get("/add",(req,res)=>{
    res.render("add_student",{title: "Add Student"});
})

//edit an stident rout
router.get('/edit/:id',(req,res)=>{
    let id = req.params.id
    Student.findById(id,(ree,student)=>{
        if(err){
            res.redirect('/');

        }else{
            if(user == null){
                res.redirect('/');
            }else{
                res.redirect("edit_student",{
                    title: "Edit Student",
                    student : student,
                });
            }
        }
    });

});
//update student rout
router.post('/update/:id',uplode, (req,res)=>{
    let id = req.params.id;
    let new_image ='';

    if(req.file){
        new_image=req.file.filename;
        try{
            fs.unlinkSync('./uplode'+req.body.old_image);
        }catch(err){
            console.log(err);

        }
    }else{
        new_image = req.body.old_image;
    }
    Student.findByIdAndUpdate(id,{
        name: req.body.name,
        email:req.body.email,
        phone: req.body.phone,
        image: new_image,
    },(err,result)=>{
        if (err){
            res.json({message:err.message, type:'danger'});
        }else{
           req.session.message={
            type: "success",
            message: "Student update successfully",
           } ;
           res.redirect("/");
        }
    });
});

//delete
router.get('/delete/:id',(req,res)=>{
    let id= req.params.id;
    Student.findByIdAndRemove(id,(err,result)=>{
        if(result.image != ''){
            try{
                fs.unlinkSync('./uplodes/'+result.image);

            }catch(err){
                console.log(err);
            }
        }

        if(err){
           res.json({message:err.message});

        }else{
            req.session.message = {
                type: 'info',
                message:'Stuudent deleteed successfully!',
            };
            res.redirect('/');
        }

    });

});

module.exports = router;

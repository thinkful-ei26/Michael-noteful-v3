'use strict';

const express = require('express');

const router = express.Router();
const Tag = require('../models/tags');

router.get('/', function (req,res,next) {

    return Tag.find({})
    .then(results => {
        if(results){
            res.status(200).json(results);
        }else{
            res.sendStatus(404);
        }
    })
})

router.get('/:id', function (req,res,next) {
    const id = req.params.id;
    if(mongoose.Types.ObjectId.isValid(id)){

    return Tag.findById(id)
    .then(results => {
        if(results){
            res.status(200).json(results);
        }else{
            res.sendStatus(404);
        }
    })
    }else{
        res.sendStatus(400);
    }
})

router.post('/', function (req,res,next) {
    const newItem = {
        "name": req.body.name
    }
    console.log(newItem)
    return Tag.create(newItem)
    .then(results => {
        if(results){
            res.status(201).json(results);
        }else{
            res.sendStatus(404);
        }
    })
})

router.put('/:id', function (req,res,next) {
    const id = req.params.id;
    const newItem = {
        "name": req.body.name
    }
    if(mongoose.Types.ObjectId.isValid(id)){

    return Tag.findByIdAndUpdate(id,newItem,{new: true,upsert: true})
    .then(results => {
        if(results){
            res.status(200).json(results);
        }else{
            res.sendStatus(404);
        }
    })
}else{
    res.sendStatus(400);
}
})

router.delete('/:id', function (req, res,next) {
    const id = req.params.id;
    if(mongoose.Types.ObjectId.isValid(id)){
    return Tag.findByIdAndDelete(id)
    .then(()=>{
        res.sendStatus(204);
    })
    }else{
        res.sendStatus(400);
    }
})


module.exports = router;
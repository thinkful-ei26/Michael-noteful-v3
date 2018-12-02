'use strict';
const mongoose = require('mongoose');
const express = require('express');

const router = express.Router();
const Tag = require('../models/tags');
const Note = require('../models/note');

router.get('/', function (req,res,next) {

    return Tag.find({}).sort({name: 'asc'})
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
        const err = new Error("Bad Id");
        err.status = 400;
        return next(err);
    }
    return Tag.findById(id)
    .then(results => {
        if(results){
            res.status(200).json(results);
        }else{
            const err = new Error("Bad Id");
            err.status = 400;
            return next(err);
        }
    })
})

router.post('/', function (req,res,next) {

    if(!req.body.name){
        return res.send(400).json("Invalid name/Name is required");
    }

    const newItem = {
        "name": req.body.name
    }
    return Tag.create(newItem)
    .then(results => {
        if(results){
            res.location(`localhost:8080/api/tags/${results.id}`).status(201).json(results);
        }else{
            const err = new Error("Unable to create note: Internal server Error");
            err.status = 500;
            return next(err);
        }
    })
    .catch(err => {
        if (err.code === 11000) {
          err = new Error('The Note name already exists');
          err.status = 500;
        }
        next(err);
      });   
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
            res.json(results);
        }else{
            const err = new Error("Unable to locate Resource");
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => {
        if (err.code === 11000) {
          err = new Error('The folder name already exists');
          err.status = 400;
        }
        next(err);
      });   
}else{
    res.sendStatus(400);
}
})

router.delete('/:id', function (req, res,next) {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const err = new Error('The `id` is not valid');
        err.status = 400;
        return next(err);
      }

      const tagRemovePromise = Tag.findByIdAndRemove( id );
    
      const noteRemovePromise = Note.updateMany(
        { tags:{$in: id}},
        { $pull: {tags: id }}
      );

      Promise.all([tagRemovePromise,noteRemovePromise])
      .then(() => {
          res.status(204).end();
      })
});

module.exports = router;
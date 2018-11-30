'use strict';
const mongoose = require('mongoose');

const express = require('express');

const router = express.Router();
const Folder = require('../models/folder');
const Note = require('../models/note');


router.get('/', function(req,res,next){
    return Folder.find({}).sort({name: 'desc'})
    .then(results => {
        res.json(results);
    })
    .catch(err => {
        next(err);
      });
})

router.get('/:id', function(req,res,next){
    const id = req.params.id;
    if(mongoose.Types.ObjectId.isValid(id)){
    return Folder.findById(id)
    .then(result => {
        res.status(200).json(result);
    })
    .catch(err => {
        next(err);
      });
    }else{
        res.sendStatus(404);
    }
})

router.post('/', function (req,res,next) {
    const {name} = req.body;
    return Folder.create({name})
    .then(result => {
        res.location(`${req.url}`).status(201).json(result);
    })
    .catch(err => {
        if (err.code === 11000) {
          err = new Error('The folder name already exists');
          err.status = 400;
        }
        next(err);
      });   
})

router.put('/:id', function (req,res,next) {
    const id = req.params.id;
    const bodyInfo = {
        name: req.body.name,
    }
    if(mongoose.Types.ObjectId.isValid(id)){

    return Folder.findByIdAndUpdate(id,bodyInfo,{new: true,upsert: true})
    .then(result => {
        if(result){
            res.status(200).json(result);
        }else{
            res.status(400);
        }
    })
    .catch(err => {
        if (err.code === 11000) {
          err = new Error('The folder name already exists');
          err.status = 400;
        }
        next(err);
      });   
}})

router.delete('/:id', function (req, res, next) {
   const id = req.params.id;

   const folderRemovePromise = Folder.findByIdAndRemove( id );

   const noteRemovePromise = Note.updateMany(
    { folderId: id },
    { $unset: { folderId: '' } }
  );

   if(mongoose.Types.ObjectId.isValid(id)){
    Promise.all([folderRemovePromise, noteRemovePromise])
    .then(() => {
      res.status(204).end();
    })
    .catch(err => {
      next(err);
    });
   }else{
       res.sendStatus(404);
   }
})


module.exports = router;
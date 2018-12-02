'use strict';
const mongoose = require('mongoose');

const express = require('express');

const router = express.Router();
const Folder = require('../models/folder');
const Note = require('../models/note');


router.get('/', function(req,res,next){
    return Folder.find({}).sort({name: 'asc'})
    .then(results => {
        res.json(results);
    })
    .catch(err => {
        const err = new Error("Missing a title");
        err.status = 400;
        next(err);
      });
})

router.get('/:id', function(req,res,next){
    const id = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(id)){
        const err = new Error("Bad Id");
        err.status = 400;
        return next(err);
    }
        
    return Folder.findById(id)
        .then(result => {
            if(result){
                res.json(result);
            }else{
                const err = new Error("No results");
                err.status = 400;
                next(err);
            }
        
    })
    .catch(err => {
        const err = new Error("Error during request :id");
        err.status = 400;
        return next(err);
      });
    
})

router.post('/', function (req,res,next) {
    const {name} = req.body;
    if(!name){
        const err = new Error("Note requires a name");
        err.status = 400;
        return next(err);
    }
    if(!mongoose.Types.ObjectId.isValid(id)){
        const err = new Error("Bad Id");
        err.status = 400;
        return next(err);
    }
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
    if(!mongoose.Types.ObjectId.isValid(id)){
        const err = new Error("Bad Id");
        err.status = 400;
        return next(err);
    }
    return Folder.findByIdAndUpdate(id,bodyInfo,{new: true})
    .then(result => {
        if(result){
            res.status(200).json(result);
        }else{
            const err = new Error("No results");
            err.status = 400;
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
})

router.delete('/:id', function (req, res, next) {
   const id = req.params.id;

   if(!mongoose.Types.ObjectId.isValid(id)){
    const err = new Error("Bad Id");
    err.status = 400;
    return next(err);
}
   const folderRemovePromise = Folder.findByIdAndRemove( id );

   const noteRemovePromise = Note.updateMany(
    { folderId: id },
    { $unset: { folderId: '' } }
  );
    Promise.all([folderRemovePromise, noteRemovePromise])
    .then(() => {
      res.status(204).end();
    })
    .catch(err => {
      next(err);
    });
   
})


module.exports = router;
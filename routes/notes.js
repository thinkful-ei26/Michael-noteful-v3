'use strict';
const mongoose = require('mongoose');
const express = require('express');

const router = express.Router();
const Note = require('../models/note');
const Tag = require('../models/tags');

/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {
  const {searchTerm, folderId} = req.query;
  const re = searchTerm && RegExp(searchTerm, 'i');
  const filter = {
    $and: [
      re ? {$or: [{'title': re}, {'content': re}]}: {},
      folderId ? {folderId}: {},
    ]
  };
   return Note.find(filter).sort({ updatedAt: 'desc' })
    .populate('tags')
    .then(results => {
    res.json(results);
  })
  .catch(err => {
    res.sendStatus(500);
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  });
});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  console.log('hitting the route')
  return Note.findById(id)
  .populate('tags')
  .then(results => {
    console.log(results);

    if(!results){
      res.sendStatus(404);
    }else{
      res.json(results);
  }})
  .catch(err => {
    res.sendStatus(404);
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  })

});

/* ========== POST/CREATE AN ITEM ========== */
router.post('/', (req, res, next) => {
  const {title,content, tags} = req.body;
  let {folderId} = req.body;
  const updateObj = {
    title,
    content,
    folderId,
    tags
  }
  let boolTime = true;
  //Check for vaild title
  if(!title){
    const err = new Error("Missing a title");
    err.status = 400;
    return next(err);
  }
  
  //Check the folder
  console.log(folderId);
  if(folderId === ""){  
    updateObj.folderId = "000000000000000000000000";
  }else{
    if(!mongoose.Types.ObjectId.isValid(folderId)){
      const err = new Error("Missing a folderId");
      err.status = 400;
      return next(err);
    }
  }

  //Check the tags array
  if(tags){
    tags.map(tempTagId => {
      if(!mongoose.Types.ObjectId.isValid(tempTagId)){
        const err = new Error("bad tag");
        err.status = 400;
        boolTime = false;
        return next(err);
      }
    })
  }
 
  if(boolTime){
    return Note.create(updateObj)
    .then(results => {
        res.location(`${req.originalUrl}/${results.id}`).status(201).json(results);
    })
    .catch(err => {
      res.sendStatus(500);
      console.error(`ERROR: ${err.message}`);
      console.error(err);
    }) 
  }
});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:id', (req, res, next) => {
  const id = req.params.id;
  
  const bodyInfo = {
    title: req.body.title,
    content: req.body.content,
    folderId: req.body.folderId,
    tags: req.body.tags
  }
  let boolTime = true;
  //Check for vaild title
  if(!bodyInfo.title){
    const err = new Error("Missing a title");
    err.status = 400;
    return next(err);
  }
  
  //Check the folder
  if(!mongoose.Types.ObjectId.isValid(bodyInfo.folderId)){
    const err = new Error("Missing a folderId");
    err.status = 400;
    return next(err);
  }

  //Check the tags array
  if(bodyInfo.tags){
    console.log("checking tags");
    bodyInfo.tags.map(tempTagId => {
      console.log(tempTagId);
      if(!mongoose.Types.ObjectId.isValid(tempTagId)){
        console.log('I found a bad tag!!!');
        const err = new Error("bad tag");
        err.status = 400;
        boolTime = false;
        return next(err);
      }
    })
  }
if(boolTime){
  return Note.findByIdAndUpdate(id,bodyInfo, {new: true,upsert: true})
  .then( results => {
    
    res.status(200).json(results);
  })
  .catch(err => {
    res.sendStatus(500);
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  })
}
});


/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  return Note.findByIdAndRemove(id)
  .then(() => {
    res.status(204).end();
  })
  .catch(err => {
    res.sendStatus(500);
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  })
});

module.exports = router;
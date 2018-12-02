'use strict';
const mongoose = require('mongoose');
const express = require('express');

const router = express.Router();
const Note = require('../models/note');
const Tag = require('../models/tags');

/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {
  const {searchTerm, folderId} = req.query;
  if(!mongoose.Types.ObjectId.isValid(id)){
    const err = new Error("Bad Id");
    err.status = 400;
    return next(err);
}
  const re = searchTerm && RegExp(searchTerm, 'i');
  const filter = {
    $and: [
      re ? {$or: [{'title': re}, {'content': re}]}: {},
      folderId ? {folderId}: {},
    ]
  };
   return Note.find(filter).sort({ updatedAt: 'asc' })
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
  return Note.findById(id)
  .populate('tags')
  .then(results => {

    if(results){
      res.json(results);
    }else{
      const err = new Error("Resource not found");
      err.status = 404;
      return next(err);
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
    let badTag = false;
    let err;
    tags.map(tempTagId => {
      if(!mongoose.Types.ObjectId.isValid(tempTagId)){
        err = new Error("bad tag");
        err.status = 400;
        badTag = true;
      }
    })
    if(badTag){
      return next(err);
    }
  }
 
  return Note.create(updateObj)
  .then(results => {
      res.location(`${req.originalUrl}/${results.id}`).status(201).json(results);
  })
  .catch(err => {
    res.sendStatus(500);
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  }) 

});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:id', (req, res, next) => {
  const id = req.params.id;
  const {title, content,folderId,tags} = req.body;
  const bodyInfo = {
    title,
    content,
    folderId,
    tags
  }

  //Check the ID
  if(!mongoose.Types.ObjectId.isValid(id)){
    const err = new Error("Bad Id");
    err.status = 400;
    return next(err);
}
  //Check for vaild title
  if(!title){
    const err = new Error("Missing a title");
    err.status = 400;
    return next(err);
  }
  
  //Check the folder
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
    let badTag = false;
    let err;
    tags.map(tempTagId => {
      if(!mongoose.Types.ObjectId.isValid(tempTagId)){
        err = new Error("bad tag");
        err.status = 400;
        badTag = true;
      }
    })
    if(badTag){
      return next(err);
    }
  }

return Note.findByIdAndUpdate(id,bodyInfo, {new: true,upsert: true})
.then( results => {
  
  res.status(200).json(results);
})
.catch(err => {
  res.sendStatus(500);
  console.error(`ERROR: ${err.message}`);
  console.error(err);
})

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
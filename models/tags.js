const mongoose = require('mongoose');



const tagsSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true}
  });
  
  tagsSchema.set('toJSON', {
      virtuals: true,     // include built-in virtual `id`
      transform: (doc, ret) => {
        delete ret._id; // delete `_id`
        delete ret.__v;
      }
    });
  // Add `createdAt` and `updatedAt` fields
  tagsSchema.set('timestamps', true);
  
  
  module.exports = mongoose.model('Tag', tagsSchema);
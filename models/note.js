const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: String,
  createdAt: Date,
  updatedAt: Date,
  // openedCount: Number,
  folderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder' },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }]
});

noteSchema.set('toJSON', {
    virtuals: true,     // include built-in virtual `id`
    transform: (doc, ret) => {
      delete ret._id; // delete `_id`
      delete ret.__v;
    }

  });
// Add `createdAt` and `updatedAt` fields
noteSchema.set('timestamps', true);

noteSchema.methods.serialize = function() {
  return {
    id: this._id,
    name: this.name
  };
};

module.exports = mongoose.model('Note', noteSchema);

import mongoose from "mongoose";

const ClanSchema = new mongoose.Schema({
  name: mongoose.SchemaTypes.String,
  description: mongoose.SchemaTypes.String,
  members: mongoose.SchemaTypes.Array,
  minimumTrophies: mongoose.SchemaTypes.Number,
  open: mongoose.SchemaTypes.Boolean,
  level: mongoose.SchemaTypes.Number,
  ownerId: mongoose.SchemaTypes.String,
  createdAt: mongoose.SchemaTypes.Number,
  updatedAt: mongoose.SchemaTypes.Number
});

export default mongoose.model('Clan', ClanSchema);
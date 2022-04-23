import mongoose from "mongoose";

const ClanSchema = new mongoose.Schema({
  name: mongoose.SchemaTypes.String,
  description: mongoose.SchemaTypes.String,
  members: mongoose.SchemaTypes.Number,
  minimumWins: mongoose.SchemaTypes.Number,
  open: mongoose.SchemaTypes.String,
  owner: mongoose.SchemaTypes.String,
  createdAt: mongoose.SchemaTypes.Number
});

export default mongoose.model('Clan', ClanSchema);
import mongoose from "mongoose";

const CharacterSchema = new mongoose.Schema({
  userId: {
    type: mongoose.SchemaTypes.String,
    required: true,
    unique: true
  },
  name: { 
    type: mongoose.SchemaTypes.String,
    required: true
  },
  gold: mongoose.SchemaTypes.Number,
  health: mongoose.SchemaTypes.Number,
  shield: mongoose.SchemaTypes.Number,
  gems: mongoose.SchemaTypes.Number,
  level: mongoose.SchemaTypes.Number,
  exp: mongoose.SchemaTypes.Number,
  inventory: {},
  daily: {
    lastClaimed: mongoose.SchemaTypes.Number,
    claimed: mongoose.SchemaTypes.Boolean
  },
  equipment: {
    head: mongoose.SchemaTypes.String,
    chest: mongoose.SchemaTypes.String,
    legs: mongoose.SchemaTypes.String,
    feet: mongoose.SchemaTypes.String,
    weapon: mongoose.SchemaTypes.String,
  },
  skills: mongoose.SchemaTypes.Array,
  quests: mongoose.SchemaTypes.Array,
  achievements: mongoose.SchemaTypes.Array,
  createdAt: mongoose.SchemaTypes.Number,
});

export default mongoose.model("Character", CharacterSchema);
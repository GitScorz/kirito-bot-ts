import mongoose from "mongoose";

const GuildSchema = new mongoose.Schema({
  guildId: mongoose.SchemaTypes.String,
  language: mongoose.SchemaTypes.String,
  prefix: mongoose.SchemaTypes.String,
});

export default mongoose.model('Guild', GuildSchema);
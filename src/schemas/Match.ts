import mongoose from "mongoose";

const MatchSchema = new mongoose.Schema({
  startedSearching: mongoose.SchemaTypes.Number,
  name: mongoose.SchemaTypes.String,
  // inQueue: mongoose.SchemaTypes.Boolean,
  inMatch: mongoose.SchemaTypes.Boolean,
  userId: mongoose.SchemaTypes.String,
  msgId: mongoose.SchemaTypes.String,
  channelId: mongoose.SchemaTypes.String
});

export default mongoose.model("Match", MatchSchema);
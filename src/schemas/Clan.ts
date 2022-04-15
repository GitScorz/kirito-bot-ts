import mongoose from "mongoose";

const ClanSchema = new mongoose.Schema({
    name: mongoose.SchemaTypes.String,
    users: mongoose.SchemaTypes.Number,
    minimumWins: mongoose.SchemaTypes.Number,
    state: mongoose.SchemaTypes.String,
    owner: mongoose.SchemaTypes.String,
    createdAt: mongoose.SchemaTypes.Number
});

export default mongoose.model('Clan', ClanSchema);
import mongoose from 'mongoose';
const { Schema } = mongoose;

let npcSchema = Schema({
    Name: {type: String, required: true},
    Description: {type: String, required: true},
    Quote: { type: String, required: false },
    Questline: [{
        step: { type: String, required: true },
        description: { type: String, required: false }
    }],
    Lore: { type: String, required: false },
    npcCollection: { type: String, default: 'npcs' },
    
}, {strict: false});

let userSchema = Schema({
    Username: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    Birthday: Date,
    FavoriteNpcs: [{ type: Schema.Types.ObjectId, ref: 'Npc'}], //deleted 'mongoose'.Schema
    userCollection: { type: String, default: 'users' },
    
}, {strict: false});

const Npc = mongoose.model('Npc', npcSchema);
const User = mongoose.model('User', userSchema);

export default {Npc, User};

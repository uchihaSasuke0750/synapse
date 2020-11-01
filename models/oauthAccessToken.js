const mongoose = require('mongoose')

const OauthAcessSchema = new mongoose.Schema({
    user_id: {
        type: String ,
    },
    name:{
        type: String ,
    },
    scopes:{
        type: String ,
        required: true
    },
    revoked:{
        type: Number 
    },
    expires_at:{
        type: Date ,
        // default: Date.now
    },

});

module.exports = User = mongoose.model('oauthAccess' , OauthAcessSchema);
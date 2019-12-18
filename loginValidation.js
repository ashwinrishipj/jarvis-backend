var mongoDB = require('mongoose');

var Data=mongoDB.model('users',{
    emailId:{
        type: String
    },
    password:{
        type:String
    }
})

module.exports = {Data};
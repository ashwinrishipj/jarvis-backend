const mongoDb = require('mongoose');

const userCredentials = new mongoDb.Schema({
  emailId:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true
  },
  phoneNumber:{
    type: Number,
    required:true,
    unique:true
  },
  dateRegistered:{
    type:Date,
    required:true
  }
})

const userSchema = mongoDb.model("userCredential",userCredentials);

const PostSchema = new mongoDb.Schema({
  UserId :{
    type: String,
    required:true
  },
  Textdata: {
    type: String,
    required: true
  },
  PostCreatedOn :{
    type: String,
    required : true
  },
  ImageUrl:{
    type : String,
  },
  Width:{
    type: Number
  },
  Height:{
    type :Number
  },
  Likes: {
    type: Number,
    Default: 0
  }
});

const userPostSchema = mongoDb.model("userposts", PostSchema);

module.exports = {userPostSchema,userSchema };

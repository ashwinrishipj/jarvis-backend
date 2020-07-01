const mongoDb = require("mongoose");

var Schema = mongoDb.Schema,
  ObjectId = Schema.ObjectId;

const userCredentials = new mongoDb.Schema({
  emailId: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  dateRegistered: {
    type: Date,
    required: true,
  },
});

const userSchema = mongoDb.model("userCredential", userCredentials);

const userPosts = new mongoDb.Schema({
  UserId: {
    type: String,
    required: true,
  },
  Textdata: {
    type: String,
    required: true,
  },
  comments: [
    {
      text: String,
      userId: String,
      postedDate: Date,
      likes: Number,
    },
  ],
  PostCreatedOn: {
    type: String,
    required: true,
  },
  ImageUrl: {
    type: String,
  },
  Width: {
    type: Number,
  },
  Height: {
    type: Number,
  },
  Likes: {
    type: Number,
    Default: 0,
  },
});

const userPostSchema = mongoDb.model("userPosts", userPosts);

const imageUrls = mongoDb.Schema({
  userId: {
    type: String,
    required: true,
  },
  keywordSearched: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  fetchedUrls: {
    Pixabay: {
      type: Object,
    },
    unsplash: {
      type: Object,
    },
  },
});

const userImageUrls = mongoDb.model("imageUrls", imageUrls);

module.exports = { userPostSchema, userSchema, userImageUrls };

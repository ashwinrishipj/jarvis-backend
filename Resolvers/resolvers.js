const {
  userPostSchema,
  userImageUrls,
  userSchema,
} = require("../modals/modal");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const { Pixabay, Unsplash } = require("./ImageUrls");
const { isValidObjectId } = require("mongoose");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(newError("upload only jpeg/png"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

const generateToken = (userID, userEmail) => {
  const token = jwt.sign(
    { userID: userID, emailId: userEmail },
    "superPrivateKey",
    { expiresIn: "5h" }
  );
  return { token: token, tokenExpiration: 1 };
};

const retrieveAllPost = (id) => {
  return userPostSchema
    .find({ UserId: id })
    .then((result) => {
      console.log("posts are:", result);
      return result.map((data) => {
        return { ...data._doc, _id: data.id };
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

resolvers = {
  getUsersList: () => {
    return userSchema
      .find()
      .then((result) => {
        console.log("userslist:", result);
        return result.map((data) => {
          return {
            ...data._doc,
            _id: data.id,
            password: null,
            DateCreated: data.dateRegistered.toString(),
          };
        });
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  },

  getUserPosts: async (args) => {
    console.log("---- getting userposts from db:-----");

    return userPostSchema
      .find({ UserId: args.userId })
      .then((result) => {
        console.log("posts are:", result);
        return result.map((data) => {
          return { ...data._doc, _id: data.id };
        });
      })
      .catch((err) => {
        console.log(err);
      });
  },

  ValidateUser: async (args) => {
    console.log("---- Validating in db-----");
    console.log("user-emailId:", args.input.emailId);
    const user = await userSchema.findOne({ emailId: args.input.emailId });
    if (!user) {
      throw new Error("User Not found! please Register!");
    }
    console.log("resultant:", user);
    const isEqual = await bcrypt.compare(args.input.password, user.password);
    if (!isEqual) {
      throw new Error("Password is incorrect!");
    }

    console.log("---- Validating in db has completed:-----");
    return generateToken(user.id, user.emailId);
  },

  RegisterUser: (args) => {
    return userSchema
      .findOne({ emailId: args.input.emailId })
      .then((user) => {
        if (user != null) {
          throw new Error("user already exists!. please Login.");
        }
        return bcrypt.hash(args.input.password, 12);
      })
      .then((hashedPassword) => {
        let date = new Date();
        const user = new userSchema({
          emailId: args.input.emailId,
          password: hashedPassword,
          dateRegistered: date,
        });
        return user.save();
      })
      .then((result) => {
        if (result !== null) {
          console.log(`${args.input.emailId}` + "created", result.id);
          return generateToken(result.id, result.emailId);
        }
        throw new Error("insertion in Db failed:");
      })
      .catch((err) => {
        throw err;
      });
  },

  UploadUserPosts: (args) => {
    // upload.single("uploadPics");
    return userSchema
      .findById(args.input.userId)
      .then((emailResponse) => {
        if (emailResponse == null) {
          throw new Error("-----invalid user-----");
        }
        return userPostSchema.findOne({
          UserId: args.input.userId,
          PostCreatedOn: args.input.PostCreatedOn,
        });
      })
      .then((existingPost) => {
        if (existingPost !== null) {
          throw new Error("-----Reset your password:-----");
        } else {
          const userData = new userPostSchema({
            UserId: args.input.userId,
            Textdata: args.input.Textdata,
            ImageUrl: args.input.filename,
            Width: args.input.Width,
            Height: args.input.Height,
            PostCreatedOn: args.input.PostCreatedOn,
          });
          return userData.save();
        }
      })
      .then((userPostsResponse) => {
        console.log("chain working:");
        if (userPostsResponse !== null) return 1;
        return 0;
      })
      .catch((err) => {
        throw err;
      });
  },

  getImageUrls: async (args) => {
    console.log("/n ---- Fetching Image urls:-----");
    console.log("user-Id:", args.input.userId);

    try {
      var pixabayResponse = await Pixabay(args.input.keyword);
      if (pixabayResponse) {
        var unsplashResponse = await Unsplash(args.input.keyword);
        if (unsplashResponse) {
          const userData = new userImageUrls({
            userId: args.input.userId,
            keywordSearched: args.input.keyword,
            date: new Date(),
            fetchedUrls: {
              pixabay: { pixabayResponse },
              unsplash: { unsplashResponse },
            },
          });
          return userData.save();
        } else {
          throw Error("unsplash error ended");
        }
      } else {
        throw Error("pixabay error ended");
      }
    } catch (err) {
      console.log(err);
    }
  },

  deletePost: async (args) => {
    console.log("/n ---- Deleting post: -----");
    console.log("user-Id:", args.input.userId);

    const user = await userPostSchema.findByIdAndDelete(args.input.postId);

    if (!user) {
      throw new Error("User Not found! please Register!");
    }

    return retrieveAllPost(args.input.userId);
  },

  addComments: async (args) => {
    console.log("/n ------ adding comments post: ------");
    console.log("/n postId :", args.input.postId);

    const filter = { _id: args.input.postId };
    const update = { Likes: 10 };

    const post = await userPostSchema.findByIdAndUpdate(
      args.input.postId,
      update
    );

    if (!post) {
      throw new Error("data not found");
    }
    return retrieveAllPost(args.input.postId);
  },
};

module.exports = { resolvers };

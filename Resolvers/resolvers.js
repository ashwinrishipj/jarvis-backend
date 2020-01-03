const { userPostSchema } = require("../modals/modal");
const { userSchema } = require("../modals/modal");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
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
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

const generateToken = (userID, userEmail) => {
  const token = jwt.sign(
    { userID: userID, emailId: userEmail },
    "superPrivateKey",
    { expiresIn: "5h" }
  );
  return { token: token, tokenExpiration: 1 };
};

resolvers = {
  getUsersList: () => {
    return userSchema
      .find()
      .then(result => {
        console.log("userslist:", result);
        return result.map(data => {
          return {
            ...data._doc,
            _id: data.id,
            password: null,
            DateCreated: data.dateRegistered.toString()
          };
        });
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  },

  getUserPosts: async args => {
    console.log("---- getting userposts from db:-----");
    return userPostSchema
      .find({ UserId: args.userId })
      .then(result => {
        console.log("posts are:", result);
        console.log("---- userposts list has completed:-----");
        return result.map(data => {
          return { ...data._doc, _id: data.id };
        });
      })
      .catch(err => {
        console.log(err);
      });
  },

  ValidateUser: async args => {
    console.log("---- Validating in db-----");
    console.log("-------", args.input.emailId);
    const user = await userSchema.findOne({ emailId: args.input.emailId });
    if (!user) {
      throw new Error("User does not exist!");
    }
    console.log("resultant:", user);
    const isEqual = await bcrypt.compare(args.input.password, user.password);
    if (!isEqual) {
      throw new Error("Password is incorrect!");
    }

    console.log("---- Validating in db has completed:-----");
    return generateToken(user.id, user.emailId);
  },

  RegisterUser: async args => {
    return userSchema
      .findOne({ emailId: args.input.emailId })
      .then(user => {
        if (user != null) {
          throw new Error("user already exists");
        }
        return bcrypt.hash(args.input.password, 12);
      })
      .then(hashedPassword => {
        let date = new Date();
        const user = new userSchema({
          firstName: args.input.firstName,
          lastName: args.input.lastName,
          emailId: args.input.emailId,
          password: hashedPassword,
          dateRegistered: date
        });
        return user.save();
      })
      .then(result => {
        if (result !== null) {
          console.log("${args.input.emailId} created", result.id);
          return generateToken(result.id, result.emailId);
        }
        throw new Error("insertion in Db failed:");
      })
      .catch(err => {
        throw err;
      });
  },

  UploadUserPosts: async args => {
    upload.single("uploadPics");
    return userSchema
      .findById(args.input.userId)
      .then(emailResponse => {
        if (emailResponse == null) {
          throw new Error("-----invalid user-----");
        }
        return userPostSchema.findOne({
          UserId: args.input.userId,
          PostCreatedOn: args.input.PostCreatedOn
        });
      })
      .then(existingPost => {
        if (existingPost !== null) {
          throw new Error("-----Reset your password:-----");
        } else {
          const userData = new userPostSchema({
            UserId: args.input.userId,
            Textdata: args.input.Textdata,
            ImageUrl: args.input.filename,
            Width: args.input.Width,
            Height: args.input.Height,
            PostCreatedOn: args.input.PostCreatedOn
          });
          return userData.save();
        }
      })
      .then(userPostsResponse => {
        console.log("chain working:");
        if (userPostsResponse !== null) return 1;
        return 0;
      })
      .catch(err => {
        throw err;
      });
  }
};

module.exports = { resolvers };

const { buildSchema } = require("graphql");
const schema = buildSchema(`
  type getUsersList{
    _id : String!,
    userName : String!,
    emailId : String!,
    DateCreated : String!
  }
  input searchword {
    userId : String!,
    keyword : String!
  }
  type ImageUrls{
    userId : String!
    fetchedUrls : String
  }
  input comments{
    text : String!,
    postId : String!,
    userId : String!,
    postedOn : String!,
    likes : Int 
  }

  type commentsData{
    text : String,
    userId: String,
    postedDate: String,
    likes: Int
  }

  type RetrievedPost{
    _id : String,
    Textdata : String,
    ImageUrl : String,
    Width : Int,
    Comment : [commentsData]
    Height : Int,
    PostCreatedOn : String!,
    Likes :Int
  }
  type AuthenticationDetails {
      token : String!,
      tokenExpiration : Int!
  }
  input UserCredentials {
    emailId : String!,
    password : String!
  }
  input UserPosts{
    userId : String!,
    Textdata : String!,
    ImageUrl : String,
    PostCreatedOn : String!,
    Width : Int,
    Height : Int,
    Likes : Int
  }
  input deletePosts{
    userId : String!,
    postId : String!
  }
  type RootQuery {
    getUsersList : [getUsersList!],
    getUserPosts (userId : String!) : [RetrievedPost!],
    ValidateUser (input : UserCredentials) : AuthenticationDetails!
    getImageUrls (input : searchword ) : ImageUrls
  }
  type RootMutation {
    RegisterUser (input : UserCredentials) : AuthenticationDetails!
    UploadUserPosts (input : UserPosts) : Boolean!
    deletePost (input : deletePosts) : [RetrievedPost]
    addComments (input : comments ) : [RetrievedPost]
  }
  schema {
    query : RootQuery,
    mutation : RootMutation
  }
`);

module.exports = { schema };

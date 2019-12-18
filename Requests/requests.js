const { buildSchema } = require("graphql");
const schema = buildSchema(`
  type getUsersList{
    _id : String!,
    userName : String!,
    emailId: String!,
    DateCreated: String!
  }
  type RetrievedPost{
    _id : String,
    Textdata : String!,
    ImageUrl : String,
    Width : Int,
    Height : Int,
    PostCreatedOn : String!,
    Likes :Int
  }
  input UserPosts{
    userId : String!,
    Textdata : String!,
    ImageUrl : String,
    PostCreatedOn : String!,
    Width : Int,
    Height : Int,
    Likes :Int
  }
  type AuthenticationDetails {
      token : String!,
      tokenExpiration : Int!
  }
  input RegisteringUser{
    firstName : String!,
    lastName : String!
    emailId : String!,
    password : String!,
  }
  input UserCredentials {
    emailId : String!,
    password : String!
  }
  type RootQuery {
    getUsersList :[getUsersList!],
    getUserPosts (userId:String!) : [RetrievedPost!],
    ValidateUser (input : UserCredentials) : AuthenticationDetails!
  }
  type RootMutation {
    RegisterUser (input: RegisteringUser) : AuthenticationDetails!
    UploadUserPosts(input : UserPosts) : Boolean!
  }
  schema {
    query : RootQuery,
    mutation : RootMutation
  }
`);

module.exports ={schema}
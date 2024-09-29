import { gql } from "@apollo/client";

export const GET_LIST=gql`
query GetList {
  todo_list(where: {isDeleted: {_is_null: true}}) {
    data
    id
    isCompleted
    isDeleted
  }
}`;

export const GET_PRESIGNED_URL = gql`
query getSignedUrlForUpload($bucketName: String!, $key: String!) {
  getSignedUrlForUpload(bucketName: $bucketName, key: $key)
}
`

export const GET_BLOGS = gql`
query GetallBlogs {
  getallBlogs {
    blogContent
    blogTitle
    createdAt
    deletedAt
    id
    updatedAt
    user {
      id
      email
      userName
    }
    userId
  }
}
`

export const VERIFY_USER = gql`
query verifySignUpCode($code: String!, $email: String!) {
  verifySignUpCode(code: $code, email: $email)
}
`

export const RESEND_CODE = gql`
query resendCode($email: String!) {
  resendCode(email: $email)
}
`

export const LOGIN = gql`
query Login($password: String!, $username: String!) {
  login(password: $password, username: $username) {
    AccessToken
    RefreshToken
  }
}
`

export const GET_CURRENT_USER = gql`
query GetCurrentUser {
  getCurrentUser {
    cognitoId
    createdAt
    deletedAt
    email
    id
    profileUrl
    updatedAt
    userName
  }
}
`
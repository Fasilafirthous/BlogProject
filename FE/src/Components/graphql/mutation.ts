import { gql } from "@apollo/client";

export const ADD_LIST = gql`
  mutation AddList($value: String!) {
    insert_todo_list_one(object: { data: $value }) {
      data
      id
      isCompleted
      isDeleted
    }
  }
`;

export const DELETE_LIST = gql`
  mutation deleteList($id: uuid = "") {
    update_todo_list(
      _set: { isDeleted: true }
      where: { id: { _eq: $id }, isDeleted: { _is_null: true } }
    ) {
      affected_rows
      returning {
        data
        id
        isCompleted
        isDeleted
      }
    }
  }
`;

export const UPDATE_LIST = gql`
  mutation update($id: uuid = "", $_set: todo_list_set_input = {}) {
    update_todo_list(where: { id: { _eq: $id } }, _set: $_set) {
      affected_rows
      returning {
        data
        id
        isCompleted
        isDeleted
      }
    }
  }
`;


export const SIGN_UP = gql`
mutation CreateUser($createUserInput: CreateUserInput!) {
  createUser(createUserInput: $createUserInput) {
    cognitoId
    email
    id
    role
    userName
  }
}
`



export const CREATE_BLOG = gql`
mutation CreateBlog($createBlogInput: CreateBlogInput!) {
  createBlog(createBlogInput: $createBlogInput) {
    blogContent
    blogTitle
    createdAt
    deletedAt
    id
    updatedAt
    user {
      userName
      id
      email
    }
    userId
  }
}
`

export const UPDATE_PROFILE = gql`
mutation UpdateProfile($updateProfile: UpdateUserInput!) {
  updateProfile(updateProfile: $updateProfile)
}
`
import React from "react";
import ReactDOM from "react-dom/client";
import { setContext } from "@apollo/client/link/context";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {
  ApolloClient,
  from,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { onError } from '@apollo/client/link/error';
import AppProvider from "./provider/AppProvider";


const authMiddleware = setContext(async (request:any, previousContext: any) => {
  let accessToken :any = localStorage.getItem('accessToken') || '';
  if(accessToken){
    const jwtPayload = JSON.parse(window.atob(accessToken.split('.')[1]));
    const isExpired = Date.now() >= jwtPayload.exp * 1000;

  }
  return {
    headers:{
      Authorization : accessToken ? `Bearer ${accessToken}` : '',
    
    }
  };
});
const unauthenticatedErrorLink = onError(({ graphQLErrors, operation, forward }: any) => {
  console.log(graphQLErrors,10)
  if (graphQLErrors?.length ) {

    if (graphQLErrors[0]?.message === 'Unauthorized') {
      console.log("35")
      localStorage.clear();
      window.open("/", "_self");
    }

    // token expired. Refetch token using refresh token
    if (graphQLErrors[0]?.extensions?.response?.message === 'ACCESS_TOKEN_EXPIRED') {
      console.warn('Refreshing token and trying again.');
      // Automatically refresh user session if jwt token expired or else same session will return.
      // Reference link => https://docs.amplify.aws/lib/auth/manageusers/q/platform/js/#retrieve-current-session
    }
  }
});
const client = new ApolloClient({
  link: from([
    unauthenticatedErrorLink,
    authMiddleware,
    new HttpLink({ uri: "http://localhost:3000/graphql" }),
  ]),
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
// Supported in React 18+
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <AppProvider>
         <App />
      </AppProvider>
    </ApolloProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

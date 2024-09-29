import { createContext, PropsWithChildren, useState } from "react";
import { globalStateType } from "../globalState";
export const initialState: globalStateType = {
        user:{
            cognitoId: "",
            createdAt:"",
            deletedAt:"",
            email:"",
            id:"",
            profileUrl:"",
            updatedAt:"",
            userName:"",
        }
  };
  
export const globalContext = createContext({
    globalState: initialState,
    handleGlobalState: (obj: any) => {
        console.log(obj,"objects")
      return obj;
    },
  });


  const AppProvider = ({ children }: PropsWithChildren<{}>) => {
    const [globalState, setGlobalState] = useState(initialState);
    const handleGlobalState = (obj: any) => {
        console.log(obj,"obj")

      setGlobalState(obj);
      console.log("globalstateeeeeeee",globalState)
    };
    return (
      <globalContext.Provider value={{ globalState, handleGlobalState }}>
        {children}
      </globalContext.Provider>
    );
  };
  
  export default AppProvider;
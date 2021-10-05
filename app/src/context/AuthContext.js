import React, { useState, useEffect, createContext } from "react";
import { userPool } from "../authentication/Auth";

export const AuthContext = createContext();

export const AuthProvider = (props) => {
  const [cognitoUser, setCognitoUser] = useState(null);

  const getCognitoUser = async () => {
    const user = await userPool.getCurrentUser();
    console.log("user", cognitoUser);
    setCognitoUser(user);
  };

  useEffect(() => {
    getCognitoUser();
  }, []);

  return (
    <AuthContext.Provider value={[cognitoUser, setCognitoUser]}>
      {props.children}
    </AuthContext.Provider>
  );
};

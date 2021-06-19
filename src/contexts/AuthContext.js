import React, { useContext, useState, useEffect, useReducer } from "react";
import firebase from "../firebase";
import {AuthReducer, loadUser} from "../reducers/AuthReducer";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, userDispatch] = useReducer(AuthReducer, null);
  const [loading, setLoading] = useState(true);

  const isNewUser = () => {
    if (!firebase.auth().currentUser) {
        return false;
    }

    return firebase.auth().currentUser.metadata.creationTime === firebase.auth().currentUser.metadata.lastSignInTime;
  }

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async (authUser) => {
      let userData = null;

      if (authUser) {
          const response = await firebase.firestore().collection('users').doc(authUser.uid).get();

          userData = {...response.data(), uid: authUser.uid};
      }
      if (!isNewUser()) {
          userDispatch(loadUser(userData));
      }
      setLoading(false)
  });

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    userDispatch
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

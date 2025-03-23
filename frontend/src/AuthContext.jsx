import React, { useState, createContext, useEffect } from "react";
import { AUTH_TIMESTAMP, AUTH_TOKEN, AUTH_USER } from "@/utils/constants";
import * as microsoftTeams from "@microsoft/teams-js";

export const AuthContext = createContext(null);
export function ContextWrapper(props) {
  const localUser = localStorage.getItem(AUTH_USER);
  const localAuthToken = localStorage.getItem(AUTH_TOKEN);
  const [store, setStore] = useState({
    user: localUser ? JSON.parse(localUser) : null,
    authToken: localAuthToken ? localAuthToken : null,
  });

  const [actions] = useState({
    updateUser: (user, authToken = "") => {
      localStorage.setItem(AUTH_USER, JSON.stringify(user));
      localStorage.setItem(AUTH_TOKEN, authToken);
      setStore({ user, authToken });
    },
    unsetUser: () => {
      localStorage.removeItem(AUTH_USER);
      localStorage.removeItem(AUTH_TOKEN);
      localStorage.removeItem(AUTH_TIMESTAMP);
      setStore({ user: null, authToken: null });
    },
  });

  useEffect(() => {
    microsoftTeams.initialize();

    microsoftTeams.getContext((context) => {
      if (context && context.userObjectId) {
        // Fetch user details from your server using the userObjectId
        fetch(`/api/auth/ms-teams`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: context.userObjectId }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.user && data.token) {
              actions.updateUser(data.user, data.token);
            }
          })
          .catch((error) => {
            console.error("Error fetching MS Teams user details:", error);
          });
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ store, actions }}>
      {props.children}
    </AuthContext.Provider>
  );
}

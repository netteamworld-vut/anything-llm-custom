import React, { useEffect, useContext } from "react";
import * as microsoftTeams from "@microsoft/teams-js";
import { AuthContext } from "@/AuthContext";
import { useNavigate } from "react-router-dom";
import paths from "@/utils/paths";

export default function MsTeamsLogin() {
  const { actions } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    microsoftTeams.initialize();

    microsoftTeams.authentication.authenticate({
      url: window.location.origin + "/auth-start",
      width: 600,
      height: 535,
      successCallback: (result) => {
        actions.updateUser(result.user, result.token);
        navigate(paths.home());
      },
      failureCallback: (reason) => {
        console.error("Login failed: ", reason);
      },
    });
  }, []);

  return null;
}

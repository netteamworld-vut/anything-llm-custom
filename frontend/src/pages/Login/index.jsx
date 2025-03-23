import React from "react";
import PasswordModal, { usePasswordModal } from "@/components/Modals/Password";
import { FullScreenLoader } from "@/components/Preloader";
import { Navigate } from "react-router-dom";
import paths from "@/utils/paths";
import useQuery from "@/hooks/useQuery";
import MsTeamsLogin from "./SSO/msTeams";

export default function Login() {
  const query = useQuery();
  const { loading, requiresAuth, mode } = usePasswordModal(!!query.get("nt"));
  if (loading) return <FullScreenLoader />;
  if (requiresAuth === false) return <Navigate to={paths.home()} />;

  return (
    <div>
      <PasswordModal mode={mode} />
      <MsTeamsLogin />
    </div>
  );
}

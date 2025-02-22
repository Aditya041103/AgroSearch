import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(
    () => {
      axios
        .get("https://agrosearch-backend.onrender.com/api/checkAuth", {
          withCredentials: true
        })
        .then(response => {
          setIsAuthenticated(true);
        })
        .catch(error => {
          console.error("Auth check failed:", error);
          navigate("/login");
        });
    },
    [navigate]
  );

  return isAuthenticated;
}

export { useAuth };

import React, { useEffect } from "react";
import HeartBrokenIcon from "@mui/icons-material/HeartBroken";
import { Button } from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import LoginIcon from "@mui/icons-material/Login";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../config/routes";

const NotFound: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const id = localStorage.getItem("id");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (!!id && role === "ADMIN") {
      navigate(`/adminDashboard/${id}`);
    } else if (!!id && role === "USER") {
      navigate(`/home/${id}`);
    } else {
      navigate(ROUTES.LOGIN);
    }
  }, [id, role, navigate]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-5">
      <HeartBrokenIcon sx={{ width: "120px", height: "120px", color: "red" }} />
      <span className="text-red-600 text-3xl font-bold">404</span>
      <span className="text-red-600 text-xl font-bold">Page not found</span>
      <div className="flex flex-row gap-7 items-center">
        <Button
          onClick={() => navigate(-1)}
          variant="contained"
          color="error"
          endIcon={<KeyboardBackspaceIcon />}
        >
          {t("back")}
        </Button>
        <Button
          onClick={() => navigate(ROUTES.LOGIN)}
          variant="contained"
          color="success"
          endIcon={<LoginIcon />}
        >
          {t("login")}
        </Button>
      </div>
    </div>
  );
};
export default NotFound;

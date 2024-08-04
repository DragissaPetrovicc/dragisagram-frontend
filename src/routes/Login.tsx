import React, { useState, useEffect } from "react";
import {
  CustomBox,
  CustomTextFieldBlack,
  CustomOutlinedInput,
  CustomWhiteButton,
} from "../Custom elements/customelements";
import { useTranslation } from "react-i18next";
import {
  FormControl,
  InputLabel,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material";
import { CustomUserCredential } from "../config/types";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "@mui/icons-material/Google";
import LoginIcon from "@mui/icons-material/Login";
import { axiosI } from "../config/axios";
import { useNavigate } from "react-router-dom";
import Loader from "../CustomLoader";
import {
  signInWithPopup,
  FacebookAuthProvider,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../config/firebaseConfig";

const Login: React.FC = () => {
  const { t } = useTranslation();
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const login = async () => {
    try {
      setLoading(true);

      const { data } = await axiosI.post("/login/user", { username, password });

      localStorage.setItem("token", data.token);
      localStorage.setItem("image", data.data.image);
      localStorage.setItem("role", data.data.role);
      localStorage.setItem("email", data.data.email);
      localStorage.setItem("id", data.data._id);

      if (data.data.role === "USER") {
        navigate(`/home/${data.data._id}`);
      } else {
        navigate(`/adminDashboard/${data.data._id}`);
      }
    } catch (e) {
      setError((e as any)?.response?.data || "An error occured");
    } finally {
      setLoading(false);
    }
  };

  const fbReg = async () => {
    try {
      setLoading(true);

      const provider = new FacebookAuthProvider();
      const result = (await signInWithPopup(
        auth,
        provider
      )) as CustomUserCredential;

      const tokenResponse = result._tokenResponse;

      const firstName = tokenResponse?.firstName;
      const lastName = tokenResponse?.lastName;
      const user = result.user;
      const username = user.displayName;
      const email = user.email;
      const password = user.uid;
      const image = user.photoURL;
      const phoneNumber = user.phoneNumber ? user.phoneNumber : "+38700111222";
      const location = { city: "N/A", state: "N/A" };

      const { data } = await axiosI.post("/register/user", {
        firstName,
        lastName,
        username,
        email,
        password,
        image,
        phoneNumber,
        location,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("image", data.data.image);
      localStorage.setItem("role", data.data.role);
      localStorage.setItem("email", data.data.email);
      localStorage.setItem("id", data.data._id);

      navigate(`/home/${data.data._id}`);
    } catch (e) {
      setError((e as any)?.response?.data || "An error occured");
    } finally {
      setLoading(false);
    }
  };

  const gReg = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const result = (await signInWithPopup(
        auth,
        provider
      )) as CustomUserCredential;

      const tokenResponse = result._tokenResponse;

      const firstName = tokenResponse?.firstName;
      const lastName = tokenResponse?.lastName;
      const user = result.user;
      const username = user.displayName;
      const email = user.email;
      const password = user.uid;
      const image = user.photoURL;
      const phoneNumber = user.phoneNumber ? user.phoneNumber : "+38700111222";
      const location = { city: "N/A", state: "N/A" };

      const { data } = await axiosI.post("/register/user", {
        firstName,
        lastName,
        username,
        email,
        password,
        image,
        phoneNumber,
        location,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("image", data.data.image);
      localStorage.setItem("role", data.data.role);
      localStorage.setItem("email", data.data.email);
      localStorage.setItem("id", data.data._id);

      navigate(`/home/${data.data._id}`);
    } catch (e) {
      setError((e as any)?.response?.data || "An error occured");
    } finally {
      setLoading(false);
    }
  };

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const id = localStorage.getItem("id");

  useEffect(() => {
    if (!!token) {
      navigate(-1);
    }
  }, [token, navigate]);

  useEffect(() => {
    if (!!role && role === "ADMIN" && !!id) {
      navigate(`/adminDashboard/${id}`);
    } else if (!!id && !!role && role === "USER") {
      navigate(`/home/${id}`);
    }
  }, [id, role, navigate]);

  return (
    <CustomBox>
      <div className="flex flex-col items-center w-full h-full justify-around">
        <span className="text-center text-xl lg:text-2xl font-bold">
          {t("login")}
        </span>

        {!!error && (
          <Alert variant="filled" color="error">
            {error}
          </Alert>
        )}

        <div className="flex flex-col gap-2 w-full h-max">
          <CustomTextFieldBlack
            label={t("username")}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <FormControl sx={{ m: 0, width: "100%" }} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">
              {t("password")}
            </InputLabel>
            <CustomOutlinedInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="outlined-adornment-password"
              type={showPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label={t("password")}
            />
          </FormControl>
          <div className="self-center">
            <CustomWhiteButton
              onClick={login}
              variant="contained"
              endIcon={<LoginIcon />}
            >
              {!!loading ? <Loader /> : t("login")}
            </CustomWhiteButton>
          </div>
        </div>

        <span className="text-slate-500 font-extrabold text-lg lg:text-2xl text-center">
          OR
        </span>

        <div className="flex flex-row items-center justify-center gap-4 w-min">
          <IconButton onClick={fbReg} size="large">
            <FacebookIcon className="!text-blue-500 !w-[35px] !h-[35px]" />
          </IconButton>
          <IconButton onClick={gReg} size="large">
            <GoogleIcon className="!text-orange-500 !w-[35px] !h-[35px]" />
          </IconButton>
        </div>

        <span className="font-semibold text-lg">
          {t("noAccount")}{" "}
          <a className="hover:underline text-blue-500" href="/register">
            {t("registerNow")}
          </a>
        </span>
      </div>
    </CustomBox>
  );
};

export default Login;

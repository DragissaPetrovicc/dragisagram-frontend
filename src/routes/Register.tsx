import React, { useState, useEffect } from "react";
import {
  CustomBox,
  CustomTextFieldBlack,
  CustomOutlinedInput,
  VisuallyHiddenInput,
  CustomWhiteButton,
} from "../Custom elements/customelements";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputLabel,
  InputAdornment,
  IconButton,
  Autocomplete,
  TextField,
  Box,
  Alert,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useTranslation } from "react-i18next";
import "../input.css";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { countries } from "../countries&cities";
import { useNavigate } from "react-router-dom";
import { axiosI } from "../config/axios";
import Loader from "../CustomLoader";
import CreateVerificationModal from "../modals/CreateVerificationModal";

const Register: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string>("USER");
  const [error, setError] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [image, setImage] = useState<string | null>(null);
  const [id, setId] = useState<string>("");

  const [open, setOpen] = useState<boolean>(false);

  const handlePhoneChange = (value: string | undefined) => {
    setPhoneNumber(value || "");
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const imgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCountryChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: { label: string } | null
  ) => {
    setSelectedCountry(value ? value.label : "");
    setSelectedCity("");
  };

  const handleCityChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: string | null
  ) => {
    setSelectedCity(value || "");
  };

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const myId = localStorage.getItem("id");

  const register = async () => {
    try {
      setLoading(true);

      const { data } = await axiosI.post("/register/user", {
        firstName,
        lastName,
        username,
        password,
        email,
        role: userRole,
        image,
        phoneNumber,
        location: { state: selectedCountry, city: selectedCity },
      });

      if (role === "ADMIN") {
        return navigate(`/adminDashboard/${myId}`);
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("image", data.data.image);
      localStorage.setItem("role", data.data.role);
      localStorage.setItem("email", data.data.email);
      localStorage.setItem("id", data.data._id);

      if (data.data.role === "USER") {
        setId(data.data._id);
        setOpen(true);
      } else {
        navigate(`/adminDashboard/${data.data._id}`);
      }
    } catch (e) {
      setError((e as any)?.response?.data || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!!token && role !== "ADMIN") {
      navigate(-1);
    }
  }, [token, role, navigate]);

  return (
    <>
      <CustomBox>
        <span className="text-center text-xl lg:text-2xl font-bold">
          {t("register")}
        </span>
        {!!error && (
          <Alert variant="filled" severity="error">
            {error}
          </Alert>
        )}
        <div className="h-full gap-2 flex flex-col lg:flex-row mt-10 w-full">
          <div className="flex flex-col gap-2 w-full h-max">
            <CustomTextFieldBlack
              label={t("firstName")}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <CustomTextFieldBlack
              label={t("lastName")}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <CustomTextFieldBlack
              label={t("username")}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <CustomTextFieldBlack
              label={t("email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col w-full h-max gap-5">
            <FormControl variant="standard" fullWidth>
              <PhoneInput
                className="custom-phone-input"
                value={phoneNumber}
                onChange={handlePhoneChange}
              />
            </FormControl>

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
            <Autocomplete
              sx={{ width: "100%" }}
              options={countries}
              autoHighlight
              getOptionLabel={(option) => option.label}
              onChange={handleCountryChange}
              value={countries.find((c) => c.label === selectedCountry) || null}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <img
                    loading="lazy"
                    width="20"
                    srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                    src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                    alt=""
                  />
                  {option.label} ({option.code})
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label={t("state")}
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: "new-password",
                  }}
                />
              )}
            />

            <Autocomplete
              sx={{ width: "100%" }}
              options={
                selectedCountry
                  ? countries.find((c) => c.label === selectedCountry)
                      ?.cities || []
                  : []
              }
              autoHighlight
              getOptionLabel={(option) => option}
              onChange={handleCityChange}
              value={selectedCity}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label={t("city")}
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: "new-password",
                  }}
                />
              )}
            />
          </div>
        </div>{" "}
        {!!role && role === "ADMIN" ? (
          <FormControl className="!self-start">
            <FormLabel className="!text-black !text-lg !font-medium">
              {t("role")}
            </FormLabel>
            <RadioGroup
              className="!text-black"
              row
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
            >
              <FormControlLabel
                className="!text-black"
                value="USER"
                control={<Radio />}
                label="USER"
              />
              <FormControlLabel
                className="!text-black"
                value="ADMIN"
                control={<Radio />}
                label="ADMIN"
              />
            </RadioGroup>
          </FormControl>
        ) : null}
        {!role && (
          <div className="flex flex-row w-full h-min items-center justify-between">
            <CustomWhiteButton
              variant="contained"
              endIcon={<CloudUploadIcon />}
              component="label"
            >
              {t("choseImage")}
              <VisuallyHiddenInput type="file" onChange={imgUpload} />
            </CustomWhiteButton>
            {!!image && (
              <img
                src={image}
                alt=""
                className="w-20 h-20 rounded-full object-cover border-2 border-black"
              />
            )}
          </div>
        )}
        <CustomWhiteButton onClick={register} variant="contained">
          {!!loading ? <Loader /> : t("register")}
        </CustomWhiteButton>
        <span className="font-semibold text-lg">
          {t("haveAccount")}{" "}
          <a className="hover:underline text-blue-500" href="/login">
            {t("login")}
          </a>
        </span>
      </CustomBox>
      <CreateVerificationModal
        open={open}
        onClose={() => setOpen(false)}
        email={email}
        phoneNumber={phoneNumber}
        id={id}
      />
    </>
  );
};

export default Register;

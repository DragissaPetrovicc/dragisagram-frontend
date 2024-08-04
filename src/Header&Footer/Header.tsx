import React, { useState, useCallback } from "react";
import {
  Button,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import {
  CustomFormControl,
  CustomButtonGroup,
} from "../Custom elements/customelements";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../config/routes";

const Header: React.FC = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [language, setLanguage] = useState<string>("");
  const { t, i18n } = useTranslation();

  const changeLanguage = useCallback(
    async (value: string) => {
      await i18n.changeLanguage(value);
    },
    [i18n]
  );

  const handleChange = async (event: SelectChangeEvent) => {
    const selectedLanguage = event.target.value as string;
    setLanguage(selectedLanguage);
    await changeLanguage(selectedLanguage);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("image");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    localStorage.removeItem("id");

    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="sticky p-2 md:p-5 lg:p-8 xl:p-10 w-full h-[125px] flex flex-row justify-between items-center bg-[#7D00A8] border-b-2 rounded-b-xl border-customYellow text-white">
      <span className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-semibold lg:font-bold ">
        Dragisagram
      </span>

      <div className="w-min flex flex-row-reverse items-center justify-around gap-3">
        <CustomFormControl sx={{ width: "max-content", minWidth: "100px" }}>
          <InputLabel className="!text-customYellow">
            {t("language")}
          </InputLabel>
          <Select
            className="!text-customYellow"
            value={language}
            onChange={handleChange}
            label={t("language")}
          >
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="de">Deutsch</MenuItem>
            <MenuItem value="sr">Serbian</MenuItem>
          </Select>
        </CustomFormControl>

        {!token ? (
          <CustomButtonGroup
            className="!text-customYellow !border-customYellow"
            variant="outlined"
          >
            <Button
              onClick={() => navigate(ROUTES.LOGIN)}
              className=" hover:scale-105 !text-customYellow !whitespace-nowrap"
            >
              {t("login")}
            </Button>
            <Button
              onClick={() => navigate(ROUTES.REGISTER)}
              className=" hover:scale-105 !text-customYellow"
            >
              {t("register")}
            </Button>
          </CustomButtonGroup>
        ) : (
          <Button
            onClick={logout}
            className="!bg-customYellow !text-black !font-semibold hover:scale-105 !whitespace-nowrap"
          >
            {t("logout")}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Header;

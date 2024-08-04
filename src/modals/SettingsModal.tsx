import React, { useEffect, useState } from "react";
import { ModalProps } from "../config/types";
import {
  Alert,
  Box,
  Button,
  LinearProgress,
  Modal,
  FormControl,
  InputLabel,
  InputAdornment,
  IconButton,
  ToggleButton,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  CustomTextFieldBlack,
  CustomOutlinedInput,
  stil,
} from "../Custom elements/customelements";
import Close from "@mui/icons-material/Close";
import { useParams } from "react-router-dom";
import { axiosT } from "../config/axios";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CheckIcon from "@mui/icons-material/Check";

const SettingsModal: React.FC<ModalProps> = ({ open, onClose }) => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [privateAcc, setPrivateAcc] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [firstName, setFirstname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [res, setRes] = useState<string>("");
  const [refresh, setRefresh] = useState<boolean>(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const { data } = await axiosT.get(`/user/${id}`);
        setUser(data);
      } catch (e) {
        setError((e as any)?.response?.data || "An error occured");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, refresh]);

  const changeUser = async () => {
    try {
      setLoading(true);

      const { data } = await axiosT.patch(`/user/edit/${id}`, {
        username,
        firstName,
        email,
        private: privateAcc,
        password,
      });

      setRes(data);

      setTimeout(() => {
        setRefresh(!refresh);
      }, 1300);
    } catch (e) {
      setError((e as any)?.response?.data || "An error occured");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async () => {
    try {
      setLoading(true);

      const { data } = await axiosT.delete(`/user/delete/${id}`);

      setRes(data);

      setTimeout(() => {
        onClose();
      }, 1300);
    } catch (e) {
      setError((e as any)?.response?.data || "An error occured");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={stil}>
        {!!loading && (
          <LinearProgress color="secondary" sx={{ height: "7px" }} />
        )}
        <span className="lg:text-2xl font-bold text-center">
          {t("settings")}
        </span>

        {!!res && (
          <Alert variant="filled" severity="success">
            {res}
          </Alert>
        )}

        {!!error && (
          <Alert variant="filled" color="error">
            {error}
          </Alert>
        )}

        <div className="w-full h-fit flex flex-col gap-2">
          <CustomTextFieldBlack
            value={username}
            defaultValue={user?.username}
            placeholder={user?.username}
            label={t("username")}
            onChange={(e) => setUsername(e.target.value)}
          />
          <CustomTextFieldBlack
            value={firstName}
            defaultValue={user?.firstName}
            placeholder={user?.firstName}
            label={t("firstName")}
            onChange={(e) => setFirstname(e.target.value)}
          />
          <CustomTextFieldBlack
            value={email}
            defaultValue={user?.email}
            placeholder={user?.email}
            label={t("email")}
            onChange={(e) => setEmail(e.target.value)}
          />{" "}
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
          <div className="w-full flex flex-row justify-between items-center">
            <span className="font-semibold">
              {!!privateAcc ? t("makeAccPublic") : t("makeAccPrivate")}
            </span>
            <ToggleButton
              value="check"
              className={`!border-2 !border-black !font-semibold ${
                !!privateAcc ? "!bg-green-500" : "!bg-red-500"
              } `}
              selected={privateAcc}
              onChange={() => {
                setPrivateAcc(!privateAcc);
              }}
            >
              <CheckIcon className="!font-semibold" />
            </ToggleButton>
          </div>
          <Button onClick={changeUser} variant="contained" color="success">
            {t("submit")}
          </Button>
          <Button onClick={deleteUser} variant="contained" color="error">{`${t(
            "delete"
          )} ${t("user")}}`}</Button>
        </div>

        <Button
          onClick={onClose}
          variant="contained"
          color="error"
          endIcon={<Close />}
        >
          {t("close")}
        </Button>
      </Box>
    </Modal>
  );
};

export default SettingsModal;

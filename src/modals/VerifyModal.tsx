import React, { useState } from "react";
import { CreateVerificationModalProps } from "../config/types";
import { Alert, Box, Button, Modal } from "@mui/material";
import { useTranslation } from "react-i18next";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import { CustomTextFieldBlack } from "../Custom elements/customelements";
import Loader from "../CustomLoader";
import { useNavigate } from "react-router-dom";
import { axiosI } from "../config/axios";
import { stil } from "../Custom elements/customelements";

const VerifyModal: React.FC<CreateVerificationModalProps> = ({
  open,
  onClose,
  email,
  phoneNumber,
  id,
}) => {
  const { t } = useTranslation();
  const [code, setCode] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [res, setRes] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const verificationData = email ? { email, code } : { phoneNumber, code };

  const verify = async () => {
    try {
      setLoading(true);

      const { data } = await axiosI.post("/register/verify", verificationData);
      setRes(data);

      setTimeout(() => {
        onClose();
        navigate(`/home/${id}`);
      }, 1200);
    } catch (e) {
      setError((e as any)?.response?.data || "An error occured");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={stil}>
        <span className="text-2xl font-bold">
          {t("verify")} {t("account")}
        </span>

        {!!loading && <Loader />}

        {!!error && (
          <Alert severity="error" variant="filled">
            {error}
          </Alert>
        )}
        {!!res && (
          <Alert variant="filled" severity="success">
            {res}
          </Alert>
        )}

        <CustomTextFieldBlack
          fullWidth
          value={code}
          onChange={(e) => setCode(e.target.value)}
          label={t("code")}
        />

        <Button
          variant="contained"
          className="!self-center"
          color="success"
          onClick={verify}
          endIcon={<VerifiedUserIcon />}
        >
          {t("verify")}
        </Button>
      </Box>
    </Modal>
  );
};

export default VerifyModal;

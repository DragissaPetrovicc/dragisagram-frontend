import React, { useState } from "react";
import { CreateVerificationModalProps } from "../config/types";
import { Alert, Box, Button, Modal } from "@mui/material";
import { useTranslation } from "react-i18next";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";
import { CustomBlackButton } from "../Custom elements/customelements";
import EmailIcon from "@mui/icons-material/Email";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import { axiosI } from "../config/axios";
import Loader from "../CustomLoader";
import VerifyModal from "./VerifyModal";

const CreateVerificationModal: React.FC<CreateVerificationModalProps> = ({
  open,
  onClose,
  email,
  phoneNumber,
  id,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [res, setRes] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "#FFDF00",
    borderRadius: "10px",
    color: "black",
    display: "flex",
    flexDirection: "column",
    justifyItems: "center",
    alignItems: "center",
    border: "3px solid #000",
    boxShadow: 24,
    overflow: "auto",
    p: 2,
    gap: 5,
  };

  const handleVerification = async (verificationData: any) => {
    try {
      setLoading(true);
      const { data } = await axiosI.post(
        "/register/createVerification",
        verificationData
      );
      setRes(data);
      setTimeout(() => {
        onClose();
        setOpenModal(true);
      }, 1200);
    } catch (e) {
      setError((e as any)?.response?.data || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box sx={style}>
          <span className="text-2xl font-bold">
            {t("verify")} {t("account")}
          </span>

          {error && (
            <Alert variant="filled" severity="error">
              {error}
            </Alert>
          )}

          {res ? (
            <Alert variant="filled" severity="success">
              {res}
            </Alert>
          ) : (
            <div className="flex flex-col gap-2 w-full items-center">
              <CustomBlackButton
                onClick={() => handleVerification({ email })}
                variant="contained"
                endIcon={<EmailIcon />}
              >
                {loading ? <Loader /> : t("verify")} {t("email")}
              </CustomBlackButton>
              <CustomBlackButton
                onClick={() => handleVerification({ phoneNumber })}
                variant="contained"
                endIcon={<PhoneAndroidIcon />}
              >
                {t("verify")} {t("phoneNumber")}
              </CustomBlackButton>
            </div>
          )}

          <Button
            onClick={() => navigate(`/home/${id}`)}
            variant="contained"
            color="error"
            className="!self-center"
            startIcon={<HomeIcon />}
          >
            {t("continue")} {t("home")}
          </Button>
        </Box>
      </Modal>
      <VerifyModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        email={email}
        phoneNumber={phoneNumber}
        id={id}
      />
    </>
  );
};

export default CreateVerificationModal;

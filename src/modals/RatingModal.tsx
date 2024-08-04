import React, { useState } from "react";
import { ModalProps } from "../config/types";
import { Box, Modal, Button, Alert, Rating } from "@mui/material";
import { stil } from "../Custom elements/customelements";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import { useParams } from "react-router-dom";
import { axiosT } from "../config/axios";
import Loader from "../CustomLoader";
import { useTranslation } from "react-i18next";

const RatingModal: React.FC<ModalProps> = ({ open, onClose }) => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState<boolean>(false);
  const [stars, setStars] = useState<number | null>(1);
  const [res, setRes] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { id } = useParams<{ id: string }>();

  const rateApp = async () => {
    try {
      setLoading(true);

      const { data } = await axiosT.post("/rating/rateApp", {
        ratedBy: id,
        stars,
      });
      setRes(data);

      setTimeout(() => {
        onClose();
      }, 1300);
    } catch (e) {
      setError((e as any)?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={stil}>
        <span className="text-2xl font-bold text-center">{t("rateApp")}</span>

        {!!error && (
          <Alert variant="filled" severity="error">
            {error}
          </Alert>
        )}

        {!!res && (
          <Alert variant="filled" severity="success">
            {res}
          </Alert>
        )}

        <Rating
          className="!text-[fuchsia]"
          size="large"
          value={stars}
          onChange={(e, newValue) => {
            setStars(newValue);
          }}
        />

        <div className="w-full flex flex-row justify-between items-center">
          <Button
            onClick={onClose}
            variant="contained"
            startIcon={<CloseIcon />}
            color="error"
          >
            {t("close")}
          </Button>
          <Button
            onClick={rateApp}
            variant="contained"
            endIcon={<SendIcon />}
            color="secondary"
          >
            {!!loading ? <Loader /> : t("report")}
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default RatingModal;

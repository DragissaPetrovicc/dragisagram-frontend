import React, { useState } from "react";
import { ModalProps } from "../config/types";
import { Alert, Box, Button, LinearProgress, Modal } from "@mui/material";
import { CustomTextFieldBlack, stil } from "../Custom elements/customelements";
import { useTranslation } from "react-i18next";
import Close from "@mui/icons-material/Close";
import { Send } from "@mui/icons-material";
import { axiosT } from "../config/axios";
import { useParams } from "react-router-dom";

const SendNotificationModel: React.FC<ModalProps> = ({ open, onClose }) => {
  const { t } = useTranslation();

  const [msg, setMsg] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [res, setRes] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const { id } = useParams<{ id: string }>();

  const sendNotification = async () => {
    try {
      setLoading(true);

      const { data } = await axiosT.post(`/admin/sendNotification/${id}`, {
        msg,
      });

      setRes(data);

      setTimeout(() => {
        onClose();
      }, 1750);
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
          <LinearProgress sx={{ height: "6px" }} color="secondary" />
        )}
        <span className="text-center lg:text-2xl font-bold">
          {t("sendNotification")}
        </span>

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

        <CustomTextFieldBlack
          label={t("sendNotification")}
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />

        <div className="flex flex-row w-full justify-between items-center">
          <Button
            onClick={onClose}
            variant="contained"
            color="error"
            endIcon={<Close />}
          >
            {t("close")}
          </Button>
          <Button
            onClick={sendNotification}
            variant="contained"
            color="secondary"
            endIcon={<Send />}
          >
            {t("sendNotification")}
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default SendNotificationModel;

import React, { useState } from "react";
import { ModalProps } from "../config/types";
import { Alert, Box, Button, Modal } from "@mui/material";
import { useTranslation } from "react-i18next";
import { stil } from "../Custom elements/customelements";
import { CustomTextFieldBlack } from "../Custom elements/customelements";
import CloseIcon from "@mui/icons-material/Close";
import ReportIcon from "@mui/icons-material/Report";
import Loader from "../CustomLoader";
import { axiosT } from "../config/axios";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/config";

const RepPostModal: React.FC<ModalProps> = ({ open, onClose }) => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  const postId = useSelector((state: RootState) => state.repPost.items);

  const [res, setRes] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [additionalMessage, setAdditionalMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const reportPost = async () => {
    try {
      setLoading(true);

      const { data } = await axiosT.post("/report/post", {
        reportedBy: id,
        reportedPost: postId,
        reason,
        additionalMessage,
      });
      setRes(data);

      setTimeout(() => {
        onClose();
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
        <span className="text-2xl font-bold text-center">
          {t("reportPost")}
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
          fullWidth
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          label={t("reason")}
        />
        <CustomTextFieldBlack
          fullWidth
          value={additionalMessage}
          onChange={(e) => setAdditionalMessage(e.target.value)}
          label={t("additionalMessage")}
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
            onClick={reportPost}
            variant="contained"
            endIcon={<ReportIcon />}
            color="secondary"
          >
            {!!loading ? <Loader /> : t("report")}
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default RepPostModal;

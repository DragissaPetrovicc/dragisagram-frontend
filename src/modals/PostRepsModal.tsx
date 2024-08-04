import React, { useEffect, useState } from "react";
import { ModalProps } from "../config/types";
import { Box, Button, LinearProgress, Modal } from "@mui/material";
import { stil } from "../Custom elements/customelements";
import { useTranslation } from "react-i18next";
import Close from "@mui/icons-material/Close";
import { useSelector } from "react-redux";
import { RootState } from "../redux/config";
import { axiosT } from "../config/axios";

const PostRepsModal: React.FC<ModalProps> = ({ open, onClose }) => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState<boolean>(false);
  const [rep, setRep] = useState<any>(null);

  const postRepId = useSelector((state: RootState) => state.repPost.items);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const { data } = await axiosT.get(`/admin/getPostRep/${postRepId}`);
        setRep(data);
      } catch (e) {
        console.error((e as any)?.response?.data || "An error occured");
      } finally {
        setLoading(false);
      }
    })();
  }, [postRepId]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={stil}>
        {!!loading && (
          <LinearProgress color="secondary" sx={{ height: "6px" }} />
        )}

        <span className="text-center lg:text-2xl font-bold">{`${t("post")} ${t(
          "reports"
        )}`}</span>

        <span className="font-semibold lg:text-lg">
          {t("reportedBy")}: <b>{rep?.reportedBy?.username}</b>
        </span>

        <span className="font-semibold text-center lg:text-lg">
          {t("reportedPost")}: <b>{rep?.reportedPost?._id}</b>
        </span>

        <span className="font-semibold lg:text-lg">
          {t("reason")}: <b>{rep?.reason}</b>
        </span>

        <span className="font-semibold lg:text-lg">
          {t("additionalMessage")}: <b>{rep?.additionalMessage}</b>
        </span>

        <Button
          onClick={onClose}
          className="!self-center"
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

export default PostRepsModal;

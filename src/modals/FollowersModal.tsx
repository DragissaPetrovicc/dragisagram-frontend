import { Alert, Box, Button, LinearProgress, Modal } from "@mui/material";
import React, { useEffect, useState } from "react";
import { stil } from "../Custom elements/customelements";
import { useTranslation } from "react-i18next";
import { ModalProps } from "../config/types";
import { useParams } from "react-router-dom";
import { axiosT } from "../config/axios";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";
import { RootState } from "../redux/config";

const FollowersModal: React.FC<ModalProps> = ({ open, onClose }) => {
  const { t } = useTranslation();

  const { id } = useParams<{ id: string }>();
  const [followers, setFolloers] = useState<any[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);

  const myId = useSelector((state: RootState) => state.myId.items);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axiosT.get(`/user/followers/${id}`);
        setFolloers(data.followers);
      } catch (e) {
        setError((e as any)?.response?.data || "An error occured");
      }
    })();
  }, [id, refresh]);

  const removeUser = async (userId: string) => {
    try {
      setLoading(true);

      await axiosT.patch(`/user/unfollow/${userId}`, { user: myId });

      setRefresh(!refresh);
    } catch (e) {
      setError((e as any)?.response?.data || "An error occured");
    } finally {
      setLoading(false);
    }
  };

  const deleteFollowers = async () => {
    try {
      setLoading(true);

      await axiosT.delete(`/user/deleteFollowers/${myId}`);
      setRefresh(!refresh);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (e) {
      setError((e as any)?.response?.data || "An error occured");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={stil}>
        {!!loading && <LinearProgress color="secondary" />}
        <span className="font-bold lg:text-2xl">{t("followers")}</span>

        {!!error && (
          <Alert variant="filled" severity="error">
            {error}
          </Alert>
        )}

        {id === myId && followers.length > 0 && (
          <Button
            onClick={deleteFollowers}
            className="!self-end"
            variant="contained"
            color="primary"
          >
            {t("remove")} {t("all")}
          </Button>
        )}

        <div className="flex flex-col w-full h-fit overflow-auto">
          {followers.length > 0 &&
            followers.map((f: any) => (
              <div
                key={f._id}
                className="flex flex-row justify-between p-2 items-center w-full border-b-2 border-black"
              >
                <div className="flex flex-row gap-2 items-center">
                  <img
                    className="w-9 h-9 rounded-full border-2 border-black object-cover"
                    src={f.image}
                    alt=""
                  />
                  <span className="lg:text-lg font-bold">{f.username}</span>
                </div>
                {id === myId && (
                  <Button
                    onClick={() => removeUser(f._id)}
                    className="!whitespace-nowrap w-min h-min"
                    variant="contained"
                    color="secondary"
                  >
                    {t("remove")} {t("user")}
                  </Button>
                )}
              </div>
            ))}
        </div>

        <Button
          onClick={onClose}
          variant="contained"
          color="error"
          endIcon={<CloseIcon />}
        >
          {t("close")}
        </Button>
      </Box>
    </Modal>
  );
};

export default FollowersModal;

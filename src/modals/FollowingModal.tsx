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

const FollowingModal: React.FC<ModalProps> = ({ open, onClose }) => {
  const { t } = useTranslation();

  const { id } = useParams<{ id: string }>();
  const [following, setFollowing] = useState<any[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);

  const myId = useSelector((state: RootState) => state.myId.items);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axiosT.get(`/user/following/${id}`);

        setFollowing(data.map((d: any) => d.user));
      } catch (e) {
        setError((e as any)?.response?.data || "An error occured");
      }
    })();
  }, [id, refresh]);

  const unFollow = async (userId: string) => {
    try {
      setLoading(true);

      await axiosT.patch(`/user/unfollow/${myId}`, { user: userId });

      setRefresh(!refresh);
    } catch (e) {
      setError((e as any)?.response?.data || "An error occured");
    } finally {
      setLoading(false);
    }
  };

  const unFollowAll = async () => {
    try {
      setLoading(true);

      await axiosT.delete(`/user/unfollowAll/${myId}`);
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
        <span className="font-bold lg:text-2xl">{t("following")}</span>

        {!!error && (
          <Alert variant="filled" severity="error">
            {error}
          </Alert>
        )}

        {id === myId && following.length > 0 && (
          <Button
            onClick={unFollowAll}
            className="!self-end"
            variant="contained"
            color="primary"
          >
            {t("unfollow")} {t("all")}
          </Button>
        )}

        <div className="flex flex-col w-full h-fit overflow-auto">
          {following.length > 0 &&
            following.map((f: any) => (
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
                    onClick={() => unFollow(f._id)}
                    className="!whitespace-nowrap w-min h-min"
                    variant="contained"
                    color="secondary"
                  >
                    {t("unfollow")} {t("user")}
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

export default FollowingModal;

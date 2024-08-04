import React, { useEffect, useState } from "react";
import { ModalProps } from "../config/types";
import { Alert, Box, Button, LinearProgress, Modal } from "@mui/material";
import { stil } from "../Custom elements/customelements";
import { useTranslation } from "react-i18next";
import PostModal from "./PostModal";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { useParams } from "react-router-dom";
import { axiosT } from "../config/axios";
import { Close } from "@mui/icons-material";

const SavedPostsModal: React.FC<ModalProps> = ({ open, onClose }) => {
  const { t } = useTranslation();
  const [openPostModal, setOpenPostModal] = useState<boolean>(false);
  const [pId, setPostId] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [posts, setPosts] = useState<any>(null);
  const [refresh, setRefresh] = useState<boolean>(false);
  const { id } = useParams<{ id: string }>();

  const seeDetails = (postId: string) => {
    onClose();
    setPostId(postId);
    setOpenPostModal(true);
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await axiosT.get(`/post/savedPosts/${id}`);
        console.log(data);
        setPosts(data);
      } catch (e) {
        setError((e as any)?.response?.data || "An error occured");
      } finally {
        setLoading(false);
      }
    })();
  }, [refresh, id]);

  const unsavePost = async (postId: string) => {
    try {
      setLoading(true);
      await axiosT.patch(`/post/unsavePost/${id}`, { post: postId });
      setRefresh(!refresh);
    } catch (e) {
      setError((e as any)?.response?.data || "An error occured");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box sx={stil}>
          {!!loading && (
            <LinearProgress color="secondary" sx={{ height: "8px" }} />
          )}
          <span className="lg:text-2xl font-bold text-center">
            {t("savedPosts")}
          </span>
          {!!error && (
            <Alert variant="filled" severity="error">
              {error}
            </Alert>
          )}
          <div className="grid grid-cols-2 w-full gap-2 h-full overflow-auto">
            {!!posts &&
              posts?.posts.map((p: any) => (
                <div key={p._id} className="flex flex-col gap-2 w-full h-fit">
                  <img
                    onClick={() => seeDetails(p._id)}
                    className="border-2 border-black w-full h-[100px] object-cover rounded-md cursor-pointer hover:brightness-50 hover:bg-opacity-70"
                    src={p.images}
                    alt=""
                  />
                  <Button
                    onClick={() => unsavePost(p._id)}
                    variant="contained"
                    color="error"
                    endIcon={<BookmarkBorderIcon />}
                  >
                    {t("remove")} {t("post")}
                  </Button>
                </div>
              ))}
          </div>
          <Button
            className="!self-center"
            onClick={onClose}
            variant="contained"
            color="error"
            endIcon={<Close />}
          >
            {t("close")}
          </Button>
        </Box>
      </Modal>
      <PostModal
        open={openPostModal}
        onClose={() => setOpenPostModal(false)}
        id={pId}
      />
    </>
  );
};

export default SavedPostsModal;

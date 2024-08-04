import React, { useEffect, useState } from "react";
import { ReportModelProps } from "../config/types";
import {
  Box,
  IconButton,
  Modal,
  Checkbox,
  Alert,
  Button,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  LinearProgress,
  Autocomplete,
} from "@mui/material";
import {
  CustomTextFieldBlack,
  stylee,
} from "../Custom elements/customelements";
import { useTranslation } from "react-i18next";
import CloseIcon from "@mui/icons-material/Close";
import Favorite from "@mui/icons-material/Favorite";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import ModeCommentOutlinedIcon from "@mui/icons-material/ModeCommentOutlined";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import SendIcon from "@mui/icons-material/Send";
import { axiosI, axiosT } from "../config/axios";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/config";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import ReportIcon from "@mui/icons-material/Report";
import RepUserModal from "./RepUserModal";
import RepPostModal from "./RepPostModal";
import { setPostId } from "../redux/slices/repPost";
import useComments from "../custom hooks/useComments";
import { setCommentId } from "../redux/slices/commentId";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import CheckIcon from "@mui/icons-material/Check";

const PostModal: React.FC<ReportModelProps> = ({ open, onClose, id }) => {
  const { t } = useTranslation();
  const [post, setPost] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [liked, setLiked] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);
  const [comments, setComments] = useState<any[]>([]);
  const [openRepUser, setOpenRepUser] = useState<boolean>(false);
  const [openRepPost, setOpenRepPost] = useState<boolean>(false);
  const [comment, setComment] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [shared, setShared] = useState<boolean>(false);
  const [toEdit, setToEdit] = useState<boolean>(false);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);

  const [description, setDescription] = useState<string>("");
  const [isEditClicked, setIsEditClicked] = useState<boolean>(false);
  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();

  const myId = useSelector((state: RootState) => state.myId.items);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axiosT.get(`/post/${id}`);
        setPost(data);
      } catch (e) {
        console.log((e as any)?.response?.data || "An error occured");
      }
    })();
    (async () => {
      try {
        const { data } = await axiosT.get(`/post/comments/${id}`);
        setComments(data);
      } catch (e) {
        console.log((e as any)?.response?.data || "An error occured");
      }
    })();
  }, [liked, saved, id, shared]);

  const likePost = async () => {
    try {
      if (liked === false) {
        await axiosT.patch(`/post/likePost/${id}`);
        setLiked(true);
      } else {
        await axiosT.patch(`/post/unlikePost/${id}`);
        setLiked(false);
      }
    } catch (e) {
      setError((e as any)?.response?.data || "An error occured");
    }
  };

  const sharePost = async () => {
    try {
      await axiosT.patch(`/post/sharePost/${id}`);
      setShared(!shared);
    } catch (e) {
      setError((e as any)?.response?.data || "An error occurred");
    }
  };

  const savePost = async () => {
    try {
      if (saved === false) {
        await axiosT.put(`/post/savePost/${myId}`, { posts: [id] });
        setSaved(true);
      } else {
        await axiosT.patch(`/post/unsavePost/${myId}`, { post: id });
        setSaved(false);
      }
    } catch (e) {
      setError((e as any)?.response?.data || "An error occured");
    }
  };

  const openRepUserModal = (id: string) => {
    dispatch(setPostId(id));
    onClose();
    setOpenRepUser(true);
  };

  const openRepPostModal = (id: string) => {
    dispatch(setPostId(id));
    onClose();
    setOpenRepPost(true);
  };

  const setCommentToEdit = (id: string, content: string) => {
    setIsEditClicked(true);
    dispatch(setCommentId(id));
    setComment(content);
  };

  const commentId = useSelector((state: RootState) => state.commentId.items);

  const { deleteComment, fetchComments } = useComments();

  const postComment = async (commentedPost: string) => {
    try {
      setLoading(true);
      await axiosT.post("/post/comment", {
        commentedPost,
        commentedBy: id,
        comment,
      });
      setComment("");
      fetchComments(commentedPost);
    } catch (e) {
      setError((e as any)?.response?.data || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const editComment = async (commentedPost: string) => {
    try {
      await axiosT.patch(`/post/comment/${commentId}`, { comment });

      setComment("");
      setIsEditClicked(false);
      fetchComments(commentedPost);
    } catch (e) {
      setError((e as any)?.response?.data || "An error occurred");
    }
  };

  const deletePost = async () => {
    try {
      setLoading(true);
      await axiosT.delete(`/post/delete/${id}`);

      onClose();
    } catch (e) {
      setError((e as any)?.response?.data || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const navigateOnUser = (id: string) => {
    if (id === myId) {
      onClose();
      navigate(`/home/${id}`);
    } else {
      onClose();
      navigate(`/user/${id}`);
    }
  };

  const setPostToEdit = async () => {
    setToEdit(!toEdit);
    try {
      const { data } = await axiosI.get("/login/all");
      setAllUsers(data?.map((d: any) => d.tags));

      setTags(post?.tags);
      setDescription(post?.description);
    } catch (e) {
      console.error((e as any)?.response?.data || "An error occured");
    }
  };

  const editPost = async () => {
    try {
      await axiosT.patch(`/post/edit/${id}`, { description, tags });
      setToEdit(false);
      setShared(!shared);
    } catch (e) {
      setError((e as any)?.response?.data || "An error occurred");
    }
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box sx={stylee}>
          <IconButton className="!self-end hover:!bg-red-400" onClick={onClose}>
            <CloseIcon className="!text-black !font-semibold" />
          </IconButton>
          {!!error && (
            <Alert variant="filled" severity="error">
              {error}
            </Alert>
          )}
          <div className="flex flex-row w-full h-full">
            <div className="w-2/3 h-full flex flex-col">
              <div className="flex flex-row gap-2 items-end">
                <img
                  src={post?.owner?.image}
                  className="w-10 cursor-pointer h-10 object-cover rounded-full border-2 border-black p=[2px]"
                  alt=""
                />
                <span
                  onClick={onClose}
                  className="font-semibold text-lg hover:underline cursor-pointer"
                >
                  {post?.owner?.username}
                </span>
                <span className="font-semibold text-lg hover:underline cursor-pointer">
                  •{" "}
                  {post?.postedAt
                    ? format(new Date(post.postedAt), "dd-MM-yyyy")
                    : ""}{" "}
                </span>
              </div>
              <img
                src={post?.images}
                className="w-full h-[100px] lg:h-[200px] object-cover cursor-pointer mt-3"
                alt=""
              />
              <div className="w-full flex flex-row justify-between">
                <div className="flex flex-row gap-2 w-min h-min items-center">
                  <Checkbox
                    icon={<FavoriteBorder />}
                    checkedIcon={<Favorite className="!text-red-500" />}
                    checked={!!liked}
                    onChange={likePost}
                  />
                  {post?.likes}
                  <IconButton>
                    <ModeCommentOutlinedIcon />
                  </IconButton>
                  {
                    comments.filter((c: any) => c.commentedPost === post?._id)
                      .length
                  }

                  <IconButton onClick={sharePost}>
                    <ShareOutlinedIcon />
                  </IconButton>
                  {post?.shares}
                </div>
                <Checkbox
                  checked={!!saved}
                  onChange={savePost}
                  icon={<BookmarkBorderIcon />}
                  checkedIcon={<BookmarkIcon className="!text-slate-500" />}
                />
              </div>
              {post?.description}{" "}
              <div className="flex flex-row gap-2 overflow-y-auto">
                {post?.tags?.map((t: any) => (
                  <span
                    key={t._id}
                    onClick={() => navigateOnUser(t._id)}
                    className="text-blue-500 hover:underline"
                  >
                    @{t.username}
                  </span>
                ))}
              </div>
              {!!toEdit && (
                <div className="flex flex-row justify-between p-2 w-full h-fit">
                  <div className="flex flex-col gap-2 w-full pr-2">
                    <Autocomplete
                      multiple
                      options={allUsers}
                      getOptionLabel={(option) => option.username}
                      defaultValue={post?.tags}
                      onChange={(event, newValue) => {
                        const ids = newValue.map((option) => option._id);
                        setTags(ids);
                      }}
                      renderInput={(params) => (
                        <CustomTextFieldBlack
                          {...params}
                          variant="standard"
                          label={t("tags")}
                        />
                      )}
                    />
                    <CustomTextFieldBlack
                      label={t("description")}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <IconButton
                    size="small"
                    onClick={editPost}
                    className="!w-min !h-min !self-center !bg-green-500"
                  >
                    <CheckIcon />
                  </IconButton>
                </div>
              )}
              <div className="flex flex-row justify-around mt-2 ">
                <Button
                  onClick={() => openRepUserModal(post?.owner?._id)}
                  variant="contained"
                  color="error"
                  endIcon={<ReportProblemIcon />}
                >
                  {t("reportUser")}
                </Button>
                {post?.owner?._id === myId && (
                  <Button
                    variant="contained"
                    color="error"
                    onClick={deletePost}
                    endIcon={<DeleteIcon />}
                  >
                    {t("delete")}
                  </Button>
                )}
                {post?.owner?._id === myId && (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={setPostToEdit}
                    endIcon={<EditIcon />}
                  >
                    {t("edit")}
                  </Button>
                )}
                <Button
                  onClick={() => openRepPostModal(post._id)}
                  variant="contained"
                  color="error"
                  endIcon={<ReportIcon />}
                >
                  {t("reportPost")}
                </Button>
              </div>
            </div>
            <div className="grow h-full flex flex-col p-2">
              {!!loading && <LinearProgress color="error" />}
              <span className="font-semibold text-lg">{t("comment")}</span>

              {comments.length > 0 &&
                comments
                  .filter((c: any) => c.commentedPost === post._id)
                  .map((c: any) => (
                    <div
                      key={c._id}
                      className="flex flex-col gap-2 pb-2 border-b-2 border-slate-300 mt-6 overflow-auto"
                    >
                      <span className="font-medium">
                        {c.commentedBy.username}{" "}
                      </span>
                      <div className="flex flex-row h-min gap-4">
                        <img
                          className="w-9 h-9 rounded-full object-cover"
                          src={c.commentedBy.image}
                          alt=""
                        />
                        <span className="grow self-end w-full font-normal">
                          {c.comment}
                        </span>
                        {c.commentedBy._id === myId && (
                          <div className="flex flex-row-reverse gap-2 items-center">
                            <IconButton
                              size="small"
                              onClick={() => deleteComment(c._id)}
                            >
                              <DeleteIcon className="!text-red-500" />
                            </IconButton>

                            <IconButton
                              size="small"
                              onClick={() => setCommentToEdit(c._id, c.comment)}
                            >
                              <EditIcon className="!text-blue-500" />
                            </IconButton>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              <FormControl
                sx={{ width: "100%", color: "black" }}
                variant="standard"
              >
                <InputLabel className="!text-black">
                  {t("add")} {t("comment")}
                </InputLabel>
                <Input
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="!border-black"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={
                          !!isEditClicked
                            ? () => editComment(post._id)
                            : () => postComment(post._id)
                        }
                      >
                        <SendIcon />
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </div>
          </div>
        </Box>
      </Modal>
      <RepUserModal open={openRepUser} onClose={() => setOpenRepUser(false)} />
      <RepPostModal open={openRepPost} onClose={() => setOpenRepPost(false)} />
    </>
  );
};
export default PostModal;

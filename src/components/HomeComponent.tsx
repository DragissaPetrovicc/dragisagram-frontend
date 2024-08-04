import React, { useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  IconButton,
  Checkbox,
  Menu,
  MenuItem,
  Alert,
  FormControl,
  InputAdornment,
  InputLabel,
  Input,
} from "@mui/material";
import SplitscreenIcon from "@mui/icons-material/Splitscreen";
import GridViewIcon from "@mui/icons-material/GridView";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import DeleteIcon from "@mui/icons-material/Delete";
import Favorite from "@mui/icons-material/Favorite";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import ModeCommentOutlinedIcon from "@mui/icons-material/ModeCommentOutlined";
import SendIcon from "@mui/icons-material/Send";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import ReportIcon from "@mui/icons-material/Report";
import BlockIcon from "@mui/icons-material/Block";
import CloseIcon from "@mui/icons-material/Close";
import Loader from "../CustomLoader";
import { axiosT } from "../config/axios";
import { format } from "date-fns";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import usePostActions from "../custom hooks/usePosts";
import useComments from "../custom hooks/useComments";
import EditIcon from "@mui/icons-material/Edit";
import { setCommentId } from "../redux/slices/commentId";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/config";
import { setPostId } from "../redux/slices/repPost";
import RepPostModal from "../modals/RepPostModal";

const HomeComponent: React.FC = () => {
  const { t } = useTranslation();
  const [layout, setLayout] = useState<number>(1);
  const { id } = useParams<{ id: string }>();
  const [posts, setPosts] = useState<any[]>([]);
  const [comment, setComment] = useState<string>("");
  const [followRes, setFollowRes] = useState<{ [key: string]: string }>({});
  const [isEditClicked, setIsEditClicked] = useState<boolean>(false);
  const [following, setFollowing] = useState<any[]>([]);
  const [error, setError] = useState<string>("");
  const [openRepModal, setOpenRepModal] = useState<boolean>(false);
  const navigate = useNavigate();
  const [idd, setIdd] = useState<string>("");
  const [blockRes, setBlockRes] = useState<string>("");

  const dispatch = useDispatch<AppDispatch>();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    userId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setIdd(userId);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const { likePost, sharePost, savePost, postActions, sharedd } =
    usePostActions();

  const {
    comments,
    fetchComments,
    deleteComment,
    loading,
    shared,
    setShared,
    setLoading,
  } = useComments();

  const fetchPosts = async () => {
    try {
      setLoading(true);

      const { data } = await axiosT.get(`/post/allPosts/${id}`, {
        params: { offset: 15 },
      });
      setPosts(data);
    } catch (e) {
      setError((e as any)?.response?.data || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

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

  const setCommentToEdit = (id: string, content: string) => {
    setIsEditClicked(true);
    dispatch(setCommentId(id));
    setComment(content);
  };

  const commentId = useSelector((state: RootState) => state.commentId.items);

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

  const followUser = async (userId: string, postId: string) => {
    try {
      await axiosT.post(`/user/follow`, {
        user: userId,
        follower: id,
      });
      setFollowRes((prev) => ({ ...prev, [postId]: t("following") }));
    } catch (e) {
      setError((e as any)?.response?.data || "An error occurred");
    }
  };

  const unfollowUser = async (userId: string, postId: string) => {
    try {
      await axiosT.patch(`/user/unfollow/${id}`, {
        user: userId,
      });
      setFollowRes((prev) => ({ ...prev, [postId]: t("follow") }));
    } catch (e) {
      setError((e as any)?.response?.data || "An error occurred");
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axiosT.get(`/post/allPosts/${id}`);
        setPosts(data);
      } catch (e) {
        setError((e as any)?.response?.data || "An error occured");
      }
    })();

    (async () => {
      try {
        const { data } = await axiosT.get(`/user/following/${id}`);
        setFollowing(data);
      } catch (e) {
        setError((e as any)?.response?.data || "An error occured");
      }
    })();
  }, [id, postActions, shared, sharedd]);

  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === posts[currentImageIndex]?.images.length - 1
        ? 0
        : prevIndex + 1
    );
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0
        ? posts[currentImageIndex]?.images.length - 1
        : prevIndex - 1
    );
  };

  const reportPost = (postId: string) => {
    setOpenRepModal(true);
    dispatch(setPostId(postId));
    handleClose();
  };

  const blockUser = async (userId: string) => {
    try {
      const { data } = await axiosT.post(`/user/blockUser/${id}`, {
        user: userId,
      });
      setBlockRes(data);
      setTimeout(() => {
        setBlockRes("");
      }, 2000);
      handleClose();
    } catch (e) {
      setError((e as any)?.response?.data || "An error occured");
    }
  };

  const deletePost = async (id: string) => {
    setShared(!shared);
    try {
      setShared(!shared);
      await axiosT.delete(`/post/delete/${id}`);
      setShared(!shared);
      handleClose();
    } catch (e) {
      setShared(!shared);
      setError((e as any)?.response?.data || "An error occured");
    }
    setShared(!shared);
  };

  return (
    <div className="flex flex-col gap-2">
      <ButtonGroup
        className="!self-center !place-self-center !hidden md:!flex"
        variant="contained"
        color="success"
      >
        <Button endIcon={<SplitscreenIcon />} onClick={() => setLayout(1)}>
          Column
        </Button>
        <Button endIcon={<GridViewIcon />} onClick={() => setLayout(2)}>
          Grid
        </Button>
      </ButtonGroup>
      {!!error && (
        <Alert variant="filled" severity="error">
          {error}
        </Alert>
      )}
      {!!blockRes && (
        <Alert severity="success" variant="filled">
          {blockRes}
        </Alert>
      )}
      <div
        className={`w-full gap-4 overflow-x-auto ${
          layout === 1 ? "flex flex-col" : "grid grid-cols-2 lg:grid-cols-3"
        }`}
      >
        {loading ? (
          <Loader />
        ) : (
          posts.length > 0 &&
          posts.map((p) => (
            <Card
              key={p._id}
              className={`!border-b-2 !h-max !border-black !overflow-clip ${
                layout === 1 ? "w-full md:w-1/3" : "w-full"
              } self-center`}
            >
              <CardContent>
                <div className="flex flex-row w-full items-center h-max justify-between">
                  <div className="flex flex-row md:gap-2 items-center mb-[1.7px]">
                    <img
                      onClick={() => navigate(`/user/${p?.owner?._id}`)}
                      className="object-cover w-5 h-5 md:w-10 md:h-10 rounded-full cursor-pointer "
                      src={p?.owner?.image}
                      alt=""
                    />

                    <span className="fond-semibold text-[13px] md:text-base">
                      <b
                        onClick={() => navigate(`/user/${p?.owner?._id}`)}
                        className="hover:underline cursor-pointer"
                      >
                        {p?.owner?.username}
                      </b>{" "}
                      • {format(p?.postedAt, "dd-MM-yyyy")}{" "}
                      {p.owner._id !== id && "•"}
                    </span>
                    {p.owner._id !== id && (
                      <b
                        onClick={
                          following.some(
                            (follow) =>
                              follow.user._id === p.owner._id &&
                              follow.followers.includes(id)
                          )
                            ? () => unfollowUser(p?.owner?._id, p?._id)
                            : () => followUser(p?.owner?._id, p?._id)
                        }
                        className="text-blue-500 hover:underline text-sm lg:text-lg cursor-pointer"
                      >
                        {following.some(
                          (follow) =>
                            follow.user._id === p.owner._id &&
                            follow.followers.includes(id)
                        )
                          ? followRes[p?._id]
                            ? followRes[p?._id]
                            : t("following")
                          : followRes[p?._id]
                          ? followRes[p?._id]
                          : t("follow")}
                      </b>
                    )}
                  </div>
                  <IconButton onClick={(e) => handleClick(e, p.owner._id)}>
                    <MoreVertIcon />
                  </IconButton>
                </div>
                <div className="w-full min-h-[250px] max-h-[250px] relative">
                  <img
                    className="w-full min-h-[250px] max-h-[250px] object-cover cursor-pointer"
                    src={p.images}
                    alt=""
                    onDoubleClick={() => likePost(p._id)}
                  />
                  {p.images.length > 1 && (
                    <div className="absolute flex top-[50%] px-2 place-self-center justify-between w-full h-full">
                      <IconButton
                        size="small"
                        className="!bg-white !h-min"
                        onClick={handlePreviousImage}
                      >
                        <ArrowBackIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        className="!bg-white !h-min"
                        onClick={handleNextImage}
                      >
                        <ArrowForwardIcon />
                      </IconButton>
                    </div>
                  )}
                </div>
              </CardContent>

              <CardActions
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <div className="flex flex-row gap-2 w-min h-min items-center">
                  <Checkbox
                    key={p._id}
                    icon={<FavoriteBorder />}
                    checkedIcon={<Favorite className="!text-red-500" />}
                    checked={postActions[p._id]?.liked || false}
                    onChange={() => likePost(p._id)}
                  />
                  {p.likes}
                  <IconButton onClick={() => fetchComments(p._id)}>
                    <ModeCommentOutlinedIcon />
                  </IconButton>
                  {comments.filter((c: any) => c.commentedPost === p._id)
                    .length || ""}
                  <IconButton onClick={() => sharePost(p._id)}>
                    <ShareOutlinedIcon />
                  </IconButton>
                  {p.shares}
                </div>
                <Checkbox
                  key={p._id}
                  checked={postActions[p._id]?.saved || false}
                  onChange={() => savePost(id, p._id)}
                  icon={<BookmarkBorderIcon />}
                  checkedIcon={<BookmarkIcon className="!text-slate-500" />}
                />
              </CardActions>
              <CardContent className="!overflow-clip">
                <span className="text-lg font-semibold">
                  {p.description}{" "}
                  {p.tags.length > 0 &&
                    p.tags.map((t: any, index: number) => (
                      <b
                        onClick={() => navigate(`/user/${t._id}`)}
                        key={index}
                        className="text-blue-500 cursor-pointer hover:underline"
                      >
                        @{t.username}{" "}
                      </b>
                    ))}
                </span>

                {comments.length > 0 &&
                  comments
                    .filter((c: any) => c.commentedPost === p._id)
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
                          {c.commentedBy._id === id && (
                            <div className="flex flex-row-reverse gap-2 items-center">
                              <IconButton
                                size="small"
                                onClick={() => deleteComment(c._id)}
                              >
                                <DeleteIcon className="!text-red-500" />
                              </IconButton>

                              <IconButton
                                size="small"
                                onClick={() =>
                                  setCommentToEdit(c._id, c.comment)
                                }
                              >
                                <EditIcon className="!text-blue-500" />
                              </IconButton>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                {p.owner._id !== id && (
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
                                ? () => editComment(p._id)
                                : () => postComment(p._id)
                            }
                          >
                            <SendIcon />
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                )}
              </CardContent>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                {idd === id && (
                  <MenuItem
                    className="!flex !items-center !gap-2"
                    onClick={() => deletePost(p._id)}
                  >
                    <DeleteIcon />
                    {t("delete")}
                  </MenuItem>
                )}
                {idd !== id && (
                  <MenuItem
                    onClick={() => blockUser(p?.owner?._id)}
                    className="!flex !items-center !gap-2"
                  >
                    <BlockIcon />
                    {t("block")}
                  </MenuItem>
                )}
                {idd !== id && (
                  <MenuItem
                    onClick={() => reportPost(p._id)}
                    className="!text-red-500 !flex !items-center !gap-2"
                  >
                    <ReportIcon />
                    {t("report")}
                  </MenuItem>
                )}

                <MenuItem
                  className="!flex !items-center !gap-2"
                  onClick={handleClose}
                >
                  <CloseIcon />
                  {t("close")}
                </MenuItem>
              </Menu>
            </Card>
          ))
        )}
      </div>
      {posts.length > 15 && (
        <Button
          onClick={fetchPosts}
          variant="contained"
          className="!whitespace-nowrap !self-center"
        >
          {t("showMore")}
        </Button>
      )}
      <RepPostModal
        open={openRepModal}
        onClose={() => setOpenRepModal(false)}
      />
    </div>
  );
};

export default HomeComponent;

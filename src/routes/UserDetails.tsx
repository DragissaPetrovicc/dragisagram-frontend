import React, { useEffect, useState } from "react";
import { Alert, Button, LinearProgress } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { TabPanel } from "../Custom elements/customelements";
import { axiosT } from "../config/axios";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/config";
import UsersPosts from "../components/UsersPosts";
import TaggedUsersPosts from "../components/TaggedUsersPosts";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import BlockIcon from "@mui/icons-material/Block";
import ReportIcon from "@mui/icons-material/Report";
import { setPostId } from "../redux/slices/repPost";
import RepUserModal from "../modals/RepUserModal";
import FollowersModal from "../modals/FollowersModal";
import FollowingModal from "../modals/FollowingModal";
import { UserRoute } from "../PrivateRoutes";
import { Image, Settings } from "@mui/icons-material";
import SavedPostsModal from "../modals/SavedPosts";
import SettingsModal from "../modals/SettingsModal";
import { Tabs as ReactTabs, Tab as ReactTab } from "react-tabs";
import "react-tabs/style/react-tabs.css";

const UserDetails: React.FC = () => {
  const [error, setError] = useState<string>("");
  const [user, setUser] = useState<any>({});
  const [postsNumber, setPostsNumber] = useState<number>(0);
  const [followers, setFolloers] = useState<any>(null);
  const [following, setFollowing] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [openFollowers, setOpenFollowers] = useState<boolean>(false);
  const [openFollowing, setOpenFollowing] = useState<boolean>(false);

  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const myId = useSelector((state: RootState) => state.myId.items);
  const [value, setValue] = useState<number>(0);
  const { t } = useTranslation();
  const [openSavedPosts, setOpenSavedPosts] = useState<boolean>(false);
  const [isFollowing, setIsFollowing] = useState<string>(t("follow"));
  const [isBlocked, setIsBlocked] = useState<string>(t("block"));
  const [openSettings, setOpenSettings] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axiosT.get(`/user/${id}`);
        setUser(data);
      } catch (e) {
        setError((e as any)?.response?.data || "An error occured");
      }
    })();
    (async () => {
      try {
        const { data } = await axiosT.get(`/post/allPostsBy/${id}`);
        setPostsNumber(data?.length);
      } catch (e) {
        setError((e as any)?.response?.data || "An error occured");
      }
    })();
    (async () => {
      try {
        const { data } = await axiosT.get(`/user/followers/${id}`);
        setFolloers(data.followers?.length);

        data.followers?.map((f: any) =>
          f._id === myId
            ? setIsFollowing(t("following"))
            : setIsFollowing(t("follow"))
        );
      } catch (e) {
        if (!!e) setFolloers(0);
      }
    })();

    (async () => {
      try {
        const { data } = await axiosT.get(`/user/following/${id}`);
        setFollowing(data?.length);
      } catch (e) {
        if (!!e) setFollowing(0);
      }
    })();

    (async () => {
      try {
        const { data } = await axiosT.get(`/user/blockList/${myId}`);
        data.users?.map((u: any) =>
          u._id === id ? setIsBlocked(t("blocked")) : setIsBlocked(t("block"))
        );
      } catch (e) {
        console.error((e as any)?.response?.data || "An error occured");
      }
    })();
  }, [id, t, myId, refresh]);

  const handleChange = (index: number) => {
    setValue(index);
  };

  const follow = async () => {
    try {
      setLoading(true);

      if (isFollowing === t("follow")) {
        await axiosT.post("/user/follow", { user: id, follower: myId });
        setIsFollowing(
          user.private === false ? t("following") : t("requestFollow")
        );
      } else {
        await axiosT.patch(`/user/unfollow/${myId}`, { user: id });
        setIsFollowing(t("follow"));
      }
      setRefresh(!refresh);
    } catch (e) {
      setError((e as any)?.response?.data || "An error occured");
    } finally {
      setLoading(false);
    }
  };

  const blockUser = async () => {
    try {
      setLoading(false);
      await axiosT.post(`/user/blockUser/${myId}`, { user: id });
      setIsBlocked(t("blocked"));
    } catch (e) {
      setError((e as any)?.response?.data || "An error occured");
    } finally {
      setLoading(false);
    }
  };

  const setUserToReport = () => {
    dispatch(setPostId(id as string));
    setOpen(true);
  };

  return (
    <UserRoute>
      <div className="w-full h-full flex flex-col gap-10">
        {!!loading && <LinearProgress color="secondary" />}
        {!!error && (
          <Alert variant="filled" severity="error">
            {error}
          </Alert>
        )}
        <div className="w-full h-fit flex flex-row justify-between px-3 gap-2 md:px-10 md:gap-5 xl:px-56 xl:gap-10">
          <img
            className="w-16 h-16 md:w-32 md:h-32 xl:w-52 xl:h-52 object-cover rounded-full border-2 border-black p-[2px]"
            src={user.image}
            alt=""
          />
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-4 gap-3 text-xs md:text-sm lg:text-base">
              <span className="flex justify-center items-center font-bold">
                {user.username}
              </span>
              <span
                onClick={() => setOpenFollowers(true)}
                className="flex justify-center items-center font-bold cursor-pointer"
              >
                {followers}
              </span>
              <span
                onClick={() => setOpenFollowing(true)}
                className="flex justify-center items-center font-bold cursor-pointer"
              >
                {following}
              </span>
              <span className="flex justify-center items-center font-bold">
                {postsNumber > 0 ? postsNumber : 0}
              </span>
              <span className="flex items-center justify-center border-t-2 border-black">
                {t("username")}
              </span>
              <span className="flex items-center justify-center border-t-2 border-black">
                {t("followers")}
              </span>
              <span className="flex items-center justify-center border-t-2 border-black">
                {t("following")}
              </span>
              <span className="flex items-center justify-center border-t-2 border-black">
                {t("posts")}
              </span>
            </div>
            {id === myId && (
              <div className="flex flex-row justify-between">
                <Button
                  onClick={() => setOpenSavedPosts(true)}
                  className="!whitespace-nowrap !w-min"
                  variant="contained"
                  color="success"
                  endIcon={<Image />}
                >
                  {t("savedPosts")}
                </Button>
                <Button
                  onClick={() => setOpenSettings(true)}
                  className="!whitespace-nowrap !w-min"
                  variant="contained"
                  color="secondary"
                  endIcon={<Settings />}
                >
                  {t("settings")}
                </Button>
              </div>
            )}
            {id !== myId && (
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={follow} variant="contained" color="secondary">
                  {isFollowing}
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<KeyboardBackspaceIcon />}
                  onClick={() => navigate(-1)}
                >
                  {t("back")}
                </Button>
                <Button
                  onClick={blockUser}
                  disabled={isBlocked === t("blocked")}
                  variant="contained"
                  color="error"
                  endIcon={<BlockIcon />}
                >
                  {isBlocked}
                </Button>
                <Button
                  onClick={setUserToReport}
                  variant="contained"
                  color="secondary"
                  endIcon={<ReportIcon />}
                >
                  {t("reportUser")}
                </Button>
              </div>
            )}
          </div>
        </div>
        <AppBar position="static" sx={{ bgcolor: "fuchsia", color: "black" }}>
          <ReactTabs
            selectedIndex={value}
            onSelect={(e) => handleChange(e)}
            aria-label="user details tabs"
          >
            <ReactTab className="!font-bold !text-black" selected={value === 0}>
              {t("posts")}
            </ReactTab>
            <ReactTab className="!font-bold !text-black" selected={value === 1}>
              {t("tagged")}
            </ReactTab>
          </ReactTabs>
        </AppBar>
        <TabPanel value={value} index={0}>
          <UsersPosts id={id as string} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <TaggedUsersPosts />
        </TabPanel>
      </div>

      <FollowersModal
        open={openFollowers}
        onClose={() => setOpenFollowers(false)}
      />

      <FollowingModal
        open={openFollowing}
        onClose={() => setOpenFollowing(false)}
      />
      <SavedPostsModal
        open={openSavedPosts}
        onClose={() => setOpenSavedPosts(false)}
      />
      <RepUserModal open={open} onClose={() => setOpen(false)} />
      <SettingsModal
        open={openSettings}
        onClose={() => setOpenSettings(false)}
      />
    </UserRoute>
  );
};

export default UserDetails;

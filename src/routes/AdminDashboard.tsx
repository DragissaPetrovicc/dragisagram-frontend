import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Button, LinearProgress } from "@mui/material";
import Add from "@mui/icons-material/Add";
import { ROUTES } from "../config/routes";
import { AdminRoute } from "../PrivateRoutes";
import PostRepsModal from "../modals/PostRepsModal";
import UserRepsModal from "../modals/UserRepsModal";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/config";
import { setPostId } from "../redux/slices/repPost";
import { Send, Star } from "@mui/icons-material";
import { axiosI, axiosT } from "../config/axios";
import { format } from "date-fns";
import SendNotificationModel from "../modals/SendNotification";
import "../index.css";

const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [openUserReps, setOpenUserReps] = useState<boolean>(false);
  const [openPostReps, setOpenPostReps] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [refresh, setRefresh] = useState<boolean>(false);
  const [userReps, setUserReps] = useState<any[]>([]);
  const [postReps, setPostReps] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [ratings, setRatings] = useState<any[]>([]);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const { data } = await axiosI.get("/login/all");
        setAllUsers(data);
      } catch (e) {
        console.error((e as any)?.response?.data || "An error occured");
      } finally {
        setLoading(false);
      }
    })();

    (async () => {
      try {
        setLoading(true);
        const { data } = await axiosT.get(`/admin/getPostReps`);
        setPostReps(data);
      } catch (e) {
        console.error((e as any)?.response?.data || "An error occured");
      } finally {
        setLoading(false);
      }
    })();

    (async () => {
      try {
        setLoading(true);
        const { data } = await axiosT.get(`/admin/getUserReps`);
        setUserReps(data);
      } catch (e) {
        console.error((e as any)?.response?.data || "An error occured");
      } finally {
        setLoading(false);
      }
    })();

    (async () => {
      try {
        setLoading(true);
        const { data } = await axiosT.get(`/admin/allRatings`);
        setRatings(data);
      } catch (e) {
        console.error((e as any)?.response?.data || "An error occured");
      } finally {
        setLoading(false);
      }
    })();
  }, [refresh]);

  const handleOpenUserReps = (userRepId: string) => {
    dispatch(setPostId(userRepId));
    setOpenUserReps(true);
  };

  const handleOpenPostReps = (postRepId: string) => {
    dispatch(setPostId(postRepId));
    setOpenPostReps(true);
  };

  const deleteUser = async (userId: string) => {
    try {
      setLoading(true);

      await axiosT.delete(`/user/delete/${userId}`);

      setRefresh(!refresh);
    } catch (e) {
      setError((e as any)?.response?.data || "An error occured");
    } finally {
      setLoading(false);
    }
  };

  const setAsAdmin = async (userId: string) => {
    try {
      setLoading(true);
      await axiosT.patch(`/user/edit/${userId}`, { role: "ADMIN" });

      setRefresh(!refresh);
    } catch (e) {
      setError((e as any)?.response?.data || "An error occured");
    } finally {
      setLoading(false);
    }
  };

  const deleteUserRep = async (repId: string) => {
    try {
      setLoading(true);
      await axiosT.delete(`/admin/deleteUserRep/${repId}`);

      setRefresh(!refresh);
    } catch (e) {
      setError((e as any)?.response?.data || "An error occured");
    } finally {
      setLoading(false);
    }
  };

  const deletePostRep = async (repId: string) => {
    try {
      setLoading(true);
      await axiosT.delete(`/admin/deletePostRep/${repId}`);

      setRefresh(!refresh);
    } catch (e) {
      setError((e as any)?.response?.data || "An error occured");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminRoute>
      <div className="w-full h-full flex flex-col gap-4">
        {!!loading && (
          <LinearProgress color="secondary" sx={{ height: "7px" }} />
        )}
        {!!error && (
          <Alert variant="filled" severity="error">
            {error}
          </Alert>
        )}
        <div className="flex flex-row justify-between items-center w-full h-min">
          <div className="w-1/3">
            <Button
              className="!w-min !bg-white !text-black !font-bold"
              onClick={() => navigate(`/home/${id}`)}
              variant="contained"
            >
              {t("home")}
            </Button>
          </div>

          <span className="w-1/3 text-center text-sm md:text-base lg:text-2xl font-bold">
            {t(`admin`)} {t("dashboard")}
          </span>
          <div className="w-1/3 flex flex-col lg:flex-row gap-2 justify-end">
            <Button
              className="!w-min !whitespace-nowrap !bg-orange-500"
              onClick={() => setOpen(true)}
              variant="contained"
              endIcon={<Send />}
            >
              {t("sendNotification")}
            </Button>

            <Button
              className="!w-min !whitespace-nowrap"
              onClick={() => navigate(ROUTES.REGISTER)}
              variant="contained"
              endIcon={<Add />}
            >
              {t("add")} {t("user")}
            </Button>
          </div>
        </div>

        <div className="w-full h-full flex flex-col lg:flex-row ">
          <div className="w-full lg:w-1/3 border-r-2 border-black pr-2 py-2 h-full flex flex-col overflow-auto">
            <span className="text-center font-bold lg:text-xl">
              {t("allUsers")}
            </span>

            {allUsers.length > 0 &&
              allUsers.map((u: any, index: number) => (
                <div
                  key={u._id}
                  className={`flex flex-row w-full h-fit p-2 border-2 border-black ${
                    index === 0 ? "mt-5" : "mt-0"
                  }`}
                >
                  <div className="h-full w-1/2 flex flex-col gap-2">
                    <span className="font-bold flex items-center w-full gap-2">
                      <img
                        onClick={() => navigate(`/user/${u._id}`)}
                        className="w-9 h-9 object-cover rounded-full border-2 cursor-pointer border-black"
                        src={u.image}
                        alt=""
                      />{" "}
                      {u.username}
                    </span>
                    <Button
                      onClick={() => navigate(`/user/${u._id}`)}
                      variant="contained"
                      color="primary"
                      className="!w-min !self-start"
                    >
                      {t("details")}
                    </Button>
                  </div>
                  <div className="h-full w-1/2 flex flex-col gap-2">
                    <Button
                      onClick={() => setAsAdmin(u._id)}
                      variant="contained"
                      color="success"
                      className="!w-min !self-end !whitespace-nowrap"
                    >
                      {t("setAsAdmin")}
                    </Button>
                    <Button
                      onClick={() => deleteUser(u._id)}
                      variant="contained"
                      color="error"
                      className="!w-min !self-end"
                    >
                      {t("ban")}
                    </Button>
                  </div>
                </div>
              ))}
          </div>

          <div className="w-full lg:w-1/3 border-r-2 border-black p-2 h-full flex flex-col overflow-auto">
            <span className="text-center font-bold lg:text-xl">
              {t("userReps")}
            </span>

            {userReps.length > 0 &&
              userReps.map((u: any, index: number) => (
                <div
                  key={u._id}
                  className={`flex flex-row w-full h-fit p-2 border-2 border-black ${
                    index === 0 ? "mt-5" : "mt-0"
                  }`}
                >
                  <div className="h-full w-1/2 flex flex-col gap-2">
                    <span className="font-bold flex items-center w-full gap-2 ">
                      <img
                        onClick={() => navigate(`/user/${u.reportedBy._id}`)}
                        className="w-9 h-9 object-cover rounded-full border-2 cursor-pointer border-black"
                        src={u.reportedBy.image}
                        alt=""
                      />{" "}
                      {t("reportedBy")}: {u.reportedBy.username}
                    </span>

                    <span className="font-bold flex items-center w-full gap-2">
                      <img
                        onClick={() => navigate(`/user/${u.reportedUser._id}`)}
                        className="w-9 h-9 object-cover rounded-full border-2 cursor-pointer border-black"
                        src={u.reportedUser.image}
                        alt=""
                      />{" "}
                      {t("reportedBy")}: {u.reportedUser.username}
                    </span>
                  </div>

                  <div className="h-full w-1/2 flex flex-col gap-2">
                    <Button
                      onClick={() => handleOpenUserReps(u._id)}
                      variant="contained"
                      color="success"
                      className="!w-min !self-end !whitespace-nowrap"
                    >
                      {t("details")}
                    </Button>
                    <Button
                      onClick={() => deleteUserRep(u._id)}
                      variant="contained"
                      color="error"
                      className="!w-min !self-end"
                    >
                      {t("delete")}
                    </Button>
                  </div>
                </div>
              ))}
          </div>

          <div className="w-full lg:w-1/3 pl-2 py-2 h-full flex flex-col overflow-auto">
            <span className="text-center font-bold lg:text-xl">
              {t("post")} {t("reports")}
              {postReps.length > 0 &&
                postReps.map((u: any, index: number) => (
                  <div
                    key={u._id}
                    className={`flex flex-row w-full h-fit p-2 border-2 border-black ${
                      index === 0 ? "mt-5" : "mt-0"
                    }`}
                  >
                    <div className="h-full w-1/2 flex flex-col gap-2">
                      <span className="font-bold flex items-center w-full gap-2 text-base">
                        <img
                          onClick={() => navigate(`/user/${u.reportedBy._id}`)}
                          className="w-9 h-9 object-cover rounded-full border-2 cursor-pointer border-black"
                          src={u.reportedBy.image}
                          alt=""
                        />{" "}
                        {t("reportedBy")}: {u.reportedBy.username}
                      </span>

                      <span className="font-bold flex items-end w-full gap-2 text-base">
                        {format(u.createdAt, "dd/MM/yyyy")}
                      </span>
                    </div>

                    <div className="h-full w-1/2 flex flex-col gap-2">
                      <Button
                        onClick={() => handleOpenPostReps(u._id)}
                        variant="contained"
                        color="success"
                        className="!w-min !self-end !whitespace-nowrap"
                      >
                        {t("details")}
                      </Button>
                      <Button
                        onClick={() => deletePostRep(u._id)}
                        variant="contained"
                        color="error"
                        className="!w-min !self-end"
                      >
                        {t("delete")}
                      </Button>
                    </div>
                  </div>
                ))}
            </span>
          </div>
        </div>
        <div className="flex flex-row w-full h-fit gap-2">
          {ratings.length > 0 &&
            ratings.map((r: any) => (
              <div
                key={r._id}
                className="w-[260px] p-2 h-[120px] gap-3 flex flex-col border-2 border-black box-border rounded-lg moving-element"
              >
                <span className="font-bold">
                  {t("ratedBy")}: {r.ratedBy.username}
                </span>
                <span className="font-semibold">
                  {t("rated")} {r.stars} <Star className="!text-customYellow" />
                </span>
                {format(r.ratedAt, "dd-MM-yyyy")}
              </div>
            ))}
        </div>
      </div>
      <PostRepsModal
        open={openPostReps}
        onClose={() => setOpenPostReps(false)}
      />
      <UserRepsModal
        open={openUserReps}
        onClose={() => setOpenUserReps(false)}
      />
      <SendNotificationModel open={open} onClose={() => setOpen(false)} />
    </AdminRoute>
  );
};

export default AdminDashboard;

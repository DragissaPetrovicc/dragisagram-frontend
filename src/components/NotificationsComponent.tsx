import React, { useEffect, useState } from "react";
import { CustomBox } from "../Custom elements/customelements";
import { useTranslation } from "react-i18next";
import { Alert, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { useParams } from "react-router-dom";
import { axiosT } from "../config/axios";
import Loader from "../CustomLoader";
import MsgNotificationLoader from "../MsgNotificationsLoader";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/config";
import { setAllNotifications } from "../redux/slices/allNotifications";
import { setNotificationsNumber } from "../redux/slices/notificationState";
import { setPostId } from "../redux/slices/repPost";
import { setBottomNavValue } from "../redux/slices/bottomNav";

const NotificationsComponent: React.FC = () => {
  const { t } = useTranslation();

  const { id } = useParams<{ id: string }>();
  const [error, setError] = useState<string>("");
  const [followRequests, setFollowRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [msgNotLoading, setMsgNotLoading] = useState<boolean>(true);

  setTimeout(() => {
    setMsgNotLoading(false);
  }, 2000);

  const dispatch = useDispatch<AppDispatch>();
  const notificationsNumber = useSelector(
    (state: RootState) => state.notificationState.items
  );

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axiosT.get(`/user/followRequest/${id}`);
        setFollowRequests(data);
        dispatch(setAllNotifications([...notificationsNumber, data]));
      } catch (e) {
        console.error((e as any)?.response?.data || "An error occured");
      }
    })();
  }, [id, refresh, dispatch, notificationsNumber]);

  const acceptRequest = async (reqId: string, userId: string) => {
    try {
      setLoading(true);

      await axiosT.patch(`/user/acceptFollows/${reqId}`, {
        isAccepted: true,
        user: id,
        follower: userId,
      });
      setRefresh(!refresh);
    } catch (e) {
      setError((e as any)?.response?.data || "An error occured");
    } finally {
      setLoading(false);
    }
  };

  const declineRequest = async (reqId: string, userId: string) => {
    try {
      setLoading(true);

      await axiosT.patch(`/user/acceptFollows/${reqId}`, {
        isAccepted: false,
        user: id,
        follower: userId,
      });
      setRefresh(!refresh);
    } catch (e) {
      setError((e as any)?.response?.data || "An error occured");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CustomBox>
        <span className="font-bold lg:text-2xl">{t("notifications")}</span>

        {!!loading && <Loader />}

        <div className="w-full h-full flex flex-col lg:flex-row">
          <div className="w-full lg:w-1/2 h-full overflow-auto lg:border-r-2 lg:border-slate-600 lg:border-opacity-50 px-2">
            <span className="self-center lg:text-xl font-bold mb-3">
              {t("follow")} {t("request")}
            </span>{" "}
            <br />
            {followRequests.length > 0 ? (
              followRequests.map((f: any) => (
                <div
                  key={f._id}
                  className="h-fit w-full p-2 flex flex-row items-center justify-between"
                >
                  <div className="flex flex-row gap-2">
                    <img
                      className="w-9 h-9 object-cover rounded-full"
                      src={f.requestedBy.image}
                      alt=""
                    />
                    <span className="font-semibold lg:text-lg">
                      {f.requestedBy.username} {t("requestedFollow")}
                    </span>
                  </div>

                  <div className="flex flex-row gap-2">
                    <IconButton
                      onClick={() => acceptRequest(f._id, f.requestedBy._id)}
                      size="small"
                      className="!w-min h-min"
                    >
                      <CheckIcon className="!text-green-500" />
                    </IconButton>
                    <IconButton
                      onClick={() => declineRequest(f._id, f.requestedBy._id)}
                      size="small"
                      className="!w-min h-min"
                    >
                      <CloseIcon className="!text-red-500" />
                    </IconButton>
                  </div>
                </div>
              ))
            ) : (
              <span>
                {t("no")} {t("request")}
              </span>
            )}
          </div>
          <div className="w-full lg:w-1/2 h-full overflow-auto px-2 flex flex-col items-start justify-start">
            <span className="self-start lg:text-xl font-bold mb-3">
              {t("message")} {t("notifications")} <br />
              {!!error && (
                <Alert variant="filled" severity="error">
                  {error}
                </Alert>
              )}
              {msgNotLoading ? (
                <MsgNotificationLoader />
              ) : notificationsNumber.length > 0 ? (
                notificationsNumber.map((nm: any, index: number) => (
                  <span
                    onClick={() => {
                      dispatch(setBottomNavValue(3));
                      const updatedNotifications = notificationsNumber.filter(
                        (_, i) => i !== index
                      );
                      dispatch(setNotificationsNumber(updatedNotifications));
                      dispatch(setPostId(nm.chat._id));
                    }}
                    key={index}
                    className={`p-2 ${
                      index === 0 ? "mt-4" : ""
                    } font-semibold flex items-center w-full h-fit hover:bg-slate-50 hover:bg-opacity-50 cursor-pointer`}
                  >
                    {`${t("new")} ${t("message")} ${t("from")}`}:{" "}
                    {nm.sender?.username}{" "}
                    <b className="overflow-hidden ml-2 font-extrabold">
                      {" "}
                      ({nm.content})
                    </b>
                  </span>
                ))
              ) : (
                <span className="w-full text-base font-normal">{`${t("no")} ${t(
                  "new"
                )} ${t("messages")}`}</span>
              )}
            </span>
          </div>
        </div>
      </CustomBox>
    </>
  );
};

export default NotificationsComponent;

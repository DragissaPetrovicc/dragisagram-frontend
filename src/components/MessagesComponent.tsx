import {
  Alert,
  Autocomplete,
  Box,
  IconButton,
  LinearProgress,
  Paper,
  InputBase,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  CustomTextFieldBlack,
  CustomWhiteButton,
} from "../Custom elements/customelements";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate, useParams } from "react-router-dom";
import { axiosI, axiosT } from "../config/axios";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ChatLoader from "../ChatLoader";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import AnnouncementOutlinedIcon from "@mui/icons-material/AnnouncementOutlined";
import SendIcon from "@mui/icons-material/Send";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Delete from "@mui/icons-material/Delete";
import Close from "@mui/icons-material/Close";
import { DeleteOutlined, Logout, Person } from "@mui/icons-material";
import CreateGroupChatModal from "../modals/CreateGroupChatModal";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { io, Socket } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/config";
import { setNotificationsNumber } from "../redux/slices/notificationState";
import { removePostId } from "../redux/slices/repPost";
import { removeBottomNavValue } from "../redux/slices/bottomNav";
import { setAllNotifications } from "../redux/slices/allNotifications";

const ENDPOINT = "https://dragisagram-be.onrender.com";

var socket: Socket, selectedChatCompare: any;

const MessagesComponent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isSelectedChat, setIsSelectedChat] = useState<boolean>(false);
  const { t } = useTranslation();
  const [noChats, setNoChats] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [chatLoading, setChatLoading] = useState<boolean>(false);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [chatId, setChatId] = useState<string>("");
  const [isGroup, setIsGroup] = useState<boolean>(false);
  const [openGroupModal, setOpenGroupModal] = useState<boolean>(false);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [newChatName, setNewChatName] = useState<string>("");
  const [msg, setMsg] = useState<string>("");
  const [cId, setCId] = useState<string>("");
  const [typing, setTyping] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [showEmoji, setShowEmoji] = useState<boolean>(false);
  const [socketConnected, setSocketConnected] = useState<boolean>(false);
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", id);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, [id]);

  const typingHandler = (e: any) => {
    setMsg(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", cId);
    }

    let lastTypingTime = new Date().getTime();
    var timerLength = 2200;

    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", cId);
        setTyping(false);
      }
    });
  };

  const dispatch = useDispatch<AppDispatch>();
  const notificationNumber = useSelector(
    (state: RootState) => state.notificationState.items
  );
  const allNotifications = useSelector(
    (state: RootState) => state.allNotifications.items
  );

  const chatid = useSelector((state: RootState) => state.repPost.items);

  useEffect(() => {
    (async () => {
      if (!!chatid) await selectChat(chatid);
      dispatch(removePostId());
      dispatch(removeBottomNavValue());
    })();
  }, [chatid, dispatch]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare !== newMessageRecieved.chat._id
      ) {
        if (!notificationNumber.includes(newMessageRecieved)) {
          dispatch(
            setNotificationsNumber([newMessageRecieved, ...notificationNumber])
          );
          dispatch(
            setAllNotifications([newMessageRecieved, ...allNotifications])
          );
          setRefresh(!refresh);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const handleCloseGroupModal = () => {
    setOpenGroupModal(false);
    setRefresh(!refresh);
  };

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    cId: string,
    isGr: boolean
  ) => {
    setAnchorEl(event.currentTarget);
    setChatId(cId);
    setIsGroup(isGr);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setChatId("");
  };

  const deleteChat = () => {
    chats.filter((c: any) => c._id !== chatId);
    handleClose();
  };

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axiosI.get("/login/all");
        setAllUsers(data.length > 0 ? data : []);
      } catch (e) {
        setError((e as any)?.response?.data || "An error occurred");
      }
    })();

    (async () => {
      try {
        setChatLoading(true);
        const { data } = await axiosT.get(`/chat/allChats/${id}`);
        setChats(data);
      } catch (e) {
        setNoChats((e as any)?.response?.data || "No chats available");
      } finally {
        setChatLoading(false);
      }
    })();
  }, [id, refresh]);

  const selectChat = async (chatId: string) => {
    try {
      setCId(chatId);
      selectedChatCompare = chatId;
      setIsSelectedChat(true);
      setLoading(true);

      const { data } = await axiosT.get(
        `/message/allMessagesForChat/${chatId}`
      );
      setMessages(data);

      socket.emit("join chat", chatId);
    } catch (e) {
      console.error((e as any)?.response?.data || "An error occured");
    } finally {
      setLoading(false);
    }
  };

  const leaveGroup = async () => {
    try {
      setLoading(true);

      await axiosT.patch(`/chat/removeUserFromGroup/${chatId}`, { user: id });

      chats.filter((c: any) => c._id !== chatId);
      handleClose();
    } catch (e) {
      setError((e as any)?.response?.data || "An error occured");
    } finally {
      setLoading(false);
    }
  };

  const makeChat = async (uId: string) => {
    try {
      setLoading(true);

      const { data } = await axiosT.post(`/chat/oneonone/${id}`, {
        userId: uId,
      });
      setRefresh(!refresh);

      await selectChat(data._id);
    } catch (e) {
      setError((e as any)?.response?.data || "An error occured");
    } finally {
      setLoading(false);
    }
  };

  const goToUser = (userId: string) => {
    setOpenDrawer(false);
    navigate(`/user/${userId}`);
  };

  const removeUserFromGroup = async (chatId: string, userId: string) => {
    try {
      await axiosT.patch(`/chat/removeUserFromGroup/${chatId}`, {
        user: userId,
      });

      setOpenDrawer(false);
      setRefresh(!refresh);
    } catch (e) {
      setError((e as any)?.response?.data || "An error occured");
    }
  };

  const addUserToGroup = async (chatId: string, userId: string) => {
    try {
      await axiosT.put(`/chat/addUserToGroup/${chatId}`, { user: userId });
    } catch (e) {
      setError((e as any)?.response?.data || "An error occured");
    }
  };

  const deleteChatPermamently = async (chatId: string) => {
    try {
      await axiosT.delete(`/chat/deleteChat/${chatId}`);

      setOpenDrawer(false);
      setIsSelectedChat(false);
      setRefresh(!refresh);
    } catch (e) {
      setError((e as any)?.response?.data || "An error occured");
    }
  };

  const changeChatName = async (chatId: string) => {
    try {
      await axiosT.patch(`/chat/renameGroup/${chatId}`, {
        chatName: newChatName,
      });
      setOpenDrawer(false);
      setRefresh(!refresh);
    } catch (e) {
      setError((e as any)?.response?.data || "An error occured");
    }
  };

  const sendMsg = async () => {
    try {
      const { data } = await axiosT.post("/message/send", {
        sender: id,
        content: msg,
        chat: cId,
      });

      setMessages([...messages, data]);

      socket.emit("new message", data);

      socket.emit("stop typing", cId);

      setMsg("");
    } catch (e) {
      setError((e as any)?.response?.data || "An error occured");
    }
  };

  const addEmoji = (e: any) => {
    const sym = e.unified.split("_");
    const codeArray: any[] = [];
    sym.forEach((el: any) => codeArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codeArray);
    setMsg(msg + emoji);
  };

  return (
    <>
      <div className="flex flex-col gap-3 w-full h-full">
        {!!error && (
          <Alert severity="error" variant="filled">
            {error}
          </Alert>
        )}
        {!!loading && (
          <LinearProgress color="secondary" sx={{ height: "10px" }} />
        )}
        <div className="w-full h-full flex flex-row gap-3">
          <Box
            sx={{
              height: "100%",
              width: { xs: "100%", lg: "33%" },
              display: { xs: !!isSelectedChat ? "none" : "flex", lg: "flex" },
              flexDirection: "column",
              p: 2,
              border: "3px solid black",
              borderRadius: "5px",
              overflow: "auto",
            }}
          >
            <div className="flex flex-row my-4 justify-between items-end w-full font-bold lg:text-2xl">
              {t("inbox")}
              <CustomWhiteButton
                onClick={() => setOpenGroupModal(true)}
                variant="contained"
                endIcon={<AddIcon />}
              >
                {t("add")} {t("group")} {t("chat")}
              </CustomWhiteButton>
            </div>

            {allUsers.length > 0 && (
              <FormControl fullWidth>
                <InputLabel>{t("allUsers")}</InputLabel>
                <Select label={t("allUsers")}>
                  {allUsers.map((u) => (
                    <MenuItem key={u._id} onClick={() => makeChat(u._id)}>
                      <img
                        className="w-6 h-6 object-cover rounded-full pr-2"
                        src={u.image}
                        alt=""
                      />
                      {u.username}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {!!chatLoading && <ChatLoader />}

            {noChats ? (
              <Alert severity="warning" variant="filled">
                {noChats}
              </Alert>
            ) : (
              chats.length > 0 &&
              chats.map((c: any, index: number) => {
                const userImage = c.users.find((u: any) => u._id !== id)?.image;
                return (
                  <div
                    key={c._id}
                    className={`w-full h-fit p-2 flex flex-row justify-between  ${
                      index === 0 && "mt-4 border-y-2"
                    } border-b-2 border-black`}
                  >
                    <div
                      onClick={() => {
                        const updatedNotifications = notificationNumber.filter(
                          (notify: any) => notify.chat._id !== c._id
                        );
                        dispatch(setNotificationsNumber(updatedNotifications));
                        selectChat(c._id);
                      }}
                      className="flex flex-row gap-2 w-min items-center cursor-pointer"
                    >
                      {userImage && (
                        <img
                          className="w-10 h-10 rounded-full border-2 border-black "
                          src={userImage}
                          alt="User"
                        />
                      )}

                      <span
                        className={`${
                          notificationNumber.length > 0 &&
                          notificationNumber.map((notification: any) =>
                            notification.chat._id === c._id
                              ? "font-bold"
                              : "font-semibold"
                          )
                        } whitespace-nowrap lg:text-lg`}
                      >
                        {c.isGroupChat === true && `${t("group")} ${t("chat")}`}
                        {c.isGroupChat === true && <br />}
                        {c.chatName}
                      </span>
                    </div>
                    <IconButton
                      onClick={(e) => handleClick(e, c._id, c.isGroupChat)}
                      size="small"
                    >
                      <MoreHorizIcon />
                    </IconButton>
                  </div>
                );
              })
            )}

            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              {!!isGroup && (
                <MenuItem onClick={leaveGroup} sx={{ marginLeft: "2px" }}>
                  <Logout /> {t("leaveGroup")}
                </MenuItem>
              )}
              <MenuItem onClick={deleteChat}>
                <Delete /> {t("deleteChat")}
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Close /> {t("close")}
              </MenuItem>
            </Menu>
          </Box>

          <Box
            sx={{
              height: "100%",
              width: { xs: "100%", lg: "66%" },
              display: { xs: isSelectedChat ? "flex" : "none", lg: "flex" },
              flexDirection: "column",
              gap: 3,
              p: 2,
              border: "3px solid black",
              borderRadius: "5px",
              overflowY: "auto",
            }}
          >
            {!!isSelectedChat && (
              <div className="w-full flex flex-row justify-between sticky top-0 p-[1.5px]">
                <IconButton onClick={() => setIsSelectedChat(false)}>
                  <ArrowBackIosNewIcon />
                </IconButton>
                <IconButton onClick={() => setOpenDrawer(true)}>
                  <InfoOutlinedIcon />
                </IconButton>
              </div>
            )}

            {!isSelectedChat ? (
              <div className="w-full h-full justify-center items-center flex flex-col overflow-auto">
                <AnnouncementOutlinedIcon className="!text-slate-500 !text-7xl !font-bold" />
                <span className="text-2xl text-slate-500 font-semibold">
                  {t("noChatSelected")}
                </span>
              </div>
            ) : (
              <div className="grow flex flex-col p-2 gap-2 justify-end overflow-y-clip">
                {messages.length > 0 &&
                  messages.map((m) => (
                    <div
                      key={m._id}
                      className={`flex flex-row items-center gap-2 ${
                        m.sender._id === id ? "self-end" : "self-start"
                      }`}
                    >
                      {m.sender._id !== id && (
                        <img
                          onClick={() => navigate(`/user/${m.sender._id}`)}
                          className="w-6 h-6 object-cover rounded-full cursor-pointer"
                          src={m.sender.image}
                          alt=""
                        />
                      )}

                      <span
                        className={`p-2 flex justify-center rounded-3xl items-center font-medium ${
                          m.sender._id === id
                            ? "bg-green-400 bg-opacity-50"
                            : "bg-red-600 bg-opacity-50"
                        }`}
                      >
                        {m.content}
                      </span>

                      <Drawer
                        anchor="right"
                        open={openDrawer}
                        onClose={() => setOpenDrawer(false)}
                      >
                        <Box
                          sx={{
                            width: { xs: "100%", md: "300px" },
                            height: "100%",
                            backgroundColor: "white",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          <span className="!text-center !self-center lg:text-2xl font-bold">
                            {m.chat.chatName}
                          </span>
                          {m.chat.isGroupChat &&
                            m.chat.groupAdmin?._id === id && (
                              <div className="flex flex-col w-full gap-2 p-4">
                                <CustomTextFieldBlack
                                  defaultValue={m.chat.chatName}
                                  value={newChatName}
                                  placeholder={m.chat.chatName}
                                  onChange={(e) =>
                                    setNewChatName(e.target.value)
                                  }
                                  label={`${t("change")} ${t("chat")} ${t(
                                    "name"
                                  )}`}
                                />
                                <Button
                                  onClick={() => changeChatName(m.chat._id)}
                                  variant="contained"
                                  color="success"
                                >
                                  {t("submit")}
                                </Button>
                              </div>
                            )}

                          <List>
                            {m.chat.isGroupChat && (
                              <ListItem>
                                <ListItemText>
                                  {t("admin")}: {m.chat.groupAdmin?.username}
                                </ListItemText>
                              </ListItem>
                            )}
                            {m.chat.isGroupChat && <Divider />}
                            {m.chat.users.length > 0 &&
                              m.chat.users.map((u: any, index: number) => (
                                <ListItem key={index}>
                                  <ListItemButton>
                                    <ListItemIcon
                                      onClick={() => goToUser(u._id)}
                                    >
                                      <Person />
                                    </ListItemIcon>
                                    <ListItemText
                                      onClick={() => goToUser(u._id)}
                                    >
                                      {u.username}
                                    </ListItemText>
                                    {m.chat.isGroupChat && (
                                      <ListItemIcon>
                                        <DeleteOutlined
                                          onClick={() =>
                                            removeUserFromGroup(
                                              m.chat._id,
                                              u._id
                                            )
                                          }
                                          className="!text-red-500"
                                        />
                                      </ListItemIcon>
                                    )}
                                  </ListItemButton>
                                </ListItem>
                              ))}
                            {m.chat.isGroupChat && (
                              <Autocomplete
                                disablePortal
                                options={allUsers}
                                getOptionLabel={(option) => option.username}
                                sx={{ width: "100%", padding: 2 }}
                                renderInput={(params) => (
                                  <CustomTextFieldBlack
                                    {...params}
                                    label={t("allUsers")}
                                  />
                                )}
                                renderOption={(props, option) => (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexDirection: "row",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                    }}
                                    onClick={() =>
                                      addUserToGroup(m.chat._id, option._id)
                                    }
                                    component="li"
                                    {...props}
                                  >
                                    <div className="flex flex-row gap-2 items-center w-full">
                                      <img
                                        src={option.image}
                                        alt="User"
                                        style={{
                                          width: 20,
                                          height: 20,
                                          marginRight: 10,
                                          borderRadius: "100%",
                                        }}
                                      />
                                      {option.username}
                                    </div>
                                    <AddIcon className="!w-min !h-min !rounded-full !bg-blue-500 !text-white" />
                                  </Box>
                                )}
                              />
                            )}
                            {m.chat.groupAdmin?._id === id && (
                              <Button
                                onClick={() =>
                                  deleteChatPermamently(m.chat._id)
                                }
                                className="!ml-16 !mb-4"
                                variant="contained"
                                color="error"
                                endIcon={<Delete />}
                              >
                                {t("delete")} {t("chat")}
                              </Button>
                            )}
                            <Divider />
                            <ListItem>
                              <ListItemButton
                                onClick={() => setOpenDrawer(false)}
                              >
                                <ListItemIcon>
                                  <Close />
                                </ListItemIcon>
                                <ListItemText>{t("close")}</ListItemText>
                              </ListItemButton>
                            </ListItem>
                          </List>
                        </Box>
                      </Drawer>
                    </div>
                  ))}
                {!!isTyping && (
                  <span className="p-2 w-min flex justify-center rounded-3xl items-center font-medium bg-slate-500 bg-opacity-50">
                    {t("typing")}
                  </span>
                )}
                <Paper
                  className="!sticky !bottom-0"
                  component="form"
                  sx={{
                    p: "2px 4px",
                    display: "flex",
                    alignItems: "center",
                    width: "full",
                  }}
                >
                  <IconButton onClick={() => setShowEmoji(!showEmoji)}>
                    <SentimentSatisfiedAltIcon />
                    {!!showEmoji && (
                      <div className="absolute bottom-[100%] lg:right-12">
                        <Picker
                          data={data}
                          emojiSize={20}
                          onEmojiSelect={addEmoji}
                        />
                      </div>
                    )}
                  </IconButton>

                  <InputBase
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        sendMsg();
                      }
                    }}
                    value={msg}
                    onChange={typingHandler}
                    sx={{ ml: 1, flex: 1 }}
                    placeholder={t("typeMessage")}
                    inputProps={{ "aria-label": t("typeMessage") }}
                  />
                  <IconButton onClick={() => sendMsg()}>
                    <SendIcon />
                  </IconButton>
                </Paper>
              </div>
            )}
          </Box>
        </div>
      </div>

      <CreateGroupChatModal
        open={openGroupModal}
        onClose={handleCloseGroupModal}
      />
    </>
  );
};

export default MessagesComponent;

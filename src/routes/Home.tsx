import React, { useEffect, useState } from "react";
import { UserRoute } from "../PrivateRoutes";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import {
  Badge,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import MessageIcon from "@mui/icons-material/Message";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import { useTranslation } from "react-i18next";
import HomeComponent from "../components/HomeComponent";
import SearchComponent from "../components/SearchComponent";
import AddComponent from "../components/AddComponent";
import MessagesComponent from "../components/MessagesComponent";
import NotificationsComponent from "../components/NotificationsComponent";
import MyProfileComponent from "../components/MyProfile";
import RatingModal from "../modals/RatingModal";
import { useNavigate, useParams } from "react-router-dom";
import { axiosT } from "../config/axios";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/config";
import { setMyId } from "../redux/slices/myId";
import { Close, Menu } from "@mui/icons-material";

const Home: React.FC = () => {
  const { t } = useTranslation();
  const bottomNavValue = useSelector(
    (state: RootState) => state.bottomNav.items
  );
  const [value, setValue] = useState<number>(0);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const image = localStorage.getItem("image");
  const [openRatingModal, setOpenRatingModal] = useState<boolean>(false);
  const { id } = useParams<{ id: string }>();

  const dispatch = useDispatch<AppDispatch>();

  const allNotifications = useSelector(
    (state: RootState) => state.allNotifications.items
  );
  const msgNotifications = useSelector(
    (state: RootState) => state.notificationState.items
  );

  useEffect(() => {
    (async () => {
      const { data } = await axiosT.get(`/user/${id}`);
      if (data && data?.rated === false) {
        setTimeout(() => {
          setOpenRatingModal(true);
        }, 12500);
      }
    })();

    dispatch(setMyId(id as string));
  }, [id, dispatch]);

  useEffect(() => {
    setValue(bottomNavValue === 0 ? value : bottomNavValue);
  }, [bottomNavValue, value]);

  const navigateHome = () => {
    setOpenDrawer(false);

    setValue(0);
  };

  const navigateSearch = () => {
    setOpenDrawer(false);

    setValue(1);
  };

  const navigateAdd = () => {
    setOpenDrawer(false);

    setValue(2);
  };

  const navigateMsgs = () => {
    setOpenDrawer(false);

    setValue(3);
  };

  const navigateNotifications = () => {
    setOpenDrawer(false);

    setValue(4);
  };

  const navigateMyProfile = () => {
    setOpenDrawer(false);
    setValue(5);
  };

  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  return (
    <UserRoute>
      <div className="w-full h-full flex flex-col">
        <div className="flex flex-row justify-between md:hidden">
          <IconButton
            onClick={() => setOpenDrawer(true)}
            className="!bg-customYellow !text-black !font-bold !mb-2"
          >
            <Menu />
          </IconButton>
          {role === "ADMIN" && (
            <Button
              className=" md:!flex !w-min !h-min whitespace-nowrap md:!fixed"
              variant="contained"
              color="primary"
              onClick={() => navigate(`/adminDashboard/${id}`)}
            >
              {t("admin")} {t("dashboard")}
            </Button>
          )}
        </div>

        {role === "ADMIN" && (
          <Button
            className="!hidden md:!flex !w-min !h-min md:!whitespace-nowrap md:!fixed"
            variant="contained"
            color="primary"
            onClick={() => navigate(`/adminDashboard/${id}`)}
          >
            {t("admin")} {t("dashboard")}
          </Button>
        )}

        <Drawer
          sx={{ width: "100%", height: "100%", gap: 2 }}
          anchor="left"
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}
        >
          <Box sx={{ width: "100%", height: "100%", gap: 2 }}>
            <List>
              <ListItem>
                <ListItemButton onClick={navigateHome}>
                  <ListItemIcon>
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText>{t("home")}</ListItemText>
                </ListItemButton>
              </ListItem>

              <ListItem>
                <ListItemButton onClick={navigateSearch}>
                  <ListItemIcon>
                    <SearchIcon />
                  </ListItemIcon>
                  <ListItemText>{t("search")}</ListItemText>
                </ListItemButton>
              </ListItem>

              <ListItem>
                <ListItemButton onClick={navigateAdd}>
                  <ListItemIcon>
                    <AddBoxOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText>{t("add")}</ListItemText>
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton onClick={navigateMsgs}>
                  <ListItemIcon>
                    <MessageIcon />
                  </ListItemIcon>
                  <ListItemText>
                    {t("messages")}{" "}
                    {msgNotifications.length > 0 && (
                      <span className="w-min h-min p-[1.2px] rounded-full bg-blue-400 bg-opacity-50 font-semibold">
                        {msgNotifications.length}
                      </span>
                    )}
                  </ListItemText>
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton onClick={navigateNotifications}>
                  <ListItemIcon>
                    <FavoriteIcon />
                  </ListItemIcon>
                  <ListItemText>
                    {t("notifications")}{" "}
                    {allNotifications.length - 1 > 0 && (
                      <span className="w-min h-min p-[1.2px] rounded-full bg-blue-400 bg-opacity-50 font-semibold">
                        {allNotifications.length - 1}
                      </span>
                    )}
                  </ListItemText>
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton onClick={navigateMyProfile}>
                  <ListItemIcon>
                    <img
                      className="object-cover rounded-full w-6 h-6"
                      src={image as string}
                      alt=""
                    />
                  </ListItemIcon>
                  <ListItemText>{t("myProfile")}</ListItemText>
                </ListItemButton>
              </ListItem>
            </List>
            <Divider />
            <List>
              <ListItem>
                <ListItemButton onClick={() => setOpenDrawer(false)}>
                  <ListItemIcon>
                    <Close />
                  </ListItemIcon>
                  <ListItemText>{t("close")}</ListItemText>
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        </Drawer>

        <div className="w-full h-full">
          {value === 0 && <HomeComponent />}
          {value === 1 && <SearchComponent />}
          {value === 2 && <AddComponent />}
          {value === 3 && <MessagesComponent />}
          {value === 4 && <NotificationsComponent />}
          {value === 5 && <MyProfileComponent />}
        </div>

        <BottomNavigation
          className="!bg-transparent !w-full md:!flex md:!flex-row !hidden md:!bottom-32 md:!top-[78%] md:!left-10 !fixed !gap-4"
          showLabels
          value={value}
          onChange={(e, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction
            className="!text-customYellow "
            label={t("home")}
            icon={<HomeIcon />}
          />
          <BottomNavigationAction
            className="!text-customYellow "
            label={t("search")}
            icon={<SearchIcon />}
          />
          <BottomNavigationAction
            className="!text-customYellow "
            label={t("add")}
            icon={<AddBoxOutlinedIcon />}
          />
          <BottomNavigationAction
            className="!text-customYellow "
            label={t("messages")}
            icon={
              <Badge
                className="!text-customYellow "
                badgeContent={
                  msgNotifications.length > 0 ? msgNotifications.length : 0
                }
                color="primary"
              >
                <MessageIcon className="!text-customYellow" color="action" />
              </Badge>
            }
          />
          <BottomNavigationAction
            className="!text-customYellow "
            label={t("notifications")}
            icon={
              <Badge
                className="!text-customYellow "
                badgeContent={
                  allNotifications.length - 1 > 0 && allNotifications.length - 1
                }
                color="primary"
              >
                <FavoriteIcon className="!text-customYellow" color="action" />
              </Badge>
            }
          />
          <BottomNavigationAction
            className="!text-customYellow "
            label={t("myProfile")}
            icon={
              <img
                className="object-cover w-4 h-4 md:w-9 md:h-9 rounded-full"
                src={image as string}
                alt=""
              />
            }
          />
        </BottomNavigation>
      </div>
      <RatingModal
        open={openRatingModal}
        onClose={() => setOpenRatingModal(false)}
      />
    </UserRoute>
  );
};

export default Home;

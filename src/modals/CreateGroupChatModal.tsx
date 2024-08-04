import React, { useEffect, useState } from "react";
import { ModalProps } from "../config/types";
import {
  Alert,
  Box,
  Button,
  LinearProgress,
  Modal,
  Autocomplete,
} from "@mui/material";
import { CustomTextFieldBlack, stil } from "../Custom elements/customelements";
import { useTranslation } from "react-i18next";
import Close from "@mui/icons-material/Close";
import Add from "@mui/icons-material/Add";
import { CustomWhiteButton } from "../Custom elements/customelements";
import { axiosT, axiosI } from "../config/axios";
import { useParams } from "react-router-dom";

const CreateGroupChatModal: React.FC<ModalProps> = ({ open, onClose }) => {
  const { t } = useTranslation();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [chatName, setChatName] = useState<string>("");
  const [users, setUsers] = useState<string[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const { id } = useParams<{ id: string }>();

  const addGroup = async () => {
    try {
      setLoading(true);
      await axiosT.post(`/chat/createGroupChat/${id}`, { chatName, users });
      onClose();
    } catch (e) {
      setError((e as any)?.response?.data || "An error occurred");
    } finally {
      setLoading(false);
    }
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
  }, []);

  const handleUserClick = (option: any) => {
    setSelectedUser(option.username);
    setUsers((prevUsers) => [...prevUsers, option._id]);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={stil}>
        {!!loading && (
          <LinearProgress color="secondary" sx={{ height: "8px" }} />
        )}
        <span className="font-bold text-2xl">
          {t("add")} {t("group")} {t("chat")}
        </span>

        {!!error && (
          <Alert variant="filled" severity="error">
            {error}
          </Alert>
        )}

        <div className="flex flex-col gap-2 w-full">
          <Autocomplete
            multiple
            options={allUsers}
            getOptionLabel={(option) => option.username}
            onChange={(event, newValue) => {
              const ids = newValue.map((option) => option._id);
              setUsers(ids);
            }}
            renderInput={(params) => (
              <CustomTextFieldBlack
                {...params}
                variant="standard"
                label={t("user")}
                value={selectedUser}
              />
            )}
            renderOption={(props, option) => (
              <Box
                onClick={() => handleUserClick(option)}
                component="li"
                {...props}
              >
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
              </Box>
            )}
          />

          <CustomTextFieldBlack
            fullWidth
            label={`${t("chat")}${t("name")}`}
            value={chatName}
            onChange={(e) => setChatName(e.target.value)}
          />
        </div>

        <div className="flex flex-row w-full justify-between items-center">
          <Button
            onClick={onClose}
            variant="contained"
            startIcon={<Close />}
            color="error"
          >
            {t("close")}
          </Button>
          <CustomWhiteButton
            onClick={addGroup}
            variant="contained"
            endIcon={<Add />}
          >
            {t("add")} {t("group")} {t("chat")}
          </CustomWhiteButton>
        </div>
      </Box>
    </Modal>
  );
};

export default CreateGroupChatModal;

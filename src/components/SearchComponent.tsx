import React, { useState } from "react";
import { CustomBox } from "../Custom elements/customelements";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import {
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Loader from "../CustomLoader";
import { axiosT } from "../config/axios";

const SearchComponent: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [users, setUsers] = useState<any[]>([]);
  const { id } = useParams<{ id: string }>();

  const searchUsers = async () => {
    try {
      setLoading(true);

      const { data } = await axiosT.get(`/user/search/${id}`, {
        params: { search },
      });
      setUsers(data);
    } catch (e) {
      setError((e as any)?.response?.data || "An error occured");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <span className="hidden lg:flex font-bold text-4xl italic">
        {t("search")}
      </span>

      <CustomBox>
        <FormControl sx={{ width: "100%", color: "black" }} variant="standard">
          <InputLabel className="!text-black">{t("search")}</InputLabel>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="!border-black"
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={searchUsers}>
                  {!!loading ? <Loader /> : <SearchIcon />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>

        {!!error && (
          <Alert variant="filled" severity="error">
            {error}
          </Alert>
        )}

        {users.length > 0 && (
          <span className="font-bold text-xl self-start">
            {t("foundUsers")}:
          </span>
        )}

        <div className="w-full h-fit flex flex-col">
          {users.length > 0 &&
            users.map((u: any, index: number) => (
              <div
                key={u._id}
                onClick={() => navigate(`/user/${u._id}`)}
                className={`${
                  index % 2 === 0
                    ? "bg-white text-black hover:bg-black hover:text-white"
                    : "bg-slate-400 text-black hover:bg-black hover:text-white"
                } flex flex-row justify-between items-center p-2`}
              >
                <div className="flex flex-row gap-3 w-fit items-center">
                  <img
                    src={u.image}
                    className="w-10 h-10 object-cover rounded-full border-2 border-black hover:border-white p-[1px]"
                    alt=""
                  />
                  <span className="font-semibold text-base text-blue-500">
                    @{u.username}
                  </span>
                </div>
                <span className="font-medium">
                  {u.location?.state}, {u.location?.city}
                </span>
              </div>
            ))}
        </div>
      </CustomBox>
    </>
  );
};

export default SearchComponent;

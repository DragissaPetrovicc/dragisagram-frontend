import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  CustomBox,
  CustomWhiteButton,
  VisuallyHiddenInput,
} from "../Custom elements/customelements";
import { useParams } from "react-router-dom";
import { axiosI, axiosT } from "../config/axios";
import { Alert, Autocomplete, CircularProgress } from "@mui/material";
import { CustomTextFieldBlack } from "../Custom elements/customelements";
import AddIcon from "@mui/icons-material/Add";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { setBottomNavValue } from "../redux/slices/bottomNav";
import { AppDispatch } from "../redux/config";
import { useDispatch } from "react-redux";

const AddComponent: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const [error, setError] = useState<string>("");
  const [allTags, setAllTags] = useState<any[]>([]);
  const [description, setDescription] = useState<string>("");
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [images, setImages] = useState<string[]>([]);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axiosI.get("/login/all");
        setAllTags(data);
      } catch (e) {
        setError((e as any)?.response?.data || "An error occurred");
      }
    })();
  }, []);

  const addPost = async () => {
    try {
      setLoading(true);
      await axiosT.post("/post/make", { owner: id, images, description, tags });
      dispatch(setBottomNavValue(0));
    } catch (e) {
      setError((e as any)?.response?.data || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const imgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      fileArray.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages((prevImages) => [...prevImages, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  return (
    <CustomBox>
      <span className="text-center font-bold text-base lg:text-2xl">
        {t("add")} {t("post")}
      </span>

      {!!error && (
        <Alert variant="filled" severity="error">
          {error}
        </Alert>
      )}

      <div className="flex flex-col gap-2 w-full pr-2">
        <Autocomplete
          multiple
          options={allTags}
          getOptionLabel={(option) => option.username}
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
      <div className="flex flex-row justify-around w-full">
        {images.length > 0 &&
          images.map((i, index) => (
            <img
              key={index}
              className="w-1/4 h-[150px] object-cover rounded-md"
              src={i}
              alt=""
            />
          ))}
      </div>

      <div className="flex w-full flex-row justify-between">
        {images.length === 3 ? (
          <Alert variant="filled" severity="warning">
            {t("maxImages")}
          </Alert>
        ) : (
          <CustomWhiteButton
            variant="contained"
            endIcon={<CloudUploadIcon />}
            component="label"
          >
            {t("choseImage")}
            <VisuallyHiddenInput type="file" multiple onChange={imgUpload} />
          </CustomWhiteButton>
        )}
        {!!loading ? (
          <CircularProgress />
        ) : (
          <CustomWhiteButton
            endIcon={<AddIcon />}
            onClick={addPost}
            variant="contained"
          >
            {t("add")}
          </CustomWhiteButton>
        )}
      </div>
    </CustomBox>
  );
};

export default AddComponent;

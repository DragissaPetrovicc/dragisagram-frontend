import React, { useEffect, useState } from "react";
import { axiosT } from "../config/axios";
import { ComponentProps } from "../config/types";
import { Alert } from "@mui/material";
import PostModal from "../modals/PostModal";

const UsersPosts: React.FC<ComponentProps> = ({ id }) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [error, setError] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [selectedPostId, setSelectedPostId] = useState<string>("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axiosT.get(`/post/allPostsBy/${id}`);
        setPosts(data);
      } catch (e) {
        setError((e as any)?.response?.data || "An error occurred");
      }
    };
    fetchPosts();
  }, [id]);

  const handleOpenModal = (postId: any) => {
    setSelectedPostId(postId);
    setOpen(true);
  };

  return (
    <div className="grid grid-cols-3 xl:grid-cols-4 gap-3 overflow-auto">
      {!!error && (
        <Alert variant="filled" severity="error">
          {error}
        </Alert>
      )}
      {posts.length > 0 &&
        posts.map((p) => (
          <img
            key={p._id}
            src={p.images}
            className="w-full h-[150px] md:h-[200px] lg:h-[350px] border-2 border-black cursor-pointer hover:brightness-50 hover:bg-opacity-70 "
            alt=""
            onClick={() => handleOpenModal(p._id)}
          />
        ))}
      <PostModal
        open={open}
        onClose={() => setOpen(false)}
        id={selectedPostId}
      />
    </div>
  );
};

export default UsersPosts;

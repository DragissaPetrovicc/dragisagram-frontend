import { useState } from "react";
import { axiosT } from "../config/axios";

const usePostActions = () => {
  const [postActions, setPostActions] = useState<{
    [key: string]: { liked: boolean; saved: boolean; sharedd: boolean };
  }>({});
  const [error, setError] = useState<string>("");
  const [sharedd, setShared] = useState<boolean>(false);

  const likePost = async (postId: string) => {
    try {
      if (!postActions[postId]?.liked) {
        await axiosT.patch(`/post/likePost/${postId}`);
        setPostActions((prev) => ({
          ...prev,
          [postId]: { ...prev[postId], liked: true },
        }));
      } else {
        await axiosT.patch(`/post/unlikePost/${postId}`);
        setPostActions((prev) => ({
          ...prev,
          [postId]: { ...prev[postId], liked: false },
        }));
      }
    } catch (e) {
      setError((e as any)?.response?.data || "An error occurred");
    }
  };

  const savePost = async (id: string | undefined, postId: string) => {
    try {
      if (!postActions[postId]?.saved) {
        await axiosT.put(`/post/savePost/${id}`, { posts: [postId] });
        setPostActions((prev) => ({
          ...prev,
          [postId]: { ...prev[postId], saved: true },
        }));
      } else {
        await axiosT.patch(`/post/unsavePost/${id}`, { post: postId });
        setPostActions((prev) => ({
          ...prev,
          [postId]: { ...prev[postId], saved: false },
        }));
      }
    } catch (e) {
      setError((e as any)?.response?.data || "An error occurred");
    }
  };

  const sharePost = async (postId: string) => {
    try {
      await axiosT.patch(`/post/sharePost/${postId}`);
      setShared(!sharedd);
    } catch (e) {
      setError((e as any)?.response?.data || "An error occurred");
    }
  };

  return {
    likePost,
    sharePost,
    savePost,
    postActions,
    setPostActions,
    error,
    setError,
    sharedd,
    setShared,
  };
};

export default usePostActions;

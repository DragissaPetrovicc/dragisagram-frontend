import { useState } from "react";
import { axiosT } from "../config/axios";

const useComments = () => {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [shared, setShared] = useState<boolean>(false);

  const fetchComments = async (commentedPost?: string) => {
    try {
      setLoading(true);
      const { data } = await axiosT.get(`/post/comments/${commentedPost}`);
      setComments(data);
    } catch (e) {
      console.log((e as any)?.response?.data || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      setLoading(true);
      await axiosT.delete(`/post/comment/${commentId}`);
      setShared(!shared);
    } catch (e) {
      setError((e as any)?.response?.data || "An error occurred");
    } finally {
      setLoading(false);
    }
  };
  return {
    comments,
    fetchComments,
    deleteComment,
    loading,
    error,
    shared,
    setShared,
    setLoading,
  };
};

export default useComments;

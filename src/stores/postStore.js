import { defineStore } from "pinia";
// import { ref } from "vue";
import { api } from "boot/axios";

export const usePostStore = defineStore("post", () => {

  const getPostList = async ({ all = true, page = 1, limit = 10, sortBy = "createdAt", order = "desc", search = "" }) => {
    try {
      // Construct the query string with the provided parameters
      const queryParams = new URLSearchParams({
        all: all.toString(),
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        order,
        search,
      });

      // Make a GET request with the constructed query string
      const response = await api.get(`/admin/post?${queryParams.toString()}`);

      return response?.data?.data?.posts || [];
    } catch (error) {
      console.error(error);
      return []
    }
  };

  const deletePost = async (postId) => {
    try {
      const response = await api.delete(`/admin/post/${postId}`);
      return response.data; // Return response if needed
    } catch (error) {
      console.error("Error deleting the post:", error.response?.data || error.message);
      throw error;
    }
  };

  const getPostDetails = async (postId) => {
    try {
      const response = await api.get(`admin/post/${postId}`);
      return response?.data?.data; // Return response if needed
    } catch (error) {
      console.error("Error deleting the post:", error.response?.data || error.message);
      throw error;
    }
  };

  const getCommentsList = async (postId) => {
    try {
      // Make a GET request with the constructed query string
      const response = await api.get(`/admin/comment/${postId}`, {
        headers: {
          "Content-Type": "application/json"
        },
      });
      return response?.data?.data || [];
    } catch (error) {
      console.error(error);
      return []
    }
  };

  const deleteComment = async (commentId) => {
    try {
      const response = await api.delete(`/admin/comment/${commentId}`);
      return response.data; // Return response if needed
    } catch (error) {
      console.error("Error deleting the comment:", error.response?.data || error.message);
      throw error;
    }
  };

  return {
    getPostList,
    deletePost,
    getPostDetails,
    getCommentsList,
    deleteComment
  };
});

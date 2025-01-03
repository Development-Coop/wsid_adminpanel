import { defineStore } from "pinia";
// import { ref } from "vue";
import { api } from "boot/axios";

export const useUserStore = defineStore("user", () => {

  const getUserList = async ({ all = true, page = 1, limit = 10, sortBy = "createdAt", order = "desc", uid = "", search = "" }) => {
    try {
      // Construct the query string with the provided parameters
      const queryParams = new URLSearchParams({
        all: all.toString(),
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        order,
        uid,
        search
      });

      // Make a GET request with the constructed query string
      const response = await api.get(`admin/user/list?${queryParams.toString()}`);

      return response?.data?.data || [];
    } catch (error) {
      console.error(error);
      return []
    }
  };

  const deleteUser = async (userId) => {
    try {
      const response = await api.delete(`admin/user/delete?uid=${userId}`);
      return response.data; // Return response if needed
    } catch (error) {
      console.error("Error deleting the post:", error.response?.data || error.message);
      throw error;
    }
  };

  const getUserDetails = async (userId) => {
    try {
      const response = await api.get(`admin/user/view?uid=${userId}`);
      return response?.data?.data; // Return response if needed
    } catch (error) {
      console.error("Error deleting the post:", error.response?.data || error.message);
      throw error;
    }
  };

  const searchProfile = async (text) => {
    try {
      // Make a GET request with the constructed query string
      const response = await api.get(`admin/user/search?query=${text}`, {
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

  return {
    getUserList,
    deleteUser,
    getUserDetails,
    searchProfile
  };
});

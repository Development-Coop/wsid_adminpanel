import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { api } from "boot/axios";

export const useAuthStore = defineStore("auth", () => {

  const login = async (data) => {
    try {
      const response = await api.post(
        "/admin/login",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      sessionStorage.setItem("refresh-token", response?.data?.data?.refreshToken);
      sessionStorage.setItem("access-token", response?.data?.data?.accessToken);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return {
    login
  };
});

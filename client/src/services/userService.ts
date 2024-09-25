import axios from "axios";
import instance from "./config";

interface User {
  email: string;
  password: string;
}

export const actions = {
  //REGISTER
  async register(user: User) {
    try {
      const response = await instance.post("/register", JSON.stringify(user));
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log("erreur lors de l'inscription:", err.response?.data);
        return err.response?.data;
      } else {
        console.log("erreur lors de l'inscription:", err);
        return err;
      }
    }
  },

  //LOGIN
  async login(user: User) {
    try {
      const response = await instance.post("/login", JSON.stringify(user));
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log("erreur lors de la connection:", err.response?.data);
        return err.response?.data;
      } else {
        console.log("erreur lors de la connection:", err);
        return err;
      }
    }
  },
};

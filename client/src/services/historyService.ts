import { isAxiosError } from "axios";
import instance from "./config";

export const actions = {
  //GET ALL
  async getAll(page: number, filter: string) {
    try {
      const response = await instance.get(
        `/history?page=${page}&filter=${filter}`
      );
      return response.data;
    } catch (err) {
      console.log("erreur lors de la requête d'histories:", err);
      return err;
    }
  },

  async getOverview() {
    try {
      const response = await instance.get("/history/overview");
      return response.data;
    } catch (err) {
      console.log("erreur lors de la requête d'overview:", err);
      if (isAxiosError(err)) {
        const error = {
          success: false,
          message: err?.message,
        };
        return error;
      } else {
        return err;
      }
    }
  },
};

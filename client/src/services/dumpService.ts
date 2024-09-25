import { isAxiosError } from "axios";
import instance from "./config";

interface Task {
  Name: string;
  Cron_job: string;
  Connection_id: number;
}

export const actions = {
  //ADD Cron task
  async createTask(task: Task) {
    try {
      const response = await instance.post("/dump/task", JSON.stringify(task));
      return response.data;
    } catch (err) {
      console.log("erreur lors de la création de la tâche:", err);
      return err;
    }
  },

  //Toggle a task
  async toggleTask(id: number, value: boolean) {
    try {
      const response = await instance.patch(`/dump/task/${id}`, {
        Active: value,
      });
      return response.data;
    } catch (err) {
      console.log("erreur lors du toggle de la task:", err);
      return err;
    }
  },

  //Get all Tasks from the user
  async getAll() {
    try {
      const response = await instance.get("/dump");
      return response.data;
    } catch (err) {
      console.log("erreur lors de la récupération des tâches:", err);
      if (isAxiosError(err)) {
        console.log("MOOK");
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

  //Run a dump
  async dump(id: number) {
    try {
      const response = await instance.get(`/dump/run/${id}`);
      return response.data;
    } catch (err) {
      console.log("erreur lors du dump de la base:", err);
      return err;
    }
  },

  async restore(dumpId: number, connectionId: number) {
    try {
      const response = await instance.post("/restore", {
        ConnectionId: connectionId,
        HistoryId: dumpId
      });
      return response.data;
    } catch (err) {
      console.log("erreur lors de la restauration de la base:", err);
      return err;
    }
  },

  //Delete a task
  async deleteTask(id: number) {
    try {
      const response = await instance.delete(`/dump/${id}`);
      return response.data;
    } catch (err) {
      console.log("erreur lors de la suppression de la tâche:", err);
      return err;
    }
  },
};

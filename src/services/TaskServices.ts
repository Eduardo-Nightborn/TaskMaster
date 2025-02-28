import axios, { AxiosError } from "axios";
import { Task } from "@/types/task";

const APIPort = 3000;
const url = `http://localhost:${APIPort}/task`;

export const fetchTasksService = (): Promise<Task[]> => {
  return axios
    .get(url)
    .then((response) => {
      if (response.headers["content-type"].includes("application/json")) {
        return response.data;
      } else {
        throw new Error("Expected JSON response, but received something else");
      }
    })
    .catch((error: AxiosError) => {
      console.error("Error fetching tasks:", error);
      throw error;
    });
};

  
  export const addTaskService = (task: Task): Promise<Task> => {
    return axios
      .post(url, task)  
      .then((response) => {
        if (response.headers["content-type"].includes("application/json")) {
          return response.data;  
        } else {
          throw new Error("Expected JSON response, but received something else");
        }
      })
      .catch((error: AxiosError) => {
        console.error("Error adding task:", error);
        throw error;
      });
  };

  export const updateTaskService = (id :string , task: Task): Promise<Task> => {
    return axios
      .put( `${url}/${id}`, JSON.stringify(task))  
      .then((response) => {
        if (response.headers["content-type"].includes("application/json")) {
          return response.data;  
        } else {
          throw new Error("Expected JSON response, but received something else");
        }
      })
      .catch((error: AxiosError) => {
        console.error("Error adding task:", error);
        throw error;
      });
  };
  export const deleteTaskService = (id :string): Promise<Task> => {
    return axios
      .delete( `${url}/${id}`)  
      .then((response) => {
        if (response.headers["content-type"].includes("application/json")) {
          return response.data;  
        } else {
          throw new Error("Expected JSON response, but received something else");
        }
      })
      .catch((error: AxiosError) => {
        console.error("Error adding task:", error);
        throw error;
      });
  };
import { createSubTaskType, createTaskType, updateSubTaskType, updateTaskType } from "../types/task.type";
import axiosClient from "./axiosClient";


const reminderApi = {
    createTask: async ({
      title, color, deadline, note, area
    }: createTaskType) => {
      const url = `/reminder/create`;

      const data = { title, color, deadline, note }
      return axiosClient.post(url, {
        area, ...data
      });
    },
  
    getTasks: async () => {
      const url = `/reminder/get`;
      return axiosClient.get(url);
    },
  
    getTaskById: async (id:string) => {
      const url = `/reminder/get/${id}`;
      return axiosClient.get(url);
    },
  
    updateTask: async (id:string, params = {}) => {
      const url = `/reminder/update/${id}`;
      const { title, color, deadline, note, area = [], status }:updateTaskType = params;
    
      const data = { title, color, deadline, note, status };
    
      // Filter out undefined values from data
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== undefined)
      );
    
      return axiosClient.patch(url, {
        area: [...area],
        ...filteredData
      });
    },

    check: async (id:string) => {
      const url = `/reminder/check/${id}`;
      return axiosClient.patch(url);
    },
  
    deleteTask: async (id:string) => {
      const url = `/reminder/delete/${id}`;
      return axiosClient.delete(url);
    },
  
    addSubTask: async (id:string, subTaskData:createSubTaskType) => {
      const url = `/reminder/update/${id}/sub`;
      return axiosClient.post(url, subTaskData);
    },
  
    updateSubTask: async (subId:string, subTaskData:updateSubTaskType) => {
      const url = `/reminder/update/sub/${subId}`;
      return axiosClient.patch(url, subTaskData);
    },
  
    deleteSubTask: async (subId:string) => {
      const url = `/reminder/delete/sub/${subId}`;
      return axiosClient.delete(url);
    },
  };
  
export default reminderApi;
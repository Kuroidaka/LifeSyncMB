import { createRoutineType } from "../types/routine.type";
import axiosClient from "./axiosClient";

// Define interfaces for the expected data types
interface RoutineParams {
  title?: string;
  color?: string;
  note?: string;
  area?: string[];
  routineTime?: string;
  isActive?: boolean;
  routineDate?: string[];
}



const routineApi = {
  createRoutine: async ({
    title, color, note, area, routineTime
  }: createRoutineType): Promise<any> => {
    const url = `/routine/create`;

    const data = { title, color, note, routineTime };
    return axiosClient.post(url, {
      area, ...data
    });
  },

  getRoutines: async (): Promise<any> => {
    const url = `/routine/get`;
    return axiosClient.get(url);
  },

  updateRoutine: async (id: string, params: RoutineParams = {}): Promise<any> => {
    const url = `/routine/update/${id}`;
    const { title, color, note, area, isActive, routineDate, routineTime } = params;

    const data = { title, color, note, isActive, routineTime };

    // Filter out undefined values from data
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined)
    );

    const dataBody: any = {
      dates: routineDate,
      ...filteredData,
    };

    if (area) {
      dataBody.area = [...area];
    }

    return axiosClient.patch(url, dataBody);
  },

  updateRoutineDates: async (id: string, routineDate: { completion_date: Date }[] = []): Promise<any> => {
    const url = `/routine/update/${id}/dates`;

    const dataBody = {
      dates: routineDate,
    };

    return axiosClient.patch(url, dataBody);
  },

  deleteRoutine: async (id: string): Promise<any> => {
    const url = `/routine/delete/${id}`;
    return axiosClient.delete(url);
  },
};

export default routineApi;

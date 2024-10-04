export type AxiosResponse<T = any> = {
    data: T;
    status: number;
    statusText: string;
    headers: any;
    config: any;
    request?: any;
  };


  export interface PlannerData {
    [key: string]: {
      name: string;
      value: string;
      dateZone: { name: string; value: string; }[];
      empty: { img: string; text1: string; text2: string; text3: string; };
    };
  }
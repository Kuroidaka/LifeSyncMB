export type Task = {
  id: string;
  title: string;
  deadline?: Date | string;
  status: boolean;
  [key: string]: any;
};

export type SubTaskType = {
  id: string;
  title: string;
  [key: string]: any;
};

export type createTaskType = {
  title: string;
  color: string;
  deadline: string | Date;
  note: string;
  area: string[];
};

export type updateTaskType = {
  title?: string;
  color?: string;
  deadline?: string;
  note?: string;
  area?: string[];
  status?: string;
};

export type createSubTaskType = {
  title: string;
  status: string;
};

export type updateSubTaskType = {
  title?: string;
  status?: string;
};


export interface PlannerData {
  [key: string]: {
    name: string;
    value: string;
    dateZone: { name: string; value: string; }[];
    empty: { img: string; text1: string; text2: string; text3: string; };
  };
}


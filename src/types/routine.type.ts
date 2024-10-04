export type Routine = {
  id: string;
  title: string;
  isActive: boolean;
  routineTime: string; // hh:MM (eg:17:00)
  [key: string]: any;
};

export type createRoutineType = {
  title: string;
  color?: string | null;
  note?: string | null;
  userId: string;
  routineTime: string; // hh:MM (eg:17:00)
  isActive?: boolean;
  area: string[];
};

export type updateRoutineType = {
  title?: string;
  color?: string;
  note?: string;
  routineTime?: string; // hh:MM (eg:17:00)
  isActive?: boolean;
  area?: string[];
};



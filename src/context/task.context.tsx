import React, { createContext, useCallback, useEffect, useState, ReactNode } from 'react';
import reminderApi from '../api/reminder.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isObject } from '../utils';
import { createTaskType, Task, updateTaskType } from '../types/task.type';


export interface TaskContextProps {
  task: Task[];
  setTask: React.Dispatch<React.SetStateAction<Task[]>>;
  handleAddTask: (data: createTaskType) => void;
  handleDeleteTask: (id: string) => void;
  handleUpdateTask: (taskId: string, data?: updateTaskType) => void;
  handleCheckTask: (taskId: string) => void;
  loading: boolean;
}

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskContext = createContext<TaskContextProps | undefined>(undefined);

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [task, setTask] = useState<Task[]>([]);
  const queryClient = useQueryClient();

  const { data: taskData, isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => reminderApi.getTasks(),
  });

  const addMutation = useMutation({
    mutationFn: async ({ data }: { data: createTaskType }) => await reminderApi.createTask(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
    onError: (error: any) => {
      console.error('Something went wrong', error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ id }: { id: string }) => await reminderApi.deleteTask(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
    onError: (error: any) => {
      console.error('Something went wrong', error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ taskId, data }: { taskId: string; data: updateTaskType }) => {
      await reminderApi.updateTask(taskId, data);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
    onError: (error: any) => {
      console.error('Something went wrong', error);
    },
  });

  const checkMutation = useMutation({
    mutationFn: async ({ taskId }: { taskId: string }) => {
      await reminderApi.check(taskId);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
    onError: (error: any) => {
      console.error('Something went wrong', error);
    },
  });

  const handleDeleteTask = useCallback(async (id: string) => {
    try {
      deleteMutation.mutate({ id });
    } catch (error: any) {
      console.error('Something went wrong', error);
    }
  }, [deleteMutation]);

  const handleAddTask = useCallback(
    (data: createTaskType) => {
      if (typeof data.deadline === 'undefined') {
        const today = new Date();
        today.setHours(23, 59, 59, 0);
        data.deadline = today;
      }

      addMutation.mutate({ data });
    },
    [addMutation]
  );

  const handleUpdateTask = useCallback(
    (taskId: string, data: updateTaskType = {}) => {
      if (Array.isArray(data.area) && isObject(data.area[0])) {
        data.area = data.area.map((item: any) => item.area);
      }

      updateMutation.mutate({ taskId, data });
    },
    [updateMutation]
  );

  const handleCheckTask = useCallback(
    (taskId: string) => {
      checkMutation.mutate({ taskId });
    },
    [checkMutation]
  );

  useEffect(() => {
    if (taskData && taskData.data) {
      setTask(taskData.data);
    }
  }, [taskData]);

  const valueContext: TaskContextProps = {
    task,
    setTask,
    handleAddTask,
    handleDeleteTask,
    handleUpdateTask,
    handleCheckTask,
    loading: isLoading,
  };
  
  return <TaskContext.Provider value={valueContext}>{children}</TaskContext.Provider>;
};

export default TaskContext;

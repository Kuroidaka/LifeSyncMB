import React, { createContext, useCallback, useEffect, useState, ReactNode, useContext } from 'react';
import routineApi from '../api/routine.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isObject } from '../utils';
import { AxiosResponse } from '../types/index.type';
import { Routine, createRoutineType, updateRoutineType } from '../types/routine.type';
import Toast from 'react-native-toast-message';

export interface RoutineContextProps {
  routine: Routine[];
  setRoutine: React.Dispatch<React.SetStateAction<Routine[]>>;
  handleAddRoutine: (data: createRoutineType) => Promise<void>;
  handleDeleteRoutine: (id: string) => Promise<void>;
  handleUpdateRoutine: (routineId: string, data?: updateRoutineType) => Promise<void>;
  handleUpdateRoutineDates: (routineId: string, routineDate: { completion_date: Date }[]) => Promise<void>;
  loading: boolean;
}

interface RoutineProviderProps {
  children: ReactNode;
}

export const RoutineContext = createContext<RoutineContextProps | undefined>(undefined);

export const RoutineProvider: React.FC<RoutineProviderProps> = ({ children }) => {
  const [routine, setRoutine] = useState<Routine[]>([]);
  const queryClient = useQueryClient();

  const { data: routineData, isLoading } = useQuery({
    queryKey: ['routines'],
    queryFn: () => routineApi.getRoutines()
  });

  const addMutation = useMutation({
    mutationFn: async ({ data }: { data: createRoutineType }) => await routineApi.createRoutine(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['routines'] }),
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
      });
      console.log(error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ routineId, data }: { routineId: string; data: updateRoutineType }) => await routineApi.updateRoutine(routineId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['routines'] }),
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
      });
      console.log(error);
    },
  });

  const updateDatesMutation = useMutation({
    mutationFn: async ({ routineId, routineDate }: { routineId: string; routineDate: { completion_date: Date }[] }) => await routineApi.updateRoutineDates(routineId, routineDate),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['routines'] }),
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
      });
      console.log(error);
    },
  });

  const handleAddRoutine = useCallback(
    async (data: createRoutineType) => {
      try{
        const res = await addMutation.mutateAsync({ data });
        return res;
      }catch(error){
        Toast.show({
          type: 'error',
          text1: 'Something went wrong',
        });
        console.log(error);
      }
    },
    [addMutation]
  );

  const handleUpdateRoutine = async (routineId: string, data: updateRoutineType = {}) => {
    try{
      const res = await updateMutation.mutateAsync({ routineId, data });
      return res;
    }catch(error){
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
      });
      console.log(error);
    }
  };

  const handleUpdateRoutineDates = async (routineId: string, routineDate: { completion_date: Date }[]) => {
    updateDatesMutation.mutate({ routineId, routineDate });
  };

  const handleDeleteRoutine = async (id: string) => {
    try {
      await routineApi.deleteRoutine(id);
      queryClient.invalidateQueries({ queryKey: ['routines'] });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
      });
      console.log(error);
    }
  };

  useEffect(() => {
    if (routineData && routineData.data) {
      setRoutine(routineData.data);
    }
  }, [routineData]);

  const valueContext: RoutineContextProps = {
    routine,
    setRoutine,
    handleAddRoutine,
    handleDeleteRoutine,
    handleUpdateRoutine,
    handleUpdateRoutineDates,
    loading: isLoading,
  };

  return <RoutineContext.Provider value={valueContext}>{children}</RoutineContext.Provider>;
};

export default RoutineContext;

import React, { useState, useEffect, useContext, useMemo, useRef, Fragment } from 'react';
import { View, Text, StyleSheet, Animated, ScrollView } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
// import { TaskContext, ModalContext } from './context'; // Assuming you have context files for Task and Modal
import language from "../../../language.json"
import { convertDates, isSameDate } from '../../../utils';
import plannerData from '../Planner.json';
import { Task } from '../../../types/task.type';
import { LanguageDateType } from '../../../types/language.type';
import Card from './RoutineCard';
import { Routine } from '../../../types/routine.type';
// import { toast } from 'react-native-toast-message';

interface RoutineCardListProps {
    dataSection: Routine[];
    dateZone: string; //current date zone 
    setDateZone: (zone: string) => void;
    setDateSection: React.Dispatch<React.SetStateAction<Routine[]>>;
}

interface DateType {
    mustdo: Routine[];
    doNotNeed: Routine[];
    all: Routine[];
}

const RoutineCardList: React.FC<RoutineCardListProps> = ({ dataSection, setDateSection, dateZone, setDateZone }) => {
    const [dateType, setDateType] = useState<DateType>({
        mustdo: [],
        doNotNeed: [],
        all: [],
      });
    
      useEffect(() => {
        const setupDate = () => {
          const filterRoutineDo = (routine: Routine[]) => {
            return routine.filter((data) => data.isActive === true);
          };
    
          const filterRoutineDontNeed = (routine: Routine[]) => {
            return routine.filter((data) => data.isActive === false);
          };
    
          const mustDo = filterRoutineDo(dataSection);
          const doNotNeed = filterRoutineDontNeed(dataSection);
    
          setDateType({
            mustdo: mustDo,
            doNotNeed: doNotNeed,
            all: dataSection,
          });
        };
    
        setupDate();
      }, [dataSection]);
    
      const TodayDZ: React.FC = () => (
        <Fragment>
          {dateType.mustdo.length > 0 && (
            <Fragment>
              <DateZoneLabel title="Phải Làm" num={dateType.mustdo.length} />
              <View style={styles.routineCardList}>
                {dateType.mustdo.map((data: Routine) => (
                  <Card 
                    key={data.id}
                    data={data}
                    dataSection={dataSection}
                    setDateSection={setDateSection}
                    isCompleted={data.routineDate.some(({ completion_date }: { completion_date: string }) => isSameDate(new Date(completion_date), new Date()))}
                    />
                ))}
              </View>
            </Fragment>
          )}
        </Fragment>
      );
    
      const AllDZ: React.FC = () => (
        <Fragment>
          {TodayDZ()}
          <DateZoneLabel title="Không cần phải làm" num={dateType?.doNotNeed?.length ?? 0}/>
          <View style={styles.routineCardList}>
            {dateType.doNotNeed.map((data) => (
              <Card 
                key={data.id} 
                data={data} 
                dataSection={dataSection}
                setDateSection={setDateSection}
                isCompleted={data.routineDate.some(({ completion_date }: { completion_date: string }) => isSameDate(new Date(completion_date), new Date()))}
              />
            ))}
          </View>
        </Fragment>
      );
    

    return (
        <View style={styles.container}>
            {dateZone === 'today' ? <TodayDZ /> : <AllDZ />}
        </View>
    );
};

// DateZoneLabel Component for React Native
const DateZoneLabel = ({ title, num }: { title: string; num: number }) => (
    <View style={styles.dateZoneLabel}>
        <Text style={styles.labelText}>
            {title} ({num})
        </Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        flexDirection: 'column',
        alignItems: 'center',
    },
    dateZoneLabel: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    labelText: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    cardContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    routineCardList: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
    },
});

export default RoutineCardList;

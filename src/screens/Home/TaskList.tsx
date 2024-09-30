import React, { useState, useEffect, useContext, useMemo, useRef, Fragment } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
// import { TaskContext, ModalContext } from './context'; // Assuming you have context files for Task and Modal
import language from "../../language.json"
import { convertDates } from '../../utils';
import plannerData from './Planner.json';
import { Task } from '../../types/task.type';
import { LanguageDateType } from '../../types/language.type';
import { Card } from './TaskCard';
// import { toast } from 'react-native-toast-message';

interface TaskCardListProps {
    dataSection: Task[];
    dateZone: string; //current date zone 
    setDateZone: (zone: string) => void;
}

interface DateType {
    overdue: Task[];
    today: Task[];
    tomorrow: Task[];
    someDay: Task[];
    datesAfterTomorrow: Task[][];
}

const TaskCardList: React.FC<TaskCardListProps> = ({ dataSection, dateZone, setDateZone }) => {
    const [dateType, setDateType] = useState<DateType>({
        overdue: [],
        today: [],
        tomorrow: [],
        someDay: [],
        datesAfterTomorrow: [],
    });
    const [dAfterTArr, setDAfterTArr] = useState<LanguageDateType[]>([]);

    useEffect(() => {
        const options: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            timeZoneName: 'short'
        };

        const filterTasksByDeadline = (tasks: Task[], deadline: Date) => {
            const deadlineDate = new Date(deadline);
            return tasks.filter((task: Task) => {
                if(task.deadline){
                    const taskDeadline = new Date(task.deadline);
                    return taskDeadline.toLocaleString('en-US', options) === deadlineDate.toLocaleString('en-US', options);
                }
                return false;
            });
        };

        const setupDate = () => {
            const today = new Date();
            const overDueTasks = dataSection.filter((task: Task) => {
                if (task.deadline) {
                    const deadline = new Date(task.deadline);
                    return convertDates([deadline])[0] < convertDates([today])[0];
                }
            });

            const todayTasks = filterTasksByDeadline(dataSection, today);

            let tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const tomorrowTasks = filterTasksByDeadline(dataSection, tomorrow);

            const newDateArr: LanguageDateType[] = [];
            const dATTasksArr: any[] = [];
            let dateAfterTomorrow = new Date();
            dateAfterTomorrow.setDate(dateAfterTomorrow.getDate() + 2);

            for (let i = 0; i < 5; i++) {
                let dateAfter = new Date();
                dateAfter.setDate(dateAfter.getDate() + 2 + i);
                // Add mock data for language.date since it's not available in RN
                // newDateArr.push(dateAfter.toLocaleString('en-US', options));
                
                const item = language.date.find((item: LanguageDateType) => item.name === dateAfter.toLocaleString('en-US', options).split(",")[0])
                if(item){
                    newDateArr.push(item);
                }
                setDAfterTArr(newDateArr);
                const dATTasks = filterTasksByDeadline(dataSection, dateAfter);
                dATTasksArr.push(dATTasks);
                
            }

            const someDayTasks = dataSection.filter((task) => task.deadline === null);

            setDateType({
                overdue: overDueTasks,
                today: todayTasks,
                tomorrow: tomorrowTasks,
                datesAfterTomorrow: dATTasksArr,
                someDay: someDayTasks,
            });

            if (overDueTasks.length + todayTasks.length === 0 && tomorrowTasks.length + dATTasksArr.length > 0) {
                setDateZone('week');
            } else if (tomorrowTasks.length + dATTasksArr.length === 0 && someDayTasks.length > 0) {
                setDateZone('all');
            }
        };

        setupDate();
    }, [dataSection]);

    const TodayDZ = () => (
        <Fragment>
            {dateType.overdue.length > 0 && (
                <Fragment>
                    <DateZoneLabel title="Quá hạn" num={dateType.overdue.length} />
                    <View style={styles.taskCardList}>
                        {dateType.overdue.map((data: Task, idx: any) => (
                            <Card key={idx} data={data} />
                        ))}
                    </View>
                </Fragment>
            )}
            <DateZoneLabel title="Hôm nay" num={dateType.today.length} />
            <View style={styles.taskCardList}>
                {dateType.today.map((data: Task, idx: any) => (
                    <Card key={idx} data={data}   />
                ))}
            </View>
        </Fragment>
    );


    const WeekDZ: React.FC = () => (
        <Fragment>
            <TodayDZ />
            {/* TOMORROW */}
            <DateZoneLabel title="Ngày mai" num={dateType.tomorrow.length} />
            {dateType.tomorrow &&
                dateType.tomorrow.map((data: any, idx: any) => (
                    <Card key={idx} data={data}   />
                ))}

            {/* DATES AFTER TOMORROW */}
            {dateType.datesAfterTomorrow &&
                dateType.datesAfterTomorrow.map((date: any, idx: any) => (
                    <Fragment key={idx}>
                        <DateZoneLabel title={dAfterTArr[idx]?.value?.vn} num={date.length} />
                        {date.map((data: any, subIdx: any) => (
                            <Card key={subIdx} data={data}   />
                        ))}
                    </Fragment>
                ))}
        </Fragment>
    );

    const AllDZ: React.FC = () => (
        <Fragment>
            <TodayDZ />

            {/* TOMORROW */}
            <DateZoneLabel title="Ngày mai" num={dateType.tomorrow.length} />
            {dateType.tomorrow &&
                dateType.tomorrow.map((data: any, idx: any) => (
                    <Card key={idx} data={data} />
                ))}

            {/* DATE AFTER TOMORROW */}
            {dateType.datesAfterTomorrow &&
                dateType.datesAfterTomorrow.map((date: any, idx: any) => {
                    return (
                        <Fragment key={idx}>
                            <DateZoneLabel title={dAfterTArr[idx]?.value?.vn} num={date.length} />
                            {date.map((data: any, subIdx: any) => (
                                <Card key={subIdx} data={data} />
                            ))}
                        </Fragment>
                    )
                })}

        </Fragment>
    );

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {dateZone === 'today' ? (
                <TodayDZ />
            ) : dateZone === 'week' ? (
                <WeekDZ />
            ) : dateZone === 'all' && <AllDZ />}
        </ScrollView>
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
    taskCardList: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
    },
});

export default TaskCardList;

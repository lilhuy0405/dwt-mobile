import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {getDaysInMonth} from '../../utils';
import PropTypes, {InferProps} from 'prop-types';
import {useQuery} from '@tanstack/react-query';
import {dwtApi} from '../../api/service/dwtApi.ts';
import dayjs from 'dayjs';

export default function DailyMeetingCalendar(
    {
        currentDate,
        setCurrentDate
    }: InferProps<typeof DailyMeetingCalendar.propTypes>) {
    // const haveLog = (item: any) => {
    //     if (listUserReports) {
    //         return !!listUserReports.find(
    //             (report: any) =>
    //                 report?.date_report ===
    //                 `${currentDate.year}-${currentDate.month + 1}-${item.date}`,
    //         );
    //     }
    //     if (listProjectLogs) {
    //         return !!listProjectLogs.find(
    //             (log: any) =>
    //                 log?.logDate ===
    //                 `${currentDate.year}-${currentDate.month + 1}-${item.date}`,
    //         );
    //     }
    //     return false;
    // };

    const today = dayjs().date();
    const initialScrollOffset = (today > 7) ? (today) * 45 : 0;

    return (
        <View>
            <FlatList
                contentContainerStyle={{
                    paddingBottom: 10,
                }}
                style={{
                    borderBottomColor: '#D0D0D0',
                    borderBottomWidth: 1,
                }}
                contentOffset={{
                    x: initialScrollOffset,
                    y: 0,
                }}
                showsHorizontalScrollIndicator={false}
                data={getDaysInMonth(currentDate.month, currentDate.year)}
                horizontal={true}
                ItemSeparatorComponent={() => <View style={{width: 10}}/>}
                renderItem={({item}) => {
                    return (
                        <TouchableOpacity
                            onPress={() => {
                                setCurrentDate({
                                    ...currentDate,
                                    date: item.date,
                                });
                            }}
                            style={
                                currentDate.date === item.date
                                    ? styles.selectedItem
                                    : styles.item
                            }>
                            <Text style={styles.day}>
                                {item.day !== 0 ? 'Thứ ' + (item.day + 1) : 'CN'}
                            </Text>
                            <Text style={styles.date}>{item.date}</Text>
                            {
                                // Show mark if current date has report
                                <View style={styles.marked}/>
                            }
                        </TouchableOpacity>
                    );
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    item: {
        width: 45,
        height: 70,
        paddingTop: 3,
        alignItems: 'center',
    },
    selectedItem: {
        width: 45,
        height: 70,
        borderRadius: 16,
        borderColor: '#D20019',
        paddingTop: 3,
        borderWidth: 1,
        alignItems: 'center',
    },
    day: {
        fontSize: 12,
        fontWeight: '500',
        color: '#3C3C434D',
        marginBottom: 5,
    },
    date: {
        fontSize: 18,
        fontWeight: '400',
        marginBottom: 4,
        color: '#111',
    },
    selectedDate: {
        fontSize: 18,
        fontWeight: '500',
        marginBottom: 4,
    },
    marked: {
        backgroundColor: '#D20019',
        borderRadius: 999,
        width: 8,
        height: 8,
    },
});

DailyMeetingCalendar.propTypes = {
    currentDate: PropTypes.shape({
        month: PropTypes.number.isRequired,
        year: PropTypes.number.isRequired,
        date: PropTypes.number.isRequired,
    }).isRequired,
    setCurrentDate: PropTypes.func.isRequired,
};
import {FlatList, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {getDaysInMonth} from '../../utils';
import PropTypes, {InferProps} from 'prop-types';
import {useEffect, useMemo} from "react";
import dayjs from "dayjs";
import {useConnection} from "../../redux/connection";

export default function DailyCalendar({
  currentDate,
  setCurrentDate,
  listUserReports,
  listProjectLogs,
}: InferProps<typeof DailyCalendar.propTypes>) {

  const {connection: {userInfo}} = useConnection();
  const haveLog = (item: any) => {
    if (listUserReports) {
      return !!listUserReports.find(
        (report: any) =>
          report?.date_report ===
          dayjs().year(currentDate.year).month(currentDate.month).date(item.date).format('YYYY-MM-DD')
      );
    }
    if (listProjectLogs) {
      return !!listProjectLogs.find(
        (log: any) =>
          log?.logDate ===
            dayjs().year(currentDate.year).month(currentDate.month).date(item.date).format('YYYY-MM-DD')
      );
    }
    return false;
  };

  const initialScrollOffset = useMemo(() => {
    const today = dayjs().date();
    return today > 5 ? today * 45 : 0;
  }, [dayjs().date(), userInfo]);

  return (
    <View
      style={{
        paddingHorizontal: 15,
      }}
    >
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
        ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
        renderItem={({ item }) => {
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
              }
            >
              <Text style={styles.day}>
                {item.day !== 0 ? 'Thứ ' + (item.day + 1) : 'CN'}
              </Text>
              <Text style={styles.date}>{item.date}</Text>
              {
                // Show mark if current date has report
                haveLog(item) && <View style={styles.marked} />
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

DailyCalendar.propTypes = {
  currentDate: PropTypes.shape({
    month: PropTypes.number.isRequired,
    year: PropTypes.number.isRequired,
    date: PropTypes.number.isRequired,
  }).isRequired,
  setCurrentDate: PropTypes.func.isRequired,
  listUserReports: PropTypes.array,
  listProjectLogs: PropTypes.array,
};

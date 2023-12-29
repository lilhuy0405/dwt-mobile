import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../components/header/Header.tsx';
import {useConnection} from '../../redux/connection';
import dayjs from 'dayjs';
import {useState} from 'react';
import {fs_14_400, text_black} from '../../assets/style.ts';
import DropdownIcon from '../../assets/img/dropdown-icon.svg';
import DatePickerFromToModal from '../../components/common/modal/DatePickerFromToModal.tsx';
import PrimaryTable from '../../components/common/table/PrimaryTable.tsx';
import {useQuery} from '@tanstack/react-query';
import {dwtApi} from '../../api/service/dwtApi.ts';

export default function AttendanceSummary({navigation}: any) {
  const {
    connection: {userInfo},
  } = useConnection();
  const [fromDate, setFromDate] = useState(dayjs());
  const [toDate, setToDate] = useState(dayjs());
  const [isSelectDate, setIsSelectDate] = useState(false);

  const {data: listAttendanceSummary = []} = useQuery(
    ['listAttendanceSummary', fromDate, toDate],
    async () => {
      const res = await dwtApi.getAttendanceSummaryDepartment({
        datetimeFilter:
          fromDate.format('DD/MM/YYYY') + ' - ' + toDate.format('DD/MM/YYYY'),
        department: userInfo.departement_id,
      });
      return res.data.data;
    },
    {
      enabled: !!userInfo,
    },
  );

  const columns = [
    {
      key: 'name',
      title: 'Tên',
      width: 0.3,
    },
    {
      key: 'date',
      title: 'Thời gian',
      width: 0.25,
    },
    {
      key: 'totalSuccess',
      title: 'Đã điểm danh',
      width: 0.25,
    },
    {
      key: 'totalFail',
      title: 'Đi trễ',
      width: 0.2,
    },
  ];
  return (
    userInfo && (
      <SafeAreaView style={styles.wrapper}>
        <Header
          title={'TỔNG QUAN CHẤM CÔNG'}
          handleGoBack={() => navigation.goBack()}
        />
        <View style={styles.content}>
          <TouchableOpacity
            style={styles.dateSelectBox}
            onPress={() => {
              setIsSelectDate(true);
            }}>
            <Text style={[fs_14_400, text_black]}>
              {fromDate.format('DD/MM/YYYY')} - {toDate.format('DD/MM/YYYY')}
            </Text>
            <DropdownIcon />
          </TouchableOpacity>
          <PrimaryTable
            data={listAttendanceSummary.map((item: any) => {
              return {
                ...item,
                onRowPress: (item: any) => {
                  console.log(item);
                  navigation.navigate('AttendanceHistory', {
                    departmentId: item.id,
                  });
                },
              };
            })}
            columns={columns}
            headerColor={'#DCE1E7'}
          />
        </View>
        {isSelectDate && (
          <DatePickerFromToModal
            fromDate={fromDate}
            toDate={toDate}
            setVisible={setIsSelectDate}
            setFromDate={setFromDate}
            setToDate={setToDate}
          />
        )}
      </SafeAreaView>
    )
  );
}
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    paddingHorizontal: 15,
  },
  dateSelectBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 5,
    borderColor: 'rgba(0, 0, 0, 0.25)',
    borderWidth: 1,
    width: 220,
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
});
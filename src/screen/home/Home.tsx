import {StyleSheet, Dimensions} from 'react-native';
import HomeHeader from '../../components/home/HomeHeader.tsx';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useQuery} from '@tanstack/react-query';
import {useConnection} from '../../redux/connection';
import {dwtApi} from '../../api/service/dwtApi.ts';
import PrimaryLoading from '../../components/common/loading/PrimaryLoading.tsx';
import dayjs from 'dayjs';
import {useRefreshOnFocus} from '../../hook/useRefeshOnFocus.ts';
import TabBlock from '../../components/home/TabBlock.tsx';
import {useState} from 'react';
import HomeTabContainer from '../../components/home/tab-container/HomeTabContainer.tsx';
import ManagerTabContainer from '../../components/home/tab-container/ManagerTabContainer.tsx';

export default function Home({navigation}: any) {
  const {
    connection: {userInfo},
  } = useConnection();
  const [currentTab, setCurrentTab] = useState(0);

  const {
    data: {checkInTime, checkOutTime} = {},
    isLoading: isLoadingAttendanceDay,
    refetch: refetchAttendanceDay,
  } = useQuery(['getAttendanceByDate'], async () => {
    const currentDate = new Date();
    const dateDay = dayjs(currentDate).format('YYYY-MM-DD');
    try {
      const res = await dwtApi.getAttendanceByDate(userInfo.id, dateDay);
      if (res.status === 200) {
        return {
          checkInTime: res.data.checkIn,
          checkOutTime: res.data.checkOut,
        };
      }
    } catch {
      return {
        checkInTime: null,
        checkOutTime: null,
      };
    }
  });

  const {
    data: attendanceData,
    isLoading: isLoadingAttendance,
    refetch: refetchAttendanceData,
  } = useQuery(['getAttendanceInfo'], async () => {
    const res = await dwtApi.getAttendanceInfo();
    return res.data;
  });

  const {
    data: rewardAndPunishData,
    isLoading: isLoadingReward,
    refetch: refetchRewardAndPunish,
  } = useQuery(['getRewardAndPunish'], async () => {
    const response = await dwtApi.getRewardAndPunish();
    return response.data;
  });

  useRefreshOnFocus(() => {
    refetchAttendanceDay();
    refetchAttendanceData();
    refetchRewardAndPunish();
  });

  if (isLoadingAttendance || isLoadingReward || isLoadingAttendanceDay) {
    return <PrimaryLoading />;
  }

  return (
    <SafeAreaView style={styles.wrapper}>
      <HomeHeader navigation={navigation} />
      <TabBlock currentTab={currentTab} setCurrentTab={setCurrentTab} />
      {currentTab === 0 ? (
        <HomeTabContainer
          attendanceData={attendanceData}
          checkInTime={checkInTime}
          checkOutTime={checkOutTime}
          rewardAndPunishData={rewardAndPunishData}
        />
      ) : currentTab === 1 ? (
        <ManagerTabContainer
          attendanceData={attendanceData}
          checkInTime={checkInTime}
          checkOutTime={checkOutTime}
          rewardAndPunishData={rewardAndPunishData}
        />
      ) : currentTab === 2 ? (
        <ManagerTabContainer
          attendanceData={attendanceData}
          checkInTime={checkInTime}
          checkOutTime={checkOutTime}
          rewardAndPunishData={rewardAndPunishData}
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

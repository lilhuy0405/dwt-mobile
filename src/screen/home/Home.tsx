import { StyleSheet } from 'react-native';
import HomeHeader from '../../components/home/HomeHeader.tsx';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { useConnection } from '../../redux/connection';
import { dwtApi } from '../../api/service/dwtApi.ts';
import PrimaryLoading from '../../components/common/loading/PrimaryLoading.tsx';
import dayjs from 'dayjs';
import { useRefreshOnFocus } from '../../hook/useRefeshOnFocus.ts';
import TabBlock from '../../components/home/TabBlock.tsx';
import { useState } from 'react';
import AdminTabBlock from '../../components/common/tab/AdminTabBlock.tsx';
import {
  LIST_BUSINESS_DEPARTMENT,
  LIST_FACTORY_DEPARTMENT,
  LIST_OFFICE_DEPARTMENT,
} from '../../assets/constant.ts';
import UserBusiness from "../../components/home/user/UserBusiness.tsx";
import UserOffice from "../../components/home/user/UserOffice.tsx";
import UserFactory from "../../components/home/user/UserFactory.tsx";
import ManagerBusiness from "../../components/home/manager/ManagerBusiness.tsx";
import ManagerOffice from "../../components/home/manager/ManagerOffice.tsx";
import ManagerFactory from "../../components/home/manager/ManagerFactory.tsx";
import AdminBusiness from "../../components/home/admin/AdminBusiness.tsx";
import AdminOffice from "../../components/home/admin/AdminOffice.tsx";
import AdminFactory from "../../components/home/admin/AdminFactory.tsx";

export default function Home({ navigation }: any) {
  const {
    connection: { userInfo, currentTabManager },
  } = useConnection();
  const [currentMenuTab, setCurrentMenuTab] = useState(0);
  const {
    data: { checkInTime, checkOutTime } = {},
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
    userInfo && (
      <SafeAreaView style={styles.wrapper}>
        <HomeHeader navigation={navigation} />
        <AdminTabBlock secondLabel={'Quản lý'} />
        {userInfo?.role === 'admin' && currentTabManager === 1 && (
          <TabBlock
            currentTab={currentMenuTab}
            setCurrentTab={setCurrentMenuTab}
          />
        )}
        {currentTabManager === 0 ? (
          LIST_BUSINESS_DEPARTMENT.includes(userInfo.departement_id) ? (
            <UserBusiness
              attendanceData={attendanceData}
              checkInTime={checkInTime}
              checkOutTime={checkOutTime}
              rewardAndPunishData={rewardAndPunishData}
            />
          ) : LIST_OFFICE_DEPARTMENT.includes(userInfo.departement_id) ? (
            <UserOffice
              attendanceData={attendanceData}
              rewardAndPunishData={rewardAndPunishData}
              checkInTime={checkInTime}
              checkOutTime={checkOutTime}
            />
          ) : LIST_FACTORY_DEPARTMENT.includes(userInfo.departement_id) ? (
            <UserFactory
              navigation={navigation}
              attendanceData={attendanceData}
              rewardAndPunishData={rewardAndPunishData}
              checkInTime={checkInTime}
              checkOutTime={checkOutTime}
            />
          ) : null
        ) : userInfo?.role === 'admin' ? (
          currentMenuTab === 0 ? (
            <AdminOffice
              attendanceData={attendanceData}
              rewardAndPunishData={rewardAndPunishData}
              navigation={navigation}
            />
          ) : currentMenuTab === 1 ? (
            <AdminBusiness
              attendanceData={attendanceData}
              rewardAndPunishData={rewardAndPunishData}
            />
          ) : currentMenuTab === 2 ? (
            <AdminFactory
              attendanceData={attendanceData}
              rewardAndPunishData={rewardAndPunishData}
              navigation={navigation}
            />
          ) : null
        ) : LIST_BUSINESS_DEPARTMENT.includes(userInfo.departement_id) ? (
          <ManagerBusiness
            attendanceData={attendanceData}
            rewardAndPunishData={rewardAndPunishData}
          />
        ) : LIST_OFFICE_DEPARTMENT.includes(userInfo.departement_id) ? (
          <ManagerOffice
            attendanceData={attendanceData}
            rewardAndPunishData={rewardAndPunishData}
            navigation={navigation}
          />
        ) : LIST_FACTORY_DEPARTMENT.includes(userInfo.departement_id) ? (
          <ManagerFactory
            attendanceData={attendanceData}
            rewardAndPunishData={rewardAndPunishData}
            navigation={navigation}
          />
        ) : null}

        {/*{currentTabManager === 0 ? (*/}
        {/*    LIST_FACTORY_DEPARTMENT.includes(userInfo.departement_id) ? (*/}
        {/*        <HomeTabFactoryContainer*/}
        {/*            navigation={navigation}*/}
        {/*            setCurrentMenuTab={setCurrentMenuTab}*/}
        {/*        />*/}
        {/*    ) : (*/}
        {/*        <UserBusiness*/}
        {/*            attendanceData={attendanceData}*/}
        {/*            checkInTime={checkInTime}*/}
        {/*            checkOutTime={checkOutTime}*/}
        {/*            rewardAndPunishData={rewardAndPunishData}*/}
        {/*        />)*/}
        {/*) : currentMenuTab === 0 && currentTabManager === 1 ? (*/}
        {/*    <OfficeTabContainer*/}
        {/*        attendanceData={attendanceData}*/}
        {/*        rewardAndPunishData={rewardAndPunishData}*/}
        {/*    />*/}
        {/*) : currentMenuTab === 1 && currentTabManager === 1 ? (*/}
        {/*    <BusinessTabContainer*/}
        {/*        attendanceData={attendanceData}*/}
        {/*        checkInTime={checkInTime}*/}
        {/*        checkOutTime={checkOutTime}*/}
        {/*        rewardAndPunishData={rewardAndPunishData}*/}
        {/*    />*/}
        {/*) : currentMenuTab === 2 && currentTabManager === 1 ? (*/}
        {/*    <ManufactureTabContainer setCurrentMenuTab={setCurrentMenuTab}/>*/}
        {/*) : null}*/}
      </SafeAreaView>
    )
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

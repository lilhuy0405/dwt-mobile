import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  fs_12_400,
  fs_14_400,
  py20,
  text_black,
  text_center,
} from '../../../assets/style.ts';
import WorkProgressBlock from '../manager-tab/WorkProgressBlock.tsx';
import DropdownIcon from '../../../assets/img/dropdown-icon.svg';
import LockIcon from '../../../assets/img/lock-icon.svg';
import ReportAndProposeBlock from '../manager-tab/ReportAndProposeBlock.tsx';
import { useConnection } from '../../../redux/connection';
import { useQuery } from '@tanstack/react-query';
import { dwtApi } from '../../../api/service/dwtApi.ts';
import { useState } from 'react';
import ListDepartmentModal from '../manager-tab/ListDepartmentModal.tsx';
import PrimaryLoading from '../../common/loading/PrimaryLoading.tsx';
import WorkOfficeManagerTable from '../manager-tab/WorkOfficeManagerTable.tsx';
import dayjs from 'dayjs';
import MonthPickerModal from '../../common/modal/MonthPickerModal.tsx';
import AddIcon from '../../../assets/img/add.svg';
import PlusButtonModal from '../../work/PlusButtonModal.tsx';
import { useNavigation } from '@react-navigation/native';
import BehaviorBlock from '../home-tab/BehaviorBlock.tsx';

export default function OfficeTabContainer({
  attendanceData,
  rewardAndPunishData,
}: any) {
  const {
    connection: { userInfo },
  } = useConnection();

  const navigation = useNavigation();
  const [isOpenDepartmentModal, setIsOpenDepartmentModal] =
    useState<boolean>(false);
  const [currentDepartment, setCurrentDepartment] = useState<any>({
    value: 0,
    label: 'Phòng ban',
  });
  const [currentMonth, setCurrentMonth] = useState({
    month: dayjs().month(),
    year: dayjs().year(),
  });
  const [isOpenTimeSelect, setIsOpenTimeSelect] = useState(false);

  const [isOpenPlusButton, setIsOpenPlusButton] = useState(false);

  const { data: listDepartment = [] } = useQuery(
    ['listDepartment'],
    async () => {
      const res = await dwtApi.getListDepartment();
      return res.data;
    }
  );

  const { data: dailyReportDepartmentData = {} } = useQuery(
    ['listDailyReportDepartment'],
    async () => {
      const res = await dwtApi.getDailyReportDepartment();
      return res.data;
    },
    {
      enabled:
        !!userInfo &&
        !!(userInfo?.role === 'admin' || userInfo?.role === 'manager'),
    }
  );

  const {
    data: { listWorkOffice, workSummary } = {
      listWorkOffice: [],
      workSummary: {
        done: 0,
        working: 0,
        late: 0,
        total: 0,
      },
    },
    isLoading: isLoadingWorkOffice,
    refetch: refetchWorkOffice,
  } = useQuery(
    ['getListWorkOfficeManager'],
    async () => {
      const resPersonal = await dwtApi.getOfficeWork();
      const listWorkOffice = [
        ...resPersonal.data.departmentKpi.targetDetails,
        ...resPersonal.data.departmentKpi.reportTasks.map((item: any) => {
          return {
            ...item,
            isWorkArise: true,
          };
        }),
      ];
      const workSummary = {
        done: listWorkOffice.filter((item: any) => item.work_status === 3)
          .length,
        working: listWorkOffice.filter((item: any) => item.work_status === 2)
          .length,
        late: listWorkOffice.filter((item: any) => item.work_status === 4)
          .length,
        total: listWorkOffice.filter(
          (item: any) =>
            item.work_status === 3 ||
            item.work_status === 2 ||
            item.work_status === 4
        ).length,
      };
      return {
        listWorkOffice: listWorkOffice,
        workSummary: workSummary,
      };
    },
    {
      enabled:
        !!userInfo &&
        !!(userInfo?.role === 'admin' || userInfo?.role === 'manager'),
    }
  );

  if (isLoadingWorkOffice) {
    return <PrimaryLoading />;
  }

  return (
    <View style={styles.wrapper}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.filter_wrapper}>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => {
              setIsOpenTimeSelect(true);
            }}
          >
            <Text style={[text_black, fs_12_400]}>
              Tháng {currentMonth.month + 1}/{currentMonth.year}
            </Text>
            <DropdownIcon width={20} height={20} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => {
              setIsOpenDepartmentModal(true);
            }}
          >
            <Text style={[text_black, fs_12_400]}>
              {currentDepartment.label}
            </Text>
            <DropdownIcon width={20} height={20} />
          </TouchableOpacity>
        </View>
        <WorkProgressBlock attendanceData={attendanceData} />

        <ReportAndProposeBlock
          totalDailyReport={dailyReportDepartmentData.countDailyReports}
        />

        <BehaviorBlock
          rewardAndPunishData={rewardAndPunishData}
          workSummary={workSummary}
        />
        {/*<TopUserBlock />*/}
        <WorkOfficeManagerTable listWork={listWorkOffice} />
      </ScrollView>

      <TouchableOpacity
        style={styles.align_end}
        onPress={() => setIsOpenPlusButton(true)}
      >
        <AddIcon width={32} height={32} />
        <PlusButtonModal
          visible={isOpenPlusButton}
          setVisible={setIsOpenPlusButton}
          navigation={navigation}
        />
      </TouchableOpacity>
      {isOpenDepartmentModal && (
        <ListDepartmentModal
          currentDepartment={currentDepartment}
          setCurrentDepartment={setCurrentDepartment}
          visible={isOpenDepartmentModal}
          setVisible={setIsOpenDepartmentModal}
          listDepartment={listDepartment.map((department: any) => {
            return {
              value: department.id,
              label: department.name,
            };
          })}
        />
      )}

      <MonthPickerModal
        visible={isOpenTimeSelect}
        setVisible={setIsOpenTimeSelect}
        setCurrentMonth={setCurrentMonth}
        currentMonth={currentMonth}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
  },
  content: {
    gap: 15,
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  filter_wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  dropdown: {
    width: '47%',
    borderRadius: 5,
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.25)',
  },
  align_end: {
    position: 'absolute',
    bottom: 10,
    right: 15,
    zIndex: 2,
  },
});

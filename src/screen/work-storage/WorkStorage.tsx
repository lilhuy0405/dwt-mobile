import {Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../components/header/Header.tsx';
import {useMemo, useState} from 'react';
import AdminTabBlock from '../../components/work/AdminTabBlock.tsx';
import {useConnection} from '../../redux/connection';
import {fs_14_400, text_black} from "../../assets/style.ts";
import DropdownIcon from "../../assets/img/dropdown-icon.svg";
import MonthPickerModal from "../../components/common/modal/MonthPickerModal.tsx";
import dayjs from "dayjs";
import PrimaryTable from "../../components/common/table/PrimaryTable.tsx";
import WorkStorageRowDetail from "../../components/work-storage/WorkStorageRowDetail.tsx";
import UserFilterMultipleModal from "../../components/common/modal/UserFilterMultipleModal.tsx";
import {WORK_STORAGE_STATUS} from "../../assets/constant.ts";
import WorkStorageStatusFilterModal from "../../components/common/modal/WorkStorageStatusFilterModal.tsx";
import ToastSuccessModal from "../../components/common/modal/ToastSuccessModal.tsx";
import {useQuery} from "@tanstack/react-query";
import {dwtApi} from "../../api/service/dwtApi.ts";
import LoadingActivity from "../../components/common/loading/LoadingActivity.tsx";

const statusColorCode = {
  'changer_status': '#FFB800', // chua nhan viec
  '1': '#fff', // da giao
  '2': '#FFB822', // dang lam
  '3': '#89B6FA', // da xong
  '4': '#03D87F', // da ngiem thu
  '5': '#F5325C', // tre han
}

export default function WorkStorage({navigation}: any) {
  const {connection: {currentTabManager, userInfo}} = useConnection();
  const [currentDate, setCurrentDate] = useState<{
    month: number;
    year: number;
    date: number;
  }>({
    month: dayjs().month(),
    year: dayjs().year(),
    date: dayjs().date(),
  });
  const [isOpenSelectMonth, setIsOpenSelectMonth] = useState(false);
  const [isOpenSelectUser, setIsOpenSelectUser] = useState(false);
  const [listCurrentUser, setListCurrentUser] = useState([]);
  const [currentStatus, setCurrentStatus] = useState(WORK_STORAGE_STATUS[0]);
  const [isOpenSelectStatus, setIsOpenSelectStatus] = useState(false);
  const [isOpenSuccessModal, setIsOpenSuccessModal] = useState(false);

  const columns = [
    {
      key: 'index',
      title: 'TT',
      width: 0.1,
    },
    {
      key: 'name',
      title: 'Tên',
      width: 0.5,
    },
    {
      key: 'kpi',
      title: 'KPI',
      width: 0.15,
    },
    {
      key: 'deadline',
      title: 'Thời hạn',
      width: 0.25,
    },
  ]
  const {
    data: listUsersData = {},
    isLoading: isLoadingListUsers
  } = useQuery(["dwtApi.getListAllUser"], () => dwtApi.getListAllUser())
  const {data: listUsers = []} = listUsersData
  const {
    data: listJobData = {},
    isLoading: isLoadingListJobs,
    refetch: reFetchListJobs
  } = useQuery(["dwtApi.getListJobs", {
    role: userInfo?.role ?? "user",
    params: {
      page: 1,
      limit: 10,
      actualState: 'changer_status',
      month: `${currentDate.month + 1}/${currentDate.year}`,
      createdBy: listCurrentUser.join(','),
    }
  }], ({queryKey}: any) => dwtApi.getListJobs(queryKey[1].role, queryKey[1].params))
  const {data: {data: listJobs = []} = {}} = listJobData
  //normalization data
  const tableData = useMemo(() => {
    return listJobs.map((item: any, index: number) => {
      //calculate kpi
      //KPI = ( Giờ công/2 ) * Chỉ tiêu
      //Công việc có “Mục tiêu” = 1 lần -> Chỉ tiêu = 1
      const kpi = item?.working_hours ?? 0 / 2 * item?.type ?? 1;
      return {
        ...item,
        index: index + 1,
        name: item?.name ?? '',
        kpi,
        deadline: dayjs(item?.end_time).format('DD/MM/YYYY'),
        bgColor: statusColorCode[item?.actual_state as keyof typeof statusColorCode] ?? '#fff'
      }
    })
  }, [listJobs])

  const handleAcceptJob = async (id: string) => {
    try {
      await dwtApi.acceptJob(id)
      await reFetchListJobs()
      setIsOpenSuccessModal(true)
    } catch (e) {
      console.log(e)
      Alert.alert('Lỗi', 'Nhận việc thất bại')
    }
  }
  return (
    <SafeAreaView style={styles.wrapper}>
      {
        ['manager', 'admin'].includes(userInfo.role) && (
          <AdminTabBlock
            secondLabel={'Quản lý'}
          />
        )
      }
      <Header title={'KHO VIỆC'} handleGoBack={() => navigation.goBack()}/>

      <View style={styles.filter_wrapper}>
        <TouchableOpacity
          style={[currentTabManager === 1 ? styles.dropdownManager : styles.dropdown]}
          onPress={() => {
            setIsOpenSelectMonth(true);
          }}
        >
          <Text style={[text_black, fs_14_400]}>
            {currentDate.month + 1}/{currentDate.year}
          </Text>
          <DropdownIcon width={20} height={20}/>
        </TouchableOpacity>

        {
          currentTabManager === 1 && (
            <TouchableOpacity
              style={[currentTabManager === 1 ? styles.dropdownManager : styles.dropdown]}
              onPress={() => {
                setIsOpenSelectStatus(true);
              }}
            >
              <Text style={[text_black, fs_14_400]}>
                {currentStatus.label}
              </Text>
              <DropdownIcon width={20} height={20}/>
            </TouchableOpacity>
          )
        }
        <TouchableOpacity
          style={[currentTabManager === 1 ? styles.dropdownManager : styles.dropdown]}
          onPress={() => {
            setIsOpenSelectUser(true)
          }}
        >
          <Text style={[text_black, fs_14_400]}>
            {listCurrentUser.length > 0 ? `${listCurrentUser.length} người giao` : 'Người giao'}
          </Text>
          <DropdownIcon width={20} height={20}/>

        </TouchableOpacity>

      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <PrimaryTable
          data={tableData}
          columns={columns}
          canShowMore={true}
          rowDetailComponent={(item: any) => {
            return (
              <WorkStorageRowDetail data={{
                ...item,
                handleAcceptJob
              }}/>
            )
          }}
        />
      </ScrollView>
      <MonthPickerModal
        visible={isOpenSelectMonth}
        setVisible={() => {
          setIsOpenSelectMonth(false);
        }}
        currentMonth={currentDate}
        setCurrentMonth={setCurrentDate}
      />
      <UserFilterMultipleModal
        visible={isOpenSelectUser}
        setVisible={setIsOpenSelectUser}
        listCurrentUser={listCurrentUser}
        setListCurrentUser={setListCurrentUser}
        listUser={listUsers.map((item: any) => ({
          label: item?.name ?? '',
          value: item?.id ?? '',
        }))}
      />
      <WorkStorageStatusFilterModal
        visible={isOpenSelectStatus}
        setVisible={setIsOpenSelectStatus}
        setStatusValue={setCurrentStatus}
        statusValue={currentStatus}
      />
      <ToastSuccessModal
        visible={isOpenSuccessModal}
        handlePressOk={() => {
          setIsOpenSuccessModal(false);
        }}
        description={'Nhận việc thành công'}
      />
      {/*<LoadingActivity isLoading={isLoadingListJobs as boolean || isLoadingListUsers as boolean}/>*/}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  dropdownManager: {
    width: '32%',
    borderRadius: 5,
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.25)',
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
  content: {
    gap: 10,
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 20,
  },
  filter_wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginTop: 10
  },
});

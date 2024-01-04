import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {fs_12_400, py20, text_black} from '../../../assets/style.ts';
import WorkProgressBlock from '../manager-component/WorkProgressBlock.tsx';
import BehaviorBlock from '../home-component/BehaviorBlock.tsx';
import WorkTable from '../WorkTable.tsx';
import {useInfiniteQuery, useQuery} from '@tanstack/react-query';
import {dwtApi} from '../../../api/service/dwtApi.ts';
import PrimaryLoading from '../../common/loading/PrimaryLoading.tsx';
import AddIcon from '../../../assets/img/add.svg';
import PlusButtonModal from '../../work/PlusButtonModal.tsx';
import {useMemo, useState} from 'react';
import {useRefreshOnFocus} from '../../../hook/useRefeshOnFocus.ts';
import DropdownIcon from "../../../assets/img/dropdown-icon.svg";
import dayjs from "dayjs";
import ListDepartmentModal from "../manager-component/ListDepartmentModal.tsx";
import MonthPickerModal from "../../common/modal/MonthPickerModal.tsx";
import {useConnection} from "../../../redux/connection";
import ReportAndProposeBlock from "../manager-component/ReportAndProposeBlock.tsx";
import {getMonthFormat} from "../../../utils";
import UserFilterModal from "../../common/modal/UserFilterModal.tsx";
import {LIST_OFFICE_DEPARTMENT} from "../../../assets/constant.ts";
import WorkOfficeManagerTable from "../manager-component/WorkOfficeManagerTable.tsx";

export default function ManagerOffice(
    {
        attendanceData,
        rewardAndPunishData,
        navigation
    }: any) {
    const {connection: {userInfo}} = useConnection()
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
    const [isOpenUserSelect, setIsOpenUserSelect] = useState(false);
    const [currentUserId, setCurrentUserId] = useState({
        label: 'Nhân sự',
        value: 0,
    });

    const [isOpenPlusButton, setIsOpenPlusButton] = useState(false);

    const { data: listDepartment = [] } = useQuery(
        ['listDepartmentOffice'],
        async () => {
            const res = await dwtApi.getListDepartment();
            return res.data.filter((item: any) => LIST_OFFICE_DEPARTMENT.includes(item.id));
        }
    );


    const { data: totalReport = 0 } = useQuery(
        ['dailyReportHome'],
        async () => {
            const res = await dwtApi.getDailyReportDepartment({
                date_report: dayjs().format('YYYY-MM-DD'),
                department_id: userInfo?.departement_id,
            });
            return res?.data?.countDailyReports;
        },
        {
            enabled: !!userInfo,
        }
    );

    const {
        data: totalMeeting = 0
    } = useQuery(['totalMeetingHome'], async () => {
        const res = await dwtApi.getListMeeting({
            date: dayjs().format('MM/YYYY'),
            department_id: userInfo?.departement_id,
        });
        return res?.data?.total;
    }, {
        enabled: !!userInfo
    })

    const {
        data: totalPropose = 0
    } = useQuery(['totalProposeHome'], async () => {
        const res = await dwtApi.getAllPropose({
            date: dayjs().format('YYYY-MM-DD'),
        });
        return res?.data?.total;
    })


    const {
        data: {pages = []} = {},
        isFetching: isFetchingListUsers,
        hasNextPage: hasNextPageListUsers,
        fetchNextPage: fetchNextPageListUsers,
    } = useInfiniteQuery(["dwtApi.getListAllUser", currentDepartment], async ({pageParam = 1, queryKey}) => {
            const res = await dwtApi.searchUser({
                page: pageParam,
                limit: 10,
                departement_id: queryKey[1].value === 0 ? userInfo?.departement_id : queryKey[1].value,
            })

            return {
                data: res?.data?.data,
                nextPage: pageParam + 1,
            }
        }, {
            getNextPageParam: (lastPage, pages) => {
                if (lastPage?.data?.length < 10) {
                    return undefined
                }
                return lastPage?.nextPage
            },
        }
    )
    const listUsers = pages.flatMap(page => page.data);


    const {
        data: managerOfficeData,
        isLoading: isLoadingWork,
        refetch: refetchWork,
    } = useQuery(['managerOffice', currentDepartment, currentMonth, currentUserId], async ({queryKey}) => {
        const res = await dwtApi.getOfficeWorkDepartment({
            department_id: queryKey[1].value === 0 ? userInfo?.departement_id : queryKey[1].value,
            start_date: getMonthFormat(queryKey[2].month + 1, queryKey[2].year),
            user_id: queryKey[3].value === 0 ? undefined : queryKey[3].value,
        });
        return res.data;
    });

    const {
        listWorkDepartment = [],
        workSummary = {},
    } = useMemo(() => {
        if(managerOfficeData) {
            const listWorkOffice = [
                ...managerOfficeData.departmentKpi.targetDetails,
                ...managerOfficeData.departmentKpi.reportTasks.map((item: any) => {
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
                listWorkDepartment: listWorkOffice,
                workSummary: workSummary,
            }
        } else {
            return {
                listWorkDepartment: [],
                workSummary: {},
            }
        }

    }, [managerOfficeData])

    useRefreshOnFocus(refetchWork);

    if (isLoadingWork) {
        return <PrimaryLoading/>;
    }
    return (
        <View style={styles.wrapper}>
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <ScrollView horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.filter_wrapper}>
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
                            setIsOpenUserSelect(true);
                        }}
                    >
                        <Text style={[text_black, fs_12_400]}>
                            {currentUserId.label}
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
                </ScrollView>
                <WorkProgressBlock
                    attendanceData={attendanceData}
                    totalMeeting={totalMeeting}
                />
                <ReportAndProposeBlock
                    totalDailyReport={totalReport}
                    totalPropose={totalPropose}
                />

                <BehaviorBlock
                    rewardAndPunishData={rewardAndPunishData}
                    workSummary={workSummary}
                    type={'office'}
                />
                <WorkOfficeManagerTable listWork={listWorkDepartment}/>
            </ScrollView>

            <TouchableOpacity
                style={styles.align_end}
                onPress={() => setIsOpenPlusButton(true)}
            >
                <AddIcon width={32} height={32}/>
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

            <UserFilterModal
                visible={isOpenUserSelect}
                setVisible={setIsOpenUserSelect}
                currentUser={currentUserId}
                setCurrentUser={setCurrentUserId}
                listUser={listUsers.map(item => {
                    return {
                        value: item.id,
                        label: item.name,
                    }
                })}
                isFetchingUser={isFetchingListUsers}
                hasNextPageUser={hasNextPageListUsers}
                fetchNextPageUser={fetchNextPageListUsers}
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
        paddingTop: 10,
    },
    align_end: {
        position: 'absolute',
        bottom: 10,
        right: 15,
        zIndex: 2,
    },
    filter_wrapper: {
        gap: 10
    },
    dropdown: {
        minWidth: '31%',
        borderRadius: 5,
        padding: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.25)',
    },
});

import {
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {
    fs_10_500,
    fs_12_400,
    fs_15_700,
    text_black,
    text_center,
    text_white,
} from '../../assets/style.ts';
import {useMemo, useState} from 'react';
import dayjs from 'dayjs';
import {useQuery} from '@tanstack/react-query';
import {dwtApi} from '../../api/service/dwtApi.ts';
import DropdownIcon from '../../assets/img/dropdown-icon.svg';
import DailyCalendar from '../../components/daily-report/DailyCalendar.tsx';
import EmptyDailyReportIcon from '../../assets/img/empty-daily-report.svg';
import PrimaryButton from '../../components/common/button/PrimaryButton.tsx';
import MonthPickerModal from '../../components/common/modal/MonthPickerModal.tsx';
import LoadingActivity from '../../components/common/loading/LoadingActivity.tsx';
import AddIcon from "../../assets/img/add.svg";
import PlusButtonModal from "../../components/work/PlusButtonModal.tsx";
import CreateNewFactoryReport from "../../components/common/modal/CreateNewFactoryReport.tsx";
import {SafeAreaView} from "react-native-safe-area-context";
import HomeHeader from "../../components/home/HomeHeader.tsx";
import CreateFactoryDailyReportModal from "../../components/factory-daily-report/CreateFactoryDailyReportModal.tsx";
import PrimaryLoading from "../../components/common/loading/PrimaryLoading.tsx";

export default function DailyFactoryReport({navigation}: any) {
    const [currentDate, setCurrentDate] = useState<{
        month: number;
        year: number;
        date: number;
    }>({
        month: dayjs().month(),
        year: dayjs().year(),
        date: dayjs().date(),
    });
    const [isOpenPlusButton, setIsOpenPlusButton] = useState(false);

    const [isOpenSelectMonth, setIsOpenSelectMonth] = useState(false);
    const [isOpenCreateReportModal, setIsOpenCreateReportModal] = useState(false);
    const {data: productionDiaryData = {}, isLoading: loadingProductionDiary, refetch: refetchListData} =
        useQuery(
            [
                'getListFactoryReport',
                currentDate.month,
                currentDate.year,
            ],
            ({queryKey}: any) =>
                dwtApi.getProductionPersonalDiaryByMonth({
                    date: `${queryKey[2]}-${queryKey[1] + 1}`,
                })
        );
    // console.log('productionDiaryData', productionDiaryData);
    const {data: listProjectLogs = []} = productionDiaryData;
    const todayLogs = useMemo(() => {
        return listProjectLogs.filter(
            (item: any) => {
                const logDate = dayjs(item?.logDate);
                return logDate.month() === currentDate.month &&
                    logDate.year() === currentDate.year &&
                    logDate.date() === currentDate.date;
            }
        ).sort((a: any, b: any) => {
            return a?.project_work_id - b?.project_work_id;
        })
    }, [listProjectLogs, currentDate]);

    if(loadingProductionDiary) return <PrimaryLoading />

    return (
        <SafeAreaView style={styles.wrapper}>
            <HomeHeader navigation={navigation}/>
            <TouchableOpacity
                style={styles.monthBox}
                onPress={() => {
                    setIsOpenSelectMonth(true);
                }}
            >
                <Text style={[fs_15_700, text_black]}>
                    Tháng {currentDate.month + 1}
                </Text>
                <DropdownIcon width={20} height={20}/>
            </TouchableOpacity>
            <DailyCalendar
                currentDate={currentDate}
                setCurrentDate={setCurrentDate}
                listProjectLogs={listProjectLogs}
            />
            {todayLogs.length > 0 ? (
                <ScrollView style={styles.listReport}>
                    <FlatList
                        scrollEnabled={false}
                        contentContainerStyle={{
                            paddingTop: 30,
                            paddingBottom: 20,
                        }}
                        data={todayLogs.map((item: any) => ({...item, key: item.id}))}
                        renderItem={({item}) => {
                            return (
                                <TouchableOpacity
                                    style={styles.boxContainer}
                                    onPress={() => {
                                        // @ts-ignore
                                        navigation.navigate('ProjectWorkDetail', {
                                            data: item.project_work_id,
                                        });
                                    }}
                                >
                                    <View style={styles.logWrapper}>
                                        <View
                                            style={[
                                                styles.timeBox,
                                                {
                                                    backgroundColor:
                                                        item?.type === 1 ? '#C02626' : '#7CB8FF',
                                                },
                                            ]}
                                        >
                                            <Text style={[fs_10_500, text_white, text_center]}>
                                                {item?.user_name} ({item?.type === 1 ? 'GV' : 'TK'})
                                            </Text>
                                        </View>
                                        <Text style={[fs_12_400, text_black]}>• {item?.content}</Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        }}
                        ItemSeparatorComponent={() => <View style={{height: 20}}/>}
                    />
                </ScrollView>
            ) : (
                <View>
                    <EmptyDailyReportIcon
                        style={{alignSelf: 'center', marginTop: 50}}
                    />
                    <Text style={[fs_12_400, text_black, text_center]}>
                        Bạn chưa có báo cáo.
                    </Text>
                    <PrimaryButton
                        onPress={() => {
                            setIsOpenCreateReportModal(true);
                        }}
                        text={'Thêm báo cáo'}
                        buttonStyle={styles.buttonStyle}
                    />
                </View>
            )}

            <TouchableOpacity
                style={styles.align_end}
                onPress={() => setIsOpenPlusButton(true)}
            >
                <AddIcon width={32} height={32}/>
                <PlusButtonModal
                    visible={isOpenPlusButton}
                    setVisible={setIsOpenPlusButton}
                    navigation={navigation}
                    notHasReceiveWork={true}
                />
            </TouchableOpacity>

            <MonthPickerModal
                visible={isOpenSelectMonth}
                setVisible={() => {
                    setIsOpenSelectMonth(false);
                }}
                currentMonth={currentDate}
                setCurrentMonth={setCurrentDate}
            />
            <CreateFactoryDailyReportModal
                visible={isOpenCreateReportModal}
                setVisible={setIsOpenCreateReportModal}
                today={dayjs().date(currentDate.date).month(currentDate.month).year(currentDate.year)}
                refetchListData={refetchListData}
            />
            <LoadingActivity isLoading={loadingProductionDiary}/>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#fff',
        position: 'relative',
    },
    monthBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        alignSelf: 'flex-end',
        padding: 8,
        marginBottom: 5,
    },
    dropdownStyle: {
        width: 100,
        alignSelf: 'flex-end',
        marginRight: 15,
        marginTop: 10,
    },
    buttonStyle: {
        paddingVertical: 12,
        marginHorizontal: 20,
        marginBottom: 10,
        borderRadius: 8,
        marginTop: 20,
    },
    listReport: {
        position: 'relative',
        paddingHorizontal: 15,
    },
    timeText: {
        fontSize: 12,
        fontWeight: '400',
        position: 'absolute',
        left: 0,
        top: 20,
    },
    boxContainer: {
        width: '100%',
    },
    logWrapper: {
        width: '100%',
        backgroundColor: '#F4F4F4',
        borderRadius: 12,
        elevation: 5,
        shadowColor: 'rgba(0, 0, 0, 0.25)',
        shadowOffset: {
            width: 1,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        paddingVertical: 15,
        paddingLeft: 15,
        paddingRight: 10,
    },
    timeBox: {
        position: 'absolute',
        left: 15,
        top: -8,
        borderRadius: 15,
        paddingVertical: 3,
        paddingHorizontal: 5,
    },
    align_end: {
        position: 'absolute',
        bottom: 10,
        right: 15,
        zIndex: 2,
    },
});

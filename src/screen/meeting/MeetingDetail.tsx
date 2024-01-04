import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../components/header/Header.tsx';
import {useState} from 'react';
import AdminTabBlock from '../../components/common/tab/AdminTabBlock.tsx';
import {useConnection} from '../../redux/connection';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import MeetingInformation from "../../components/meeting/MeetingInformation.tsx";
import ListUserTable from "../../components/meeting/ListUserTable.tsx";
import InformationBox from "../../components/meeting/InformationBox.tsx";
import {fs_15_700, text_red} from "../../assets/style.ts";
import CircleInfoIcon from "../../assets/img/circle-info.svg";
import PrimaryTable from "../../components/common/table/PrimaryTable.tsx";
import {useQuery} from "@tanstack/react-query";
import {dwtApi} from "../../api/service/dwtApi.ts";
import dayjs from "dayjs";
import PrimaryLoading from "../../components/common/loading/PrimaryLoading.tsx";

export default function MeetingDetail({route, navigation}: any) {
    const {meetingid} = route.params;
    const {
        connection: {currentTabManager},
    } = useConnection();

    const {
        data: meetingDetailData = {},
        isLoading
    } = useQuery(['meetingDetail', meetingid], async ({queryKey}) => {
        const res = await dwtApi.getMeetingById(queryKey[1]);
        return res.data;
    }, {
        enabled: !!meetingid
    });
    console.log(meetingid)


    const startTime = meetingDetailData?.start_time && dayjs(meetingDetailData?.start_time?.split(' ')[0]).format('DD/MM/YYYY')
        + ' ' + (meetingDetailData?.start_time?.split(' ')[1]).substring(0, 5)

    const endTime = meetingDetailData?.end_time && dayjs(meetingDetailData?.end_time?.split(' ')[0]).format('DD/MM/YYYY')
        + ' ' + (meetingDetailData?.end_time?.split(' ')[1]).substring(0, 5)

    if(isLoading) {
        return <PrimaryLoading/>
    }

    return (
        <SafeAreaView style={styles.wrapper}>
            <AdminTabBlock
                secondLabel={'Quản lý'}
            />
            <Header title={'BIÊN BẢN HỌP'} handleGoBack={() => navigation.navigate('MeetingInfo')}/>
            <ScrollView contentContainerStyle={styles.content}>
                <MeetingInformation
                    data={[
                        {
                            label: 'Phòng ban',
                            value: meetingDetailData?.departement?.name,
                        },
                        {
                            label: 'Mã',
                            value: meetingDetailData?.code,
                        },
                        {
                            label: 'Loại',
                            value: meetingDetailData?.type,
                        },
                        {
                            label: 'Chủ đề',
                            value: meetingDetailData?.title,
                        },
                        {
                            label: 'Thời gian',
                            value: startTime + ' - ' + endTime,
                        },
                        {
                            label: 'Chủ trì',
                            value: meetingDetailData?.leader?.name,
                        },
                        {
                            label: 'Thư ký:',
                            value: meetingDetailData?.secretary?.name,
                        }
                    ]}
                />
                <ListUserTable
                    data={meetingDetailData?.participants &&
                        meetingDetailData?.participants?.map((item: any) => item?.name)}
                    headerTitle={'THÀNH VIÊN THAM GIA'}
                />

                {/*<ListUserTable*/}
                {/*    data={[*/}
                {/*        'Nguyễn Văn A',*/}
                {/*        'Nguyễn Văn B',*/}
                {/*        'Nguyễn Văn C',*/}
                {/*    ]}*/}
                {/*    headerTitle={'THÀNH VIÊN VẮNG'}*/}
                {/*/>*/}
                <InformationBox
                    headerTitle={'NỘI DUNG TRAO ĐỔI'}
                    hasDot={true}
                    listText={meetingDetailData?.meeting_logs ?
                        meetingDetailData?.meeting_logs?.map((item: any) => item?.note) : []}
                    textStyle={{
                        fontSize: 15,
                        color: '#000',
                    }}
                />

                <InformationBox
                    headerTitle={'FILE ĐÍNH KÈM'}
                    hasDot={true}
                    listText={[
                        'File 1',
                    ]}
                    textStyle={{
                        fontSize: 15,
                        color: '#0070FF',
                        fontStyle: 'italic',
                        textDecorationLine: 'underline',
                    }}
                />
                <View>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 7,
                        marginBottom: 7,
                    }}>
                        <Text style={[fs_15_700, text_red]}>VẤN ĐỀ TỒN ĐỌNG</Text>
                        <TouchableOpacity>
                            <CircleInfoIcon/>
                        </TouchableOpacity>
                    </View>
                    <PrimaryTable
                        data={meetingDetailData?.report?.map((item: any) => {
                            return {
                                problem: item?.problem,
                                solve: item?.solve,
                                responsible: item?.responsible?.name,
                            }
                        })}
                        columns={[
                            {
                                key: 'problem',
                                title: 'Vấn đề tồn đọng',
                                width: 1/3,
                            },
                            {
                                key: 'solve',
                                title: 'Giải quyết',
                                width: 1/3,
                            },
                            {
                                key: 'responsible',
                                title: 'Người đảm nhiệm',
                                width: 1/3,
                            },
                        ]}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        paddingHorizontal: 15,
        gap: 20,
        paddingVertical: 20,
    }
});

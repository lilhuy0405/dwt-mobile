import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  fs_13_400,
  fs_13_700,
  text_black,
  text_center,
  text_red,
} from '../../../assets/style.ts';
import { useNavigation } from '@react-navigation/native';

export default function WorkOfficeRowDetail({
  data,
  isWorkArise,
  isDepartment,
}: any) {
  const navigation = useNavigation();
  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        <Text style={[fs_13_700, text_black, styles.title]}>Tên nhiệm vụ:</Text>
        <Text style={[fs_13_400, text_black, styles.value]}>{data?.name}</Text>
      </View>

      <View style={styles.row}>
        <Text style={[fs_13_700, text_black, styles.title]}>Tiêu chí:</Text>
        <Text style={[fs_13_400, text_black, styles.value]}>
          {data?.criteria}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={[fs_13_700, text_black, styles.title]}>
          Tổng giá trị dự kiến:
        </Text>
        <Text style={[fs_13_400, text_black, styles.value]}>
          {data?.criteria_required}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={[fs_13_700, text_black, styles.title]}>Đã đạt được:</Text>
        <Text style={[fs_13_400, text_black, styles.value]}>
          {data.keysPassed}/{data?.criteria_required}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={[fs_13_700, text_black, styles.title]}>
          Điểm KPI tạm tính:
        </Text>
        <Text style={[fs_13_400, text_black, styles.value]}>
          {data.kpiValue}
        </Text>
      </View>

      <View style={styles.listButton}>
        <TouchableOpacity
          style={isDepartment ? styles.departmentButton : styles.button}
          onPress={() => {
            // @ts-ignore
            navigation.navigate('WorkOfficeListReport', {
              data: {
                ...data,
                isWorkArise: isWorkArise,
              },
            });
          }}
        >
          <Text style={[fs_13_700, text_red]}>Tiến trình</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={isDepartment ? styles.departmentButton : styles.button}
          onPress={() => {
            // @ts-ignore
            navigation.navigate('WorkDetailOffice', {
              data: {
                ...data,
                isWorkArise: isWorkArise,
              },
              routeGoBack: 'Work',
            });
          }}
        >
          <Text style={[fs_13_700, text_red]}>Xem chi tiết</Text>
        </TouchableOpacity>

        {!isDepartment && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              if(isWorkArise) {
                // @ts-ignore
                navigation.navigate('WorkOfficeAriseReport', {
                  data: data,
                });
                return;
              } else {
              // @ts-ignore
              navigation.navigate('WorkOfficeReport', {
                data: data,
              });
              }
            }}
          >
            <Text style={[fs_13_700, text_red]}>Báo cáo</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    borderLeftColor: '#D9D9D9',
    borderLeftWidth: 1,
    borderRightColor: '#D9D9D9',
    borderRightWidth: 1,
    paddingTop: 12,
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    paddingLeft: 20,
  },
  title: {
    width: '40%',
  },
  value: {
    width: '60%',
  },
  listButton: {
    flexDirection: 'row',
    flex: 1,
    borderTopColor: '#D9D9D9',
    borderTopWidth: 0.5,
    borderBottomColor: '#D9D9D9',
    borderBottomWidth: 0.5,
    marginTop: 10,
  },
  button: {
    flex: 1 / 3,
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftColor: '#D9D9D9',
    borderLeftWidth: 0.5,
    borderRightColor: '#D9D9D9',
    borderRightWidth: 0.5,
    paddingVertical: 7,
  },
  departmentButton: {
    flex: 1 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftColor: '#D9D9D9',
    borderLeftWidth: 0.5,
    borderRightColor: '#D9D9D9',
    borderRightWidth: 0.5,
    paddingVertical: 7,
  },
});

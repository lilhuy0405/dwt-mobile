import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import {fs_12_500, text_black, text_center} from '../../../assets/style.ts';
import RowTable from './RowTable.tsx';
import PropTypes, {InferProps} from 'prop-types';

export default function PrimaryTable({
  columns,
  data,
  canShowMore,
  headerColor,
}: InferProps<typeof PrimaryTable.propTypes>) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        {columns.map((column: any, index: any) => {
          return (
            <View
              key={index}
              style={[
                {
                  flex: column.width,
                  backgroundColor: headerColor || '#DCE1E7',
                  height: 'auto',
                },
                styles.cell,
              ]}>
              <Text style={[fs_12_500, text_black, text_center]}>
                {column.title}
              </Text>
            </View>
          );
        })}
      </View>
      <FlatList
        scrollEnabled={false}
        data={data}
        renderItem={({item}) => {
          let bgColor = item.bgColor || '#FFF';
          return (
            <Pressable>
              <RowTable
                item={item}
                columns={columns}
                bgColor={bgColor}
                canShowMore={canShowMore}
                isWorkArise={item.isWorkArise ? item.isWorkArise : false}
                isManagerWork={item.isManagerWork ? item.isManagerWork : false}
              />
            </Pressable>
          );
        }}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    flex: 1,
  },
  cell: {
    paddingVertical: 7,
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: '#D9D9D9',
  },
});

PrimaryTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  canShowMore: PropTypes.bool,
  headerColor: PropTypes.string,
};

PrimaryTable.defaultProps = {
  canShowMore: false,
  headerColor: '#DCE1E7',
};

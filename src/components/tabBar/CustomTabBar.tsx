import {Pressable, StyleSheet, View} from 'react-native';
export default function CustomTabBar({state, descriptors, navigation}: any) {
  return (
    <View style={styles.container}>
      {state.routes.map((route: any, index: any) => {
        const {options} = descriptors[route.key];
        const icon = options.tabBarIcon;
        const label = options.tabBarLabel;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <Pressable
            hitSlop={8}
            accessibilityRole="button"
            onPress={onPress}
            onLongPress={onLongPress}
            key={index}
            style={styles.item}>
            {icon({isFocused})}
            {label({isFocused})}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderTopColor: '#C1C1C1',
    borderTopWidth: 1,
  },
  item: {
    alignItems: 'center',
    gap: 5,
    zIndex: 1,
    justifyContent: 'flex-end',
    width: '20%',
  },
});

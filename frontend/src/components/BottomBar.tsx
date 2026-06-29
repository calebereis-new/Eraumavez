// Tab bar CUSTOM — controle total sobre layout, sem depender de quirks
// internos do React Navigation Bottom Tabs no web. Garante que ícones
// e labels nunca sejam cortados em iPhone (PWA standalone) ou web.
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import { colors, fonts } from '@/src/theme/tokens';
import { useSafeBottom } from '@/src/hooks/use-safe-bottom';

const ICON_BOX = 28;
const LABEL_H = 16;
const PAD_TOP = 12;
const GAP = 4;

export function BottomBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const safeBottom = useSafeBottom();
  // Em iPhone (PWA) o home indicator reserva ~34px → garantimos 24px mínimo.
  // Em desktop/Android usamos 10px.
  const padBottom = Math.max(safeBottom, 10);
  const totalHeight = PAD_TOP + ICON_BOX + GAP + LABEL_H + padBottom + 4; // 4 = folga

  return (
    <View
      style={[
        styles.bar,
        {
          height: totalHeight,
          paddingTop: PAD_TOP,
          paddingBottom: padBottom + 4,
        },
      ]}
      testID="bottom-tab-bar"
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const focused = state.index === index;
        const color = focused ? colors.douradoEstrela : colors.lilasSonho;
        const label =
          (typeof options.tabBarLabel === 'string' && options.tabBarLabel) ||
          options.title ||
          route.name;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const Icon = options.tabBarIcon;

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            accessibilityRole="tab"
            accessibilityState={focused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
            style={styles.item}
            testID={`tab-${route.name}`}
          >
            <View style={[styles.iconBox, { height: ICON_BOX, width: ICON_BOX }]}>
              {Icon ? Icon({ focused, color, size: 24 }) : null}
            </View>
            <Text
              numberOfLines={1}
              style={[
                styles.label,
                { color, height: LABEL_H, marginTop: GAP },
              ]}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.noiteAmeixa,
    borderTopColor: 'rgba(246,239,225,0.08)',
    borderTopWidth: 1,
    paddingHorizontal: 4,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  iconBox: { alignItems: 'center', justifyContent: 'center' },
  label: {
    fontFamily: fonts.textoBold,
    fontSize: 11,
    lineHeight: 14,
    textAlign: 'center',
    includeFontPadding: false,
  },
});

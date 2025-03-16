import React from 'react';
import { Text } from 'react-native';
import { createIconSet } from '@expo/vector-icons';

// 这里应该是从iconfont.cn导出的字体图标的unicode映射
// 在实际项目中，你需要从iconfont.cn下载字体文件和JS文件获取这些映射
const glyphMap = {
  'home': 58880,
  'profile': 58881,
  'task': 58882,
  'salary': 58883,
  'settings': 58884,
  'calendar': 58885,
  'clock': 58886,
  'location': 58887,
  'notification': 58888,
  'warning': 58889,
  'check-circle': 58890,
  'arrow-right': 58891,
  'edit': 58892,
  'delete': 58893,
  'search': 58894,
  'filter': 58895,
  'logout': 58896,
  'download': 58897,
  'upload': 58898,
  'share': 58899,
  'stats': 58900,
  'chart': 58901,
  'dollar': 58902,
  'time': 58903,
  'plus': 58904,
  'minus': 58905,
  'close': 58906,
  'check': 58907,
};

// 在实际项目中，你需要确保字体文件已经加载到项目中
// 可以使用expo-font或react-native-vector-icons加载字体
const CustomIcon = createIconSet(glyphMap, 'WorkTimeIcons', 'work-time-icons.ttf');

// 创建一个包装组件，便于使用
export const Icon = ({ name, size, color, style }) => {
  return (
    <CustomIcon 
      name={name} 
      size={size || 24} 
      color={color || '#000'} 
      style={style}
    />
  );
};

// 通常，还需要在项目中预加载字体
// 在实际项目中，可以使用expo-font来加载字体:
/*
import * as Font from 'expo-font';

export const loadFonts = async () => {
  await Font.loadAsync({
    'WorkTimeIcons': require('../../assets/fonts/work-time-icons.ttf'),
  });
};
*/ 
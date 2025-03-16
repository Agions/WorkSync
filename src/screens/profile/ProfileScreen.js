import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Switch,
  Alert
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/actions/userActions';
import { Icon } from '../../utils/IconFont';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector(state => state.user);
  
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [faceIdLogin, setFaceIdLogin] = useState(true);
  
  // 头像和基本信息
  const userImage = 'https://via.placeholder.com/150';
  const userPosition = userInfo?.position || '开发工程师';
  const userEmail = userInfo?.email || 'user@example.com';
  const userName = userInfo?.name || '用户';
  
  // 处理设置开关
  const toggleNotifications = () => {
    setNotifications(prev => !prev);
  };
  
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
    // 实际应用中，这里应该调用主题切换函数
  };
  
  const toggleFaceIdLogin = () => {
    setFaceIdLogin(prev => !prev);
  };
  
  // 处理退出登录
  const handleLogout = () => {
    Alert.alert(
      '确认退出',
      '您确定要退出登录吗？',
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '确认', 
          onPress: () => {
            dispatch(logout());
          }
        }
      ]
    );
  };
  
  // 清除缓存
  const handleClearCache = () => {
    Alert.alert(
      '清除缓存',
      '确定要清除所有缓存数据吗？',
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '确认', 
          onPress: async () => {
            // 这里只是演示，实际应用中需要更精细的缓存管理
            try {
              const keys = await AsyncStorage.getAllKeys();
              const preserveKeys = ['token', 'userInfo']; // 保留登录信息
              const keysToRemove = keys.filter(key => !preserveKeys.includes(key));
              
              if (keysToRemove.length > 0) {
                await AsyncStorage.multiRemove(keysToRemove);
                Alert.alert('成功', '缓存已清除');
              } else {
                Alert.alert('提示', '没有可清除的缓存');
              }
            } catch (error) {
              console.error('清除缓存失败:', error);
              Alert.alert('错误', '清除缓存失败');
            }
          }
        }
      ]
    );
  };
  
  const menuItems = [
    {
      icon: 'profile',
      title: '个人信息',
      onPress: () => navigation.navigate('EditProfile')
    },
    {
      icon: 'settings',
      title: '账户设置',
      onPress: () => navigation.navigate('AccountSettings')
    },
    {
      icon: 'notification',
      title: '消息通知',
      onPress: () => navigation.navigate('Notifications')
    },
    {
      icon: 'download',
      title: '我的下载',
      onPress: () => navigation.navigate('Downloads')
    },
    {
      icon: 'delete',
      title: '清除缓存',
      onPress: handleClearCache
    },
    {
      icon: 'logout',
      title: '退出登录',
      onPress: handleLogout,
      danger: true
    }
  ];
  
  return (
    <ScrollView style={styles.container}>
      {/* 用户信息头部 */}
      <View style={styles.header}>
        <View style={styles.userInfoContainer}>
          <Image source={{ uri: userImage }} style={styles.avatar} />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.userTitle}>{userPosition}</Text>
            <Text style={styles.userEmail}>{userEmail}</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.editProfileButton}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Text style={styles.editProfileButtonText}>编辑个人资料</Text>
        </TouchableOpacity>
      </View>
      
      {/* 设置选项 */}
      <View style={styles.settingsContainer}>
        <Text style={styles.sectionTitle}>应用设置</Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingLabelContainer}>
            <Icon name="notification" size={20} color="#333" style={styles.settingIcon} />
            <Text style={styles.settingLabel}>接收通知</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={toggleNotifications}
            trackColor={{ false: '#E0E0E0', true: '#2E7DF7' }}
            thumbColor="#FFFFFF"
          />
        </View>
        
        <View style={styles.settingRow}>
          <View style={styles.settingLabelContainer}>
            <Icon name="settings" size={20} color="#333" style={styles.settingIcon} />
            <Text style={styles.settingLabel}>深色模式</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={toggleDarkMode}
            trackColor={{ false: '#E0E0E0', true: '#2E7DF7' }}
            thumbColor="#FFFFFF"
          />
        </View>
        
        <View style={styles.settingRow}>
          <View style={styles.settingLabelContainer}>
            <Icon name="profile" size={20} color="#333" style={styles.settingIcon} />
            <Text style={styles.settingLabel}>Face ID登录</Text>
          </View>
          <Switch
            value={faceIdLogin}
            onValueChange={toggleFaceIdLogin}
            trackColor={{ false: '#E0E0E0', true: '#2E7DF7' }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>
      
      {/* 菜单选项 */}
      <View style={styles.menuContainer}>
        <Text style={styles.sectionTitle}>快捷菜单</Text>
        
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <View style={styles.menuItemLeft}>
              <Icon 
                name={item.icon} 
                size={20} 
                color={item.danger ? '#FF5252' : '#333333'} 
                style={styles.menuItemIcon} 
              />
              <Text style={[
                styles.menuItemText,
                item.danger && styles.dangerText
              ]}>
                {item.title}
              </Text>
            </View>
            <Icon name="arrow-right" size={16} color="#999999" />
          </TouchableOpacity>
        ))}
      </View>
      
      {/* 应用信息 */}
      <View style={styles.appInfoContainer}>
        <Text style={styles.appVersion}>版本 1.0.0</Text>
        <Text style={styles.appCopyright}>© 2023 工时与薪资管理</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  userTitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: '#999999',
  },
  editProfileButton: {
    backgroundColor: '#2E7DF7',
    borderRadius: 5,
    paddingVertical: 8,
    alignItems: 'center',
  },
  editProfileButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  settingsContainer: {
    backgroundColor: '#FFFFFF',
    marginTop: 15,
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 15,
    color: '#333333',
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    marginTop: 15,
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemIcon: {
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 15,
    color: '#333333',
  },
  dangerText: {
    color: '#FF5252',
  },
  appInfoContainer: {
    alignItems: 'center',
    padding: 20,
    marginTop: 15,
  },
  appVersion: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 4,
  },
  appCopyright: {
    fontSize: 12,
    color: '#999999',
  },
});

export default ProfileScreen; 
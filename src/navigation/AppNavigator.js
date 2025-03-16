import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { Icon } from '../utils/IconFont';

// 认证相关屏幕
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgetPasswordScreen from '../screens/auth/ForgetPasswordScreen';

// 主屏幕
import HomeScreen from '../screens/HomeScreen';
import TasksScreen from '../screens/tasks/TasksScreen';
import TaskDetailScreen from '../screens/tasks/TaskDetailScreen';
import SalaryScreen from '../screens/salary/SalaryScreen';
import SalaryDetailScreen from '../screens/salary/SalaryDetailScreen';
import StatsScreen from '../screens/stats/StatsScreen';

// 打卡与个人信息相关屏幕
import ClockInScreen from '../screens/attendance/ClockInScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// 认证栈
const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgetPassword" component={ForgetPasswordScreen} />
    </Stack.Navigator>
  );
};

// 主页栈
const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="HomeScreen" 
        component={HomeScreen} 
        options={{ title: '首页' }} 
      />
    </Stack.Navigator>
  );
};

// 任务栈
const TasksStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="TasksScreen" 
        component={TasksScreen} 
        options={{ title: '任务' }} 
      />
      <Stack.Screen 
        name="TaskDetail" 
        component={TaskDetailScreen} 
        options={{ title: '任务详情' }} 
      />
    </Stack.Navigator>
  );
};

// 薪资栈
const SalaryStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="SalaryScreen" 
        component={SalaryScreen} 
        options={{ title: '薪资' }} 
      />
      <Stack.Screen 
        name="SalaryDetail" 
        component={SalaryDetailScreen} 
        options={{ title: '薪资详情' }} 
      />
    </Stack.Navigator>
  );
};

// 统计栈
const StatsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="StatsScreen" 
        component={StatsScreen} 
        options={{ title: '统计' }} 
      />
    </Stack.Navigator>
  );
};

// 个人信息栈
const ProfileStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ProfileScreen" 
        component={ProfileScreen} 
        options={{ title: '我的' }} 
      />
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfileScreen} 
        options={{ title: '编辑个人资料' }} 
      />
      <Stack.Screen 
        name="ClockIn" 
        component={ClockInScreen} 
        options={{ title: '考勤打卡' }} 
      />
    </Stack.Navigator>
  );
};

// 主标签导航
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Tasks') {
            iconName = 'task';
          } else if (route.name === 'ClockIn') {
            iconName = 'clock';
          } else if (route.name === 'Salary') {
            iconName = 'salary';
          } else if (route.name === 'Stats') {
            iconName = 'stats';
          } else if (route.name === 'Profile') {
            iconName = 'profile';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2E7DF7',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStack} 
        options={{ 
          headerShown: false,
          title: '首页'
        }} 
      />
      <Tab.Screen 
        name="Tasks" 
        component={TasksStack} 
        options={{ 
          headerShown: false,
          title: '任务'
        }} 
      />
      <Tab.Screen 
        name="ClockIn" 
        component={ClockInScreen} 
        options={{ 
          title: '打卡',
          headerTitle: '考勤打卡'
        }} 
      />
      <Tab.Screen 
        name="Salary" 
        component={SalaryStack} 
        options={{ 
          headerShown: false,
          title: '薪资'
        }} 
      />
      <Tab.Screen 
        name="Stats" 
        component={StatsStack} 
        options={{ 
          headerShown: false,
          title: '统计'
        }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileStack} 
        options={{ 
          headerShown: false,
          title: '我的'
        }} 
      />
    </Tab.Navigator>
  );
};

// 主应用导航
const AppNavigator = () => {
  const { userToken } = useSelector(state => state.user);
  
  return (
    <NavigationContainer>
      {userToken ? <TabNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator; 
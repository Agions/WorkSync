import api from './api';

// 获取所有用户
export const getUsers = async () => {
  try {
    const users = await api.get('/users');
    // 为每个用户添加工资相关字段
    return users.map(user => ({
      ...user,
      baseSalary: 5000 + Math.floor(Math.random() * 5000),
      hourlyRate: 20 + Math.floor(Math.random() * 30),
      position: ['开发', '设计', '产品', '测试'][Math.floor(Math.random() * 4)]
    }));
  } catch (error) {
    console.error('获取用户列表失败:', error);
    throw error;
  }
};

// 获取单个用户
export const getUser = async (userId) => {
  try {
    const user = await api.get(`/users/${userId}`);
    // 添加工资相关字段
    return {
      ...user,
      baseSalary: 5000 + Math.floor(Math.random() * 5000),
      hourlyRate: 20 + Math.floor(Math.random() * 30),
      position: ['开发', '设计', '产品', '测试'][Math.floor(Math.random() * 4)]
    };
  } catch (error) {
    console.error('获取用户信息失败:', error);
    throw error;
  }
};

// 用户登录 (模拟)
export const login = async (username, password) => {
  try {
    // 在真实应用中，这里应该调用实际的登录API
    // 这里模拟登录过程
    const users = await getUsers();
    const user = users.find(u => u.username === username);
    
    if (user && password === 'password') { // 简化的密码验证
      return {
        success: true,
        user,
        token: 'mock-token-' + Date.now(),
      };
    } else {
      throw new Error('用户名或密码错误');
    }
  } catch (error) {
    console.error('登录失败:', error);
    throw error;
  }
};

// 更新用户信息
export const updateUser = async (userId, userData) => {
  try {
    return await api.put(`/users/${userId}`, userData);
  } catch (error) {
    console.error('更新用户信息失败:', error);
    throw error;
  }
}; 
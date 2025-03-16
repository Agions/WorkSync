import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile } from '../../redux/actions/userActions';
import { Icon } from '../../utils/IconFont';
import * as ImagePicker from 'expo-image-picker';

const EditProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { userInfo, loading, error } = useSelector(state => state.user);
  
  // 表单状态
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [position, setPosition] = useState('');
  const [department, setDepartment] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [bio, setBio] = useState('');
  
  // 初始化表单数据
  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name || '');
      setEmail(userInfo.email || '');
      setPhone(userInfo.phone || '');
      setPosition(userInfo.position || '');
      setDepartment(userInfo.department || '');
      setAvatar(userInfo.avatar || null);
      setBio(userInfo.bio || '');
    }
  }, [userInfo]);
  
  // 选择头像
  const handleSelectAvatar = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('需要权限', '请允许应用访问您的相册');
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.cancelled) {
        setAvatar(result.uri);
      }
    } catch (error) {
      console.error('选择头像错误:', error);
      Alert.alert('错误', '选择头像时出现问题');
    }
  };
  
  // 保存个人资料
  const handleSaveProfile = () => {
    if (!name.trim()) {
      Alert.alert('错误', '姓名不能为空');
      return;
    }
    
    if (!email.trim()) {
      Alert.alert('错误', '邮箱不能为空');
      return;
    }
    
    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('错误', '请输入有效的邮箱地址');
      return;
    }
    
    // 准备更新的数据
    const userData = {
      id: userInfo.id,
      name,
      email,
      phone,
      position,
      department,
      avatar,
      bio
    };
    
    // 发送更新请求
    dispatch(updateUserProfile(userData))
      .then(() => {
        navigation.goBack();
      })
      .catch(err => {
        Alert.alert('更新失败', err.message || '无法更新个人资料');
      });
  };
  
  // 表单项组件
  const FormItem = ({ label, value, onChangeText, placeholder, keyboardType, multiline, numberOfLines }) => (
    <View style={styles.formItem}>
      <Text style={styles.formLabel}>{label}</Text>
      <TextInput
        style={[
          styles.formInput,
          multiline && { height: numberOfLines * 20, textAlignVertical: 'top' }
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType || 'default'}
        multiline={multiline}
        numberOfLines={numberOfLines}
      />
    </View>
  );
  
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* 头像选择 */}
        <View style={styles.avatarContainer}>
          <TouchableOpacity onPress={handleSelectAvatar}>
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Icon name="profile" size={40} color="#CCCCCC" />
              </View>
            )}
            <View style={styles.editAvatarButton}>
              <Icon name="edit" size={16} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          <Text style={styles.avatarText}>更换头像</Text>
        </View>
        
        {/* 表单内容 */}
        <View style={styles.formContainer}>
          <FormItem
            label="姓名"
            value={name}
            onChangeText={setName}
            placeholder="请输入您的姓名"
          />
          
          <FormItem
            label="邮箱"
            value={email}
            onChangeText={setEmail}
            placeholder="请输入您的邮箱"
            keyboardType="email-address"
          />
          
          <FormItem
            label="手机号码"
            value={phone}
            onChangeText={setPhone}
            placeholder="请输入您的手机号码"
            keyboardType="phone-pad"
          />
          
          <FormItem
            label="职位"
            value={position}
            onChangeText={setPosition}
            placeholder="请输入您的职位"
          />
          
          <FormItem
            label="部门"
            value={department}
            onChangeText={setDepartment}
            placeholder="请输入您的部门"
          />
          
          <FormItem
            label="个人简介"
            value={bio}
            onChangeText={setBio}
            placeholder="请输入您的个人简介"
            multiline={true}
            numberOfLines={5}
          />
        </View>
      </ScrollView>
      
      {/* 底部保存按钮 */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>取消</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveProfile}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.saveButtonText}>保存</Text>
          )}
        </TouchableOpacity>
      </View>
      
      {/* 错误提示 */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollView: {
    flex: 1,
  },
  avatarContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  editAvatarButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#2E7DF7',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  avatarText: {
    marginTop: 10,
    fontSize: 14,
    color: '#2E7DF7',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    marginTop: 15,
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 80, // 为底部按钮留出空间
  },
  formItem: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 8,
  },
  formInput: {
    height: 44,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#333333',
    backgroundColor: '#FAFAFA',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  cancelButton: {
    flex: 1,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#666666',
    fontSize: 14,
    fontWeight: '500',
  },
  saveButton: {
    flex: 1,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2E7DF7',
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  errorContainer: {
    backgroundColor: '#FFF2F2',
    padding: 10,
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFD7D7',
  },
  errorText: {
    color: '#FF5252',
    fontSize: 14,
  },
});

export default EditProfileScreen; 
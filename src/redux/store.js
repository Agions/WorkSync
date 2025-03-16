import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import rootReducer from './reducers';

// 配置持久化存储
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['user'] // 只持久化user reducer
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// 创建store
export const store = createStore(
  persistedReducer,
  applyMiddleware(thunk)
);

export const persistor = persistStore(store); 
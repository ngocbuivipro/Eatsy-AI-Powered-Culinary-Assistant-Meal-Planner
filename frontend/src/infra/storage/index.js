// src/infra/storage/index.js
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Local storage wrapper.
 * TODO: Install @react-native-async-storage/async-storage
 */
export async function getItem(key) {
  try {
    return await AsyncStorage.getItem(key);
  } catch {
    return null;
  }
}

export async function setItem(key, value) {
  try {
    await AsyncStorage.setItem(key, value);
  } catch {
    // TODO: handle error
  }
}

export async function removeItem(key) {
  try {
    await AsyncStorage.removeItem(key);
  } catch {
    // TODO: handle error
  }
}

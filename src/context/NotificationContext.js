import React, { createContext, useState, useEffect, useCallback, useContext, useRef } from 'react';
import { Audio } from 'expo-av';
import { getOrders } from '../api/ordersApi';
import { AuthContext } from './AuthContext';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [pendingCount, setPendingCount] = useState(0);
  const soundRef = useRef(null);
  const isInitialized = useRef(false);

  // sound loading
  const loadSound = async () => {
    try {
      // Check if sound file exists or use default
      // Ideally we bundle a sound. For now, try to load.
      // If fails, we just log and skip sound.
      const { sound } = await Audio.Sound.createAsync(
         // Placeholder: user needs to add 'notification.mp3' to assets/sounds/
         // If missing, this throws, caught below.
         require('../../assets/sounds/notification.mp3') 
      );
      soundRef.current = sound;
    } catch (error) {
      console.log('Notification Sound not loaded (file missing?):', error);
    }
  };

  useEffect(() => {
    loadSound();
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const playSound = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.replayAsync();
      }
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  };

  const checkOrders = useCallback(async () => {
      if (!user) return;

      try {
          const orders = await getOrders();
          if (!orders) return;

          const currentPending = orders.filter(
              o => o.status === 'pending' || o.status === 'قيد الانتظار'
          ).length;

          if (isInitialized.current) {
              // Only alert on increase
              if (currentPending > pendingCount) {
                  await playSound();
              }
          } else {
              isInitialized.current = true;
          }
          
          setPendingCount(currentPending);
      } catch (error) {
          console.error('Error checking orders:', error);
      }
  }, [user, pendingCount]);

  // Poll
  useEffect(() => {
    if (!user) return;

    checkOrders(); // Initial check

    const intervalId = setInterval(checkOrders, 30000); // 30s
    return () => clearInterval(intervalId);
  }, [user, checkOrders]);

  return (
    <NotificationContext.Provider value={{ pendingCount, checkOrders }}>
      {children}
    </NotificationContext.Provider>
  );
};

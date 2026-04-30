import React, { createContext, useState, useEffect, useCallback, useContext, useRef } from 'react';
import { Audio } from 'expo-av';
import { getOrders, getChatRequests } from '../api/ordersApi';
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
      // const { sound } = await Audio.Sound.createAsync(
      //    require('../../assets/sounds/notification.mp3') 
      // );
      // soundRef.current = sound;
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
          const ordersPromise = getOrders();
          let chatReqsPromise = Promise.resolve([]);
          
          if (user.store_name) {
              chatReqsPromise = getChatRequests();
          }

          const [orders, chatReqs] = await Promise.all([ordersPromise, chatReqsPromise]);

          let currentPending = 0;
          if (orders) {
              currentPending = orders.filter(
                  o => o.status === 'pending' || o.status === 'قيد الانتظار'
              ).length;
          }

          const chatReqsCount = chatReqs ? chatReqs.length : 0;
          const totalBadge = currentPending + chatReqsCount;

          if (isInitialized.current) {
              // Only alert on increase
              if (totalBadge > pendingCount) {
                  await playSound();
              }
          } else {
              isInitialized.current = true;
          }
          
          setPendingCount(totalBadge);
      } catch (error) {
          console.error('Error checking notifications:', error);
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

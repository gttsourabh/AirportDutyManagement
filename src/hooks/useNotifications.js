import {useEffect} from 'react';
import {requestNotificationPermission} from '../utils/notificationHandler';

export const useNotifications = () => {
  useEffect(() => {
    requestNotificationPermission();
  }, []);
};

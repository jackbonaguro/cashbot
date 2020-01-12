import firebase, {Notification} from "react-native-firebase";
import {addMessage, addNotification, incrementReceiveIndex} from "../actions";
import Api from "./api";
import KeyDerivation from "./keyderivation";

const initializeFCM = async (fcmToken, messageHandler, notificationHandler, callback) => {
  try {
    const res = await firebase.messaging().requestPermission();
    if (fcmToken) {
      const enabled = await firebase.messaging().hasPermission();
      if (!enabled) {
        try {
          await firebase.messaging().requestPermission();
        } catch (error) {
          console.error('FCM Permission Error', error);
        }
      }
      firebase.notifications().onNotificationDisplayed((notification: Notification) => {
        // Process your notification as required
        // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
      });

      let notificationListener = firebase.notifications().onNotification(notificationHandler);
      // Data message listener
      let messageListener = firebase.messaging().onMessage(messageHandler);

      callback(null, {
        notificationListener,
        messageListener,
        fcmToken
      });
    } else {
      callback(new Error('FCM Token not available'));
    }
  } catch (e) {
    callback(e);
  }
};

export default FCM = {
  initializeFirebase: (messageHandler, notificationHandler, callback) => {
    firebase.messaging().getToken().then((fcmToken) => {
      // if (Platform.OS === 'android') {
      initializeFCM(fcmToken, messageHandler, notificationHandler, callback);
      // }
    }).catch(callback);
  }
};

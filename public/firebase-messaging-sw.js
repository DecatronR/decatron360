importScripts(
  "https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyC5ACIyr1lpbw5asUP-J7l36uluaE1DyCA",
  authDomain: "decatron1-2b8cd.firebaseapp.com",
  projectId: "decatron1-2b8cd",
  storageBucket: "decatron1-2b8cd.firebasestorage.app",
  messagingSenderId: "581268509906",
  appId: "1:581268509906:web:8826b8c859fef88b5f090b",
  measurementId: "G-63YESCF8FF",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/logo.png",
    data: payload.data,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click for routing
self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  const route = event.notification.data?.route || "/";
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(function (clientList) {
        // If a window is already open, focus it and navigate
        for (const client of clientList) {
          if ("focus" in client) {
            client.focus();
            client.navigate(route);
            return;
          }
        }
        // Otherwise, open a new window
        if (clients.openWindow) {
          return clients.openWindow(route);
        }
      })
  );
});

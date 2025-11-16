importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: "AIzaSyA2z2kc7TxucHnp7ugVMK9_fXNZtNZIY8I",
  authDomain: "gireesha-clothes.firebaseapp.com",
  projectId: "gireesha-clothes",
  storageBucket: "gireesha-clothes.firebasestorage.app",
  messagingSenderId: "437590541362",
  appId: "1:437590541362:web:76a3bf2219e400642ba82b",
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  console.log('Background message received:', payload)
  const { title, body } = payload.notification || {}
  self.registration.showNotification(title || 'New Notification', {
    body: body || 'You have a new message',
    icon: '/favicon.ico',
  })
})

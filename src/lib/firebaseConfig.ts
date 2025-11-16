'use client'

import { initializeApp } from 'firebase/app'
import { getMessaging } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: "AIzaSyA2z2kc7TxucHnp7ugVMK9_fXNZtNZIY8I",
  authDomain: "gireesha-clothes.firebaseapp.com",
  projectId: "gireesha-clothes",
  storageBucket: "gireesha-clothes.firebasestorage.app",
  messagingSenderId: "437590541362",
  appId: "1:437590541362:web:76a3bf2219e400642ba82b",
}

let messagingInstance: any = null

export function getMessagingInstance() {
  if (typeof window === 'undefined') {
    return null
  }

  if (!messagingInstance) {
    try {
      const app = initializeApp(firebaseConfig)
      messagingInstance = getMessaging(app)
    } catch (error) {
      console.error('Failed to initialize Firebase:', error)
      return null
    }
  }

  return messagingInstance
}

const firebaseConfig = {

  apiKey: "SUA_API_KEY",

  authDomain: "SEU_AUTH_DOMAIN",

  projectId: "SEU_PROJECT_ID",

  storageBucket: "SEU_STORAGE",

  messagingSenderId: "SEU_SENDER_ID",

  appId: "SEU_APP_ID"

};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
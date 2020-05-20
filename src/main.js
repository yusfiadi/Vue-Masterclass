// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from '@/store'
import firebase from 'firebase'
import Appdate from '@/components/AppDate'

Vue.component('AppDate', Appdate)

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAyGw-e-AG7-pUaJFVje_aKqOwO-xGHlRQ",
  authDomain: "vue-forum-c6ce5.firebaseapp.com",
  databaseURL: "https://vue-forum-c6ce5.firebaseio.com",
  projectId: "vue-forum-c6ce5",
  storageBucket: "vue-forum-c6ce5.appspot.com",
  messagingSenderId: "561534354223",
  appId: "1:561534354223:web:efdbb0dbbcb39001dc17da",
  measurementId: "G-CV3EWLEQYZ"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App
  }
})

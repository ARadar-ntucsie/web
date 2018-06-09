// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import firebase from 'firebase/app';
import fireauth from 'firebase/auth';
import firestore from 'firebase/firestore';

import './normalize.css';

Vue.config.productionTip = false;

let app;
let config = {
    apiKey: "AIzaSyADHEFTMjGNLG5DQaRz13uGwp5ZleX5h_k",
    authDomain: "mppfinal-7c0d7.firebaseapp.com",
    databaseURL: "https://mppfinal-7c0d7.firebaseio.com",
    projectId: "mppfinal-7c0d7",
    storageBucket: "mppfinal-7c0d7.appspot.com",
    messagingSenderId: "147696194039"
}; firebase.initializeApp(config);

const settings = { timestampsInSnapshots: true };
firebase.firestore().settings(settings);


firebase.auth().onAuthStateChanged( (user) => {
    if (!app) { /* eslint-disable no-new */
        app = new Vue({
            el: '#app',
            template: '<App/>',
            components: { App },
            router
        });
    }
});


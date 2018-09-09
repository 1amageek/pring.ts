import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';

import * as Pring from '../../src/index';
import { config } from "../../test/config";
import firebase from 'firebase';
import 'firebase/firestore';

const app = firebase.initializeApp(config);
Pring.initialize(app.firestore(), firebase.firestore.FieldValue.serverTimestamp());

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');



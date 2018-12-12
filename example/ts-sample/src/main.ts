import Vue from 'vue';
import App from './App.vue';
import store from './store';

import * as Pring from '../../../src/index';
import { config } from '../../../test/config';
import firebase from 'firebase/app';

const app = firebase.initializeApp(config);
Pring.initialize(app.firestore());

Vue.config.productionTip = false;

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app');

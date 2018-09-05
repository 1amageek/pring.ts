<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from '../components/HelloWorld.vue'; // @ is an alias to /src
import firebase from 'firebase';
import { User } from '../models/user';
@Component({
  components: {
    HelloWorld,
  },
})
export default class Home extends Vue {

  public created() {
    const config = {
      apiKey: "AIzaSyDnt449K4ylMzkIK7WlJNVYDyao-XL64QA",
      authDomain: "salada-f825d.firebaseapp.com",
      databaseURL: "https://salada-f825d.firebaseio.com",
      projectId: "salada-f825d",
      storageBucket: "salada-f825d.appspot.com",
      messagingSenderId: "1066463947512",
    };
    const app = firebase.initializeApp(config);
  }
}
</script>

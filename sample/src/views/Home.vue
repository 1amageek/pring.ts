<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" v-on:click="addUser">
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from '../components/HelloWorld.vue'; // @ is an alias to /src
import firebase from 'firebase';
import 'firebase/firestore';
import * as Pring from '../../../src/index';
import { User } from '../models/user';

@Component({
  components: {
    HelloWorld,
  },
})
export default class Home extends Vue {

  public async addUser() {
    const user: User = new User()
    user.name = "@1amageek"
    await user.save()
  }
  
  public created() {
    const dataSource = User.query().dataSource(User)
    dataSource.on((snapshot, changes) => {

      switch (changes.type) {
        case "initial": {
          console.log(dataSource.documents)
          break
        }
        case "update": {
          console.log("insert", changes.insertions)
          console.log("change", changes.modifications)
          console.log("delete", changes.deletions)
          break
        }
        case "error": {
          break
        }
      }
    }).listen()
  }
}
</script>

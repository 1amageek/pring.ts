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
import 'firebase/firestore';
import * as Pring from '../../../src/index';
import { User } from '../models/user';

@Component({
  components: {
    HelloWorld,
  },
})
export default class Home extends Vue {

  public created() {
    
    const user: User = new User();
    // console.log(user);

    const dataSource = User.query().dataSource(User)

    dataSource.on((snapshot, changes) => {

      console.log(changes)
      console.log(dataSource.documents)
      dataSource.documents.forEach(doc => {
        console.log(doc);
      })

      // const user: User = dataSource.documents
      
      // console.log(user);

    }).listen()

  }
}
</script>

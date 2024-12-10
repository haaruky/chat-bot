<template>
  <div class="background-container">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import HelloWorld from './components/ChatBox.vue'

export default {


  name: 'App',
  components: {
    HelloWorld
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #f11c1c;
}

  .background-container{
  background-image: url('../src/assets/anonymous-hacker-data-breach-5k-6000x4004-7.jpg');
  background-size: cover; /* ou contain */
  background-repeat: no-repeat;
  background-position: center;
  width: 100%;
  height: 100vh; /* ou qualquer altura desejada */
  display: flex;
  justify-content: center;
  margin: -8px;

}
</style>

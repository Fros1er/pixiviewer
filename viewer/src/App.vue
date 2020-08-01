<template>
  <div id="app">
    <evaluateList/>
  </div>
</template>

<script>
import evaluateList from './components/evaluateList'

export default {
  name: 'App',
  components: {
    evaluateList
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

<template>
  <div>
    <h3>Welcome {{user.consumerName}}</h3>
  </div>
</template>
<script>
export default {
  data () {
    return {
      user: ''
    }
  },
  created () {
    const user = JSON.parse(window.sessionStorage.getItem('user'))
    this.user = user
  }
}
</script>

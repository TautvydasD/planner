<template>
  <div>
    Welcome to Planner app
  </div>
</template>

<script>

export default {
  name: 'Home',
  data() {
    return {
      lol: 0,
    };
  },
  created() {
    this.notifyMe();
  },
  methods: {
    async test() {
      const jwt = localStorage.getItem('jwt');
      console.log(jwt);
      const reqIns = this.$http.create({
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
      });
      const res = await reqIns.get('http://localhost:5000/api/v1/statistics');
      // const res = await reqIns.get('https://api.fitbit.com/1/user/7T787Y/devices.json');
      console.log(res);
    },
    async getProfile() {
      const jwt = localStorage.getItem('jwt');
      const reqIns = this.$http.create({
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
      });
      const res = await reqIns.get('http://localhost:5000/api/v1/fitbit/profile');
      console.log(res);
    },
    notifyMe() {
      this.lol += 1;
      if (!('Notification' in window)) {
        // alert('This browser does not support desktop notification');
      } else if (Notification.permission === 'granted') {
        // Let's check whether notification permissions have already been granted
        // If it's okay let's create a notification
        const notification = new Notification('Hi there!');
        console.log(notification);
      } else if (Notification.permission !== 'denied') {
        // Otherwise, we need to ask the user for permission
        Notification.requestPermission().then((permission) => {
          // If the user accepts, let's create a notification
          if (permission === 'granted') {
            const notification = new Notification('Hi there!');
            console.log(notification);
          }
        });
      }
    },
  },
};
</script>

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
    };
  },
  created() {
    this.notifyMe();
  },
  methods: {
    notifyMe() {
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

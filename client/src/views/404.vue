<template>
  <v-container>
    <v-layout
      row
      wrap
    >
      <v-flex
        class="center-items"
        xs12
      >
        <div>
          <h1 class="main-text">404</h1>
          <div>
            <img
              src="https://c.tenor.com/BP6xx49aA0AAAAAi/capoo-bugcat.gif"
              alt="bugcat"
            >
          </div>
          <h3>
            Page not found
          </h3>
          <div class="text-message">
            Uh oh! You're not supposed to be here.
          </div>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<style scoped>
.center-items {
  display: flex;
  justify-content: center;
  text-align: center;
}

h1, h3 {
  color: #1976d2;
}

h1 {
  font-size: 128pt;
  letter-spacing: .10em;
  height: 100px;
}

h3 {
  font-size: 32pt;
}

.text-message {
  font-size: 16pt;
}

img {
  height: 128px;
}

.main-text {
  animation: levitate 2s alternate infinite linear;
  display: inline-block;
}

@keyframes levitate {
  from {
    transform: translatey(.05em) scaley(.95);
  }
  to {
    transform: translatey(-.05em);
  }
}

</style>

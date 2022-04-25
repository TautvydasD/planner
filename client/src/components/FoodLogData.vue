<template>
  <v-container>
    <v-container class="d-flex">
      <h1 class="display-1 green--text">
        <v-icon
          color="green"
          large
        >
          mdi-food-apple-outline
        </v-icon>
        Food logging
      </h1>
      <v-spacer></v-spacer>
      <v-btn>
        Log food
      </v-btn>
    </v-container>
    <v-data-table
      :headers="[]"
      :items="[]"
    >
    </v-data-table>
  </v-container>
</template>

<template>
  <v-container>
    <!--
      /**
      * Author: Tautvydas Dikšas
      * Date: 2022-05-10
      * Path: src/views/Home
      *
      */
     -->
    <h1>
      Welcome to Planner app
    </h1>
    <v-row>
      <v-col
        cols="12"
        xs="12"
        sm="6"
      >
        <h2>
          Calendar information
        </h2>
        <div>
          Allows the user to plan their activities ahead and get information about their health
        </div>
      </v-col>
      <v-col
        cols="12"
        xs="12"
        sm="6"
      >
        <v-img src="../assets/calendar.png" />
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        xs="3"
        sm="3"
        offset="3"
      >
        <v-img
          src="../assets/heartRate.png"
        />
      </v-col>
      <v-col
        cols="12"
        xs="12"
        sm="6"
      >
        <h2>
          Activity health information (For fitbit users only)
        </h2>
        <div>
          Calendar allows user to check their heart rate during the
          activity they registered
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h2>
          Planner allows the user to create custom exercises and workouts
        </h2>
        <div>
          Much of the workouts and exercises can be managed to suit the users needs and goals
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        xs="12"
        sm="6"
      >
        <v-img src="../assets/exercises.png" />
      </v-col>
      <v-col
        cols="12"
        xs="12"
        sm="6"
      >
        <v-img src="../assets/workouts.png" />
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        xs="12"
        sm="6"
      >
        <h2>
          We allow coaches to talk with people
        </h2>
        <div>
          Our system is very simple, if you have questions that need to be
          answered by trained professionals, they can help to answer them
          if you just start the conversation with them.
        </div>
      </v-col>
      <v-col
        cols="12"
        xs="12"
        sm="6"
      >
        <v-img src="../assets/coaches.png" />
      </v-col>
    </v-row>
  </v-container>
</template>

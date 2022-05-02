<template>
  <v-dialog
    width="600"
  >
    <template #activator="{ on, attrs }">
      <slot
        v-if="custom"
        name="custom"
        :attrs="attrs"
        :on="on"
      />
      <v-card
        v-else
        v-bind="attrs"
        v-on="on"
        class="ma-2"
      >
        <v-img
          :src="exercise.images.length > 0
            ? exercise.images[0].image
            : require('../assets/genericExercise.png')"
          class="white--text align-end"
          gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
          height="250px"
        >
          <v-card-title>
            <div class="text-truncate">
              {{ exercise.name }}
            </div>
          </v-card-title>
        </v-img>
      </v-card>
    </template>
    <v-card>
      <v-card-title>
        <h1>{{ exercise.name }}</h1>
      </v-card-title>
      <div v-for="(value, key) in exercise" :key="key">
        <div v-if="key === 'description' || key === 'creation_date'
          || key ==='license_author'">
          <v-card-subtitle>
            <h2>{{ parseTitle(key) }}</h2>
          </v-card-subtitle>
          <v-card-text v-html="value" />
        </div>
        <div v-else-if="key === 'category' || key === 'equipment'
          || key === 'muscles' || key === 'muscles_secondary'">
          <v-card-subtitle>
            <h2>{{ parseTitle(key) }}</h2>
          </v-card-subtitle>
          <v-card-text>
            {{ parseSubtitle(value) }}
          </v-card-text>
        </div>
        <div v-else-if="key === 'images' && value.length > 0">
          <v-card-subtitle>
            <h2>{{ parseTitle(key) }}</h2>
          </v-card-subtitle>
          <v-card-text>
            <v-carousel>
              <v-carousel-item
                v-for="(imageObj, i) in value"
                :key="i"
              >
                <img
                  :src="imageObj.image"
                  alt=""
                  style="height:100%;width:100%"
                >
              </v-carousel-item>
            </v-carousel>
          </v-card-text>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    exercise: {
      type: Object,
    },
    custom: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    parseTitle(val) {
      return val.replace(/_/g, ' ').replace(/^./, val[0].toUpperCase());
    },
    parseSubtitle(val) {
      if (Array.isArray(val) && val.length > 0) {
        return val.map((o) => o.name).join(', ');
      }
      if (typeof val === 'object' && Object.keys(val).length > 0) {
        return val.name;
      }
      return '-';
    },
  },
};
</script>

<template>
  <v-container>
    <!--
      /**
        * Author: Tautvydas Dikšas
        * Date: 2022-05-10
        * Path: src/components/CardTable
        *
        */
     -->
    <div v-if="title">
      <v-divider style="margin-top: 12px;" />
      <h1 class="subheading grey--text my-3">
        {{ title }}
      </h1>
      <v-divider style="margin-bottom: 12px;" />
    </div>
    <v-data-iterator
      :items="rows"
      :items-per-page.sync="itemsPerPage"
      :page.sync="page"
      style="width: 100%"
      :sort-desc="sortDesc"
      :sort-by="sortBy.toLowerCase()"
      :search="search"
      hide-default-footer
    >
      <template #header>
        <v-toolbar
          color="primary"
          dark
          class="mb-1"
        >
          <v-text-field
            v-model="search"
            label="Search"
            prepend-inner-icon="mdi-magnify"
            clearable
            hide-details
            solo-inverted
          />
          <v-spacer></v-spacer>
          <!-- v-if="loaded" -->
          <v-btn-toggle
            v-model="sortDesc"
            mandatory
          >
            <v-btn
              large
              depressed
              color="blue"
              :value="false"
            >
              <v-icon>mdi-arrow-up</v-icon>
            </v-btn>
            <v-btn
              large
              depressed
              color="blue"
              :value="true"
            >
              <v-icon>mdi-arrow-down</v-icon>
            </v-btn>
          </v-btn-toggle>
        </v-toolbar>
      </template>
      <template #default="{ items }">
        <v-row v-if="loaded">
          <v-col
            v-for="(item, index) in items"
            :key="index"
            cols="12"
            xs="12"
            sm="6"
            md="4"
            lg="3"
          >
            <slot :item="item" />
          </v-col>
        </v-row>
        <v-row v-else>
          <v-col
            v-for="(_, index) in items"
            :key="`skeleton-${index}`"
            cols="12"
            xs="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-skeleton-loader
              type="card"
              elevation="2"
              class="ma-2"
            />
          </v-col>
        </v-row>
      </template>
      <template #footer>
        <v-toolbar
          dark
          color="primary"
          class="mb-1"
        >
          <span>Items per page:</span>
          <!-- v-if="loaded" -->
          <v-menu
            offset-y
          >
            <template #activator="{ on, attrs }">
              <v-btn
                outlined
                class="ml-2"
                v-bind="attrs"
                v-on="on"
              >
                {{ itemsPerPage }}
                <v-icon>mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(number, index) in itemsPerPageOptions"
                :key="index"
                @click="updateItemsPerPage(number)"
              >
                <v-list-item-title>{{ number }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-spacer></v-spacer>
          <!-- v-if="loaded && instances.length > 0" -->
          <v-pagination
            v-model="page"
            light
            color="#2196F3"
            :length="pageCount"
            total-visible="7"
            class="ma-4"
          />
        </v-toolbar>
      </template>
    </v-data-iterator>
  </v-container>
</template>
<script>

export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    instances: {
      type: [Array, Object],
      required: true,
    },
    sortBy: {
      type: String,
      default: 'name',
    },
    loaded: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      page: 1,
      search: '',
      itemsPerPage: 6,
      itemsPerPageOptions: [6, 12, 18],
      sortDesc: false,
    };
  },
  computed: {
    dataSource() {
      return this.loaded ? this.instances : [{}, {}, {}, {}, {}, {}];
    },
    rows() {
      if (Array.isArray(this.dataSource)) return this.dataSource;
      return Object.values(this.dataSource);
    },
    pageCount() {
      return Math.ceil(this.rows.length / this.itemsPerPage, 10);
    },
  },
  methods: {
    updateItemsPerPage(number) {
      this.itemsPerPage = number;
    },
  },
};
</script>

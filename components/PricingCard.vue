<template>
  <v-card class="pt-2 fill-height elevation-4" max-width="450px">
    <!-- {{ item }} -->
    <v-row justify="center" class="ma-8 flex-column" align="center" dense>
      <v-col>
        <v-card class="elevation-0 text-center">
          <v-icon size="50" :color="item.iconColor">{{ item.icon }}</v-icon>
        </v-card>
      </v-col>
      <v-col>
        <v-card class="elevation-0 text-center"
          ><span class="text-overline">{{ item.title }}</span></v-card
        >
      </v-col>
      <v-col>
        <v-card class="text-center elevation-0" justify-content="center">
          <span class="money"
            ><sup><span class="small-money">$</span></sup
            >{{ item.price }}
          </span>
          <br />
          <sub>/user/mo.</sub>
          <sub>+ initiation</sub>
        </v-card>
      </v-col>
    </v-row>

    <v-divider></v-divider>

    <v-row class="mt-4" no-gutters>
      <v-col style="text-align: center">
        <v-card tile class="fill-height pa-3 elevation-0 outlined">
          Number of users:
          <v-span class="font-weight-bold">
            {{ item.userCount }}
          </v-span>
        </v-card>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col v-if="item.title == 'Gold'" style="text-align: center">
        <v-card tile class="fill-height pa-3 elevation-0">
          Docket Views:
          <v-span :class="rowItemValue">
            10 cents each + 89 &#162; per download
          </v-span>
        </v-card>
      </v-col>
      <v-col v-else-if="item.title == 'Platinum'" style="text-align: center">
        <v-card tile class="fill-height pa-3 elevation-0">
          Docket Views:
          <v-span :class="rowItemValue">
            10 cents each + 79 &#162; per download
          </v-span>
        </v-card>
      </v-col>
      <v-col v-else style="text-align: center">
        <v-card tile class="fill-height pa-3 elevation-0">
          Docket Views:
          <v-span :class="rowItemValue">
            {{ item.docketViewsPerMonth }}
          </v-span>
        </v-card>
      </v-col>
    </v-row>

    <v-row no-gutters class="text-center mb-4" height="800">
      <v-col cols="12">
        <v-card class="pa-3 mt-4" tile>
          <v-span class="text-center text-overline">Features</v-span>
        </v-card>
      </v-col>
      <v-col style="text-align: center; my-4">
        <v-card
          v-for="feature in item.features"
          :key="feature"
          tile
          class="pa-3 elevation-0"
        >
          <v-span>
            <v-icon class="green--text text--lighten-3 mr-2"
              >mdi-check-outline</v-icon
            >
            {{ feature }}
          </v-span>
        </v-card>
      </v-col>
    </v-row>

    <v-divider></v-divider>

    <v-card class="fill-height elevation-0" height="100">
      <v-row align="center" style="height: 100%">
        <v-col sm="12" justify="end">
          <v-btn color="pink lighten-1" outlined class="white--text"
            >Buy Now!</v-btn
          >
        </v-col>
        <!-- <v-col cols="12"><v-icon>mdi-phone-classic</v-icon></v-col>
        <v-col cols="12" justify="start">
          <v-btn text color="pink lighten-1 mt-2" class="white--text"
            >Contact Sales (xxx) xxx - xxxx</v-btn
          >
        </v-col> -->
      </v-row>
    </v-card>
  </v-card>
</template>

<script>
export default {
  computed: {
    rowItemValue() {
      return {
        'font-weight-medium': true,
      }
    },
  },
  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {}
  },
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@700&display=swap');

.money {
  font-family: 'Roboto Slab', serif;
  font-weight: 700;
  font-size: 3.312rem;
  line-height: 1.15em;
}

.pricing small:first-child {
  position: relative;
  top: 0px;
}

.small-money {
  font-weight: 300;
  font-size: 1.3rem;
}
</style>
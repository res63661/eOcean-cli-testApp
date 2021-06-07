<template>
  <v-sheet class="grey lighten-5">
    <v-container fluid class="blue mx-auto">
      <v-row style="height: 200px">
        <v-col height="500"></v-col>
      </v-row>
    </v-container>
    <v-container class="py-8">
      <v-row>
        <v-col
          v-for="item in pricingItems"
          :key="item.title"
          style="text-align: -webkit-center"
          cols="12"
          sm="12"
          md="4"
        >
          <pricing-card :item="item"></pricing-card>
        </v-col>
      </v-row>
    </v-container>
    <v-container fluid class="blue mx-auto">
      <v-row style="height: 200px">
        <v-col height="500"></v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<script>
import PricingCard from '~/components/PricingCard.vue'
export default {
  components: { PricingCard },
  data() {
    return {
      pricingItems: [
        {
          title: 'Gold',
          iconColor: 'yellow',
          icon: 'mdi-license',
          price: '30',
          userCount: '1-5',
          docketViewsPerMonth: '10 cents each + 89&#162 per download',
          features: [
            'Business Intelligence',
            'Insights Dashboard',
            'BK Genius',
          ],
        },
        {
          title: 'Platinum',
          iconColor: 'grey',
          icon: 'mdi-account-group',
          price: '30',
          userCount: '1-20',
          docketViewsPerMonth: ' 10 cents each + 89 &#162; per download',
          features: [
            'Business Intelligence',
            'Insights Dashboard',
            'BK Genius',
          ],
        },
        {
          title: 'Enterprise',
          iconColor: 'blue',
          icon: 'mdi-domain',
          userCount: 'Call',
          price: '25',
          docketViewsPerMonth: 'Unlimited',
          features: [
            'Business Intelligence',
            'Insights Dashboard',
            'BK Genius',
            'API',
          ],
        },
      ],
    }
  },
}
</script>

<style>
</style>
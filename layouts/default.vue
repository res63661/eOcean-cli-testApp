<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <!-- Allroutes: {{ allRoutes }} -->
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>

        <!-- BEGIN ALL ROUTES -->
        <v-list-group no-action>
          <template v-slot:activator>
            <v-list-item-icon>
              <v-icon>mdi-wizard-hat</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>All Routes</v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item
            v-for="route in allRoutes"
            :key="route.title"
            :to="route.path"
          >
            <v-list-item-action>
              <v-icon>{{ route.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="route.name" />
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
        <!-- END ALL ROUTES -->
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-btn icon @click.stop="clipped = !clipped">
        <v-icon>mdi-application</v-icon>
      </v-btn>
      <v-btn icon @click.stop="fixed = !fixed">
        <v-icon>mdi-minus</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-switch v-model="showDevControls"> </v-switch>
      <c-login></c-login>
      <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed>
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light> mdi-repeat </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import CLogin from '~/components/CLogin.vue'
import { mapGetters } from 'vuex'

export default {
  mounted() {
    this.$nextTick(function () {
      // Code that will run only after the
      // entire view has been rendered

      //refresh all routes
      this.$store.dispatch('SAuth/allRoutes', this.$router).then((routes) => {
        //Add each route to our list of routes.
        // if (!routes) return
        // routes.map((route) => {
        //   this.items.push({
        //     icon: route.icon,
        //     to: route.path,
        //     title: route.name,
        //   })
        // })
      })
    })
  },
  computed: {
    ...mapGetters({
      allRoutes: 'SAuth/allRoutes',
    }),
    showDevControls: {
      get() {
        return this.$store.getters['SSys/showDevControls']
      },
      set(value) {
        this.$store.dispatch('SSys/showDevControls', value)
      },
    },
  },
  components: { CLogin },
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/',
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire',
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js',
    }
  },
}
</script>

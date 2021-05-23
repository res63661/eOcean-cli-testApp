<template>
  <v-menu bottom min-width="200px" rounded offset-y>
    <template v-slot:activator="{ on }">
      <v-btn icon v-on="on">
        <v-avatar size="36">
          <v-img v-if="me && me.picture" :src="me.picture"></v-img>
          <span v-else-if="me" class="white--text headline">{{
            me.name ? me.name.substr(0, 1) : ''
          }}</span>
        </v-avatar>
      </v-btn>
    </template>
    <v-card>
      <v-list-item-content class="justify-center">
        <div class="mx-auto text-center">
          <v-icon>mdi-email-variant</v-icon>
          <h3>{{ me.fullName }}</h3>
          <p class="caption mt-1">
            {{ me.email }}
          </p>
          <v-divider class="my-3"></v-divider>
          <v-btn
            title="My Profile"
            depressed
            text
            @click="$store.dispatch('SAuth/doLogout')"
          >
            <v-icon>mdi-account-circle-outline</v-icon>
          </v-btn>
          <v-divider class="my-3"></v-divider>
          <v-btn depressed text @click="$store.dispatch('SAuth/doLogout')">
            Logout
          </v-btn>
        </div>
      </v-list-item-content>
    </v-card>
  </v-menu>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({ isLoggedIn: 'SAuth/isLoggedIn', me: 'SAuth/me' }),
  },
  data() {
    return {
      dialog: null,
    }
  },
}
</script>

<style>
</style>
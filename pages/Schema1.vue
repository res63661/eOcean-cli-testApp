<template>
  <v-container>
    <Schema1_CRUD :light="true"></Schema1_CRUD>

    <v-row>
      <v-col cols="12">
        <v-container fluid>
          <Schema1_CRUD :light="true"></Schema1_CRUD>
        </v-container>
      </v-col>
    </v-row>

    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <Schema1_CRUD :light="true"></Schema1_CRUD>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Schema1_CRUD from '~/components/EOGenerated/Schema1_CRUD.vue'

export default {
  components: {
    Schema1_CRUD,
  },
}
</script>

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

    <Mystore_CRUD :light="true"></Mystore_CRUD>

    <mystore></mystore>
  </v-container>
</template>

<script>
import mystore from '~/components/EOGenerated/mystore8_CRUD.vue'
import Mystore_CRUD from '~/components/EOGenerated/mystore_CRUD.vue'
import Schema1_CRUD from '~/components/EOGenerated/Schema1_CRUD.vue'

export default {
  components: {
    Schema1_CRUD,
    Mystore_CRUD,
    mystore,
  },
}
</script>

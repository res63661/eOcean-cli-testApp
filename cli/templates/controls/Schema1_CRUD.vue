<template>
  <v-card :light="light ? light : dark">
    Schema 1 CRUD

    {{ $data }}
    Selected id : {{ selectedId }}
    <div class="masterList">
      <v-container>
        <v-row>
          <v-col>
            <v-data-table
              dense
              :headers="headers"
              :items="all"
              class="elevation-1"
              @click:row="rowClick"
              item-key="id"
              single-select
            ></v-data-table>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <div class="selectedItem">
      <v-container>
        <v-row v-for="item in schemaDsiplayDefinition" :key="item.fieldName">
          <v-col>{{ item.fieldName }}</v-col>
          <v-col>
            <v-text-field
              v-if="selectedItem"
              :value="selectedItem[item.fieldName]"
              @input="updateItem(item, selectedItem.id, $event)"
              label="Regular"
              clearable
            ></v-text-field
          ></v-col>
        </v-row>
      </v-container>
    </div>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    light: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    updateItem(fieldDef, id, e) {
      this.$store.dispatch('Schema1/update', { fieldDef, id: id, newValue: e })
    },
    rowClick: function (item, row) {
      row.select(true)
      this.selectedId = item.id
      this.selectedItem = item
    },
  },

  computed: {
    ...mapGetters({
      schemaDsiplayDefinition: 'Schema1/schemaDsiplayDefinition',
      all: 'Schema1/all',
    }),
    comp() {
      return this.$store.getters['Schema1/schemaDsiplayDefinition']
    },
    headers() {
      if (!this.schemaDsiplayDefinition) {
        return []
      }

      return this.schemaDsiplayDefinition.map((col) => {
        return {
          text: col.fieldName,
          value: col.fieldName,
        }
      })
    },
  },
  data() {
    return {
      selectedItem: null,
      selectedId: null,
    }
  },
}
</script>

<style lang="scss">
tr.v-data-table__selected {
  background: $selected-row-color !important; /**Simply run npm install --save-dev node-sass sass-loader then set your vars in /assets/variables.scss (from https://medium.com/@wearethreebears/globally-accessible-css-and-scss-sass-in-your-nuxt-component-files-7c1c012d31bd) */
}
</style>
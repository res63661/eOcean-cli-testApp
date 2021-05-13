<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card :light="light ? light : dark">
          Schema 1 CRUD

          {{ $data }}
          <br />
          Selected id : {{ selectedId }}
          <br />
          All: {{ all }}
          <br />
          Headers: {{ computeHeaders }}
          <div class="masterList">
            <v-container>
              <v-row>
                <v-col>
                  <v-data-table
                    dense
                    :headers="computeHeaders"
                    :items="all"
                    class="elevation-1"
                    @click:row="rowClick"
                    item-key="id"
                    single-select
                  >
                    <template v-slot:top>
                      <v-text-field
                        class="mx-4"
                        prepend-icon="mdi-magnify"
                        label="Search table"
                        v-model="search"
                      ></v-text-field>
                    </template>

                    <!-- This template looks for headers with formatters and executes them -->
                    <template
                      v-for="header in computeHeaders"
                      v-slot:[`item.${header.value}`]="{ header, value }"
                    >
                      {{ formatCell(value) }}
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
            </v-container>
          </div>

          <div class="selectedItem">
            <v-container>
              <v-row v-for="item in selectedItem" :key="item.fieldName">
                <v-col>
                  <v-row>
                    <v-col> {{ item.fieldName }} </v-col>
                    <v-col
                      v-if="
                        selectedItem &&
                        !Array.isArray(selectedItem[item.fieldName])
                      "
                    >
                      <v-text-field
                        v-if="selectedItem"
                        :value="selectedItem[item.fieldName]"
                        @input="updateItem(item, selectedItem.id, $event)"
                        label="Regular"
                        clearable
                      ></v-text-field>
                    </v-col>
                    <v-col v-else>
                      <v-row>
                        <v-col> {{ formatCell(selectedItem) }} </v-col>
                        <v-col cols="2">
                          <v-switch
                            v-model="
                              arrayEditToggle[
                                computeArrayId(item, selectedItem)
                              ]
                            "
                            >Edit</v-switch
                          >
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>

                  <v-expand-transition>
                    <v-row
                      v-if="
                        selectedItem &&
                        Array.isArray(selectedItem[item.fieldName]) &&
                        arrayEditToggle[computeArrayId(item, selectedItem)]
                      "
                    >
                      <v-col class="tile blue ma-2 rounded elevation-12">
                        <ArrayEditor
                          v-if="selectedItem"
                          :value="selectedItem[item.fieldName]"
                        ></ArrayEditor>
                      </v-col>
                    </v-row>
                  </v-expand-transition>
                  <!--<v-row>
                    <v-col>{{ item.fieldName }}</v-col>
                   <v-col
                      v-if="
                        selectedItem &&
                        !Array.isArray(selectedItem[item.fieldName])
                      "
                    >
                      <v-text-field
                        v-if="selectedItem"
                        :value="selectedItem[item.fieldName]"
                        @input="updateItem(item, selectedItem.id, $event)"
                        label="Regular"
                        clearable
                      ></v-text-field
                    ></v-col>
                  </v-row>
                  <v-row v-if="Array.isArray(selectedItem[item.fieldName])">
                    <v-col>
                      <ArrayEditor
                        v-if="selectedItem"
                        :value="selectedItem[item.fieldName]"
                      ></ArrayEditor
                    ></v-col>
                  </v-row> -->
                </v-col>
              </v-row>
            </v-container>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  computed: {
    computeHeaders() {
      if (!this.all) return []
      if (this.all.length === 0) return []
      const computeAllHeaders = (all) => {
        /**Loop all values in all getting distinct list of object keys as the headers array */
        //For now just use 1st item.

        return Object.keys(all[0]).map((key) => ({ text: key, value: key }))
      }

      return computeAllHeaders(this.all)
    },
  },
  methods: {
    formatCell(value) {
      console.log(value)
      if (Array.isArray(value)) {
        return `Array: length(${value.length})`
      }

      return value
    },
    rowClick: function (item, row) {
      row.select(true)
      this.selectedId = item.id
      this.selectedItem = item
    },
  },
  props: {
    all: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      search: null,
      selectedItem: null,
      selectedId: null,
    }
  },
}
</script>

<style>
</style>
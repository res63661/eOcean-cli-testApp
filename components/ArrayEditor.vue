<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-card v-if="$store.getters['SSys/showDevControls']">
            {{ $data }}
            <br />
            Selected id : {{ selectedId }}
            <br />
            All: {{ all }}
            <br />
            Headers: {{ computeHeaders }}
            <br />
            Selected item: {{ selectedItem }}
            <br />
            ArrayEditor Value: {{ value }}
            <br />
            schemaDisplayDefinition: {{ schemaDisplayDefinition }}
            <br />
            allSubtreeAddress: {{ allSubtreeAddress }}
          </v-card>

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
                      <v-toolbar flat>
                        <v-text-field
                          class="mx-4"
                          prepend-icon="mdi-magnify"
                          label="Search table"
                          v-model="search"
                        ></v-text-field>
                        <v-divider class="mx-4" inset vertical></v-divider>
                        <v-spacer></v-spacer>
                        <v-btn icon @click="addNew"
                          ><v-icon>mdi-plus</v-icon></v-btn
                        >
                      </v-toolbar>
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
              <v-row
                v-for="item in schemaDisplayDefinition"
                :key="item.fieldName"
              >
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
                        <v-col>
                          {{ formatArrayCellDescription(selectedItem, item) }}
                        </v-col>
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
                          :schemaDisplayDefinition="item.childDisplaySchema"
                          :all="
                            selectedItem ? selectedItem[item.fieldName] : null
                          "
                          :allSubtreeAddress="
                            computeSelectedSubtree(selectedItem, item.fieldName)
                          "
                        ></ArrayEditor>
                      </v-col>
                    </v-row>
                  </v-expand-transition>
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
    computeSelectedSubtree(selectedItem, fieldName) {
      return (selectedItem, fieldName) => {
        if (this.allSubtreeAddress) {
          const newSubtreeAddress = [...this.allSubtreeAddress]
          newSubtreeAddress.push({ id: selectedItem.id, fieldName })
          return newSubtreeAddress
        } else {
          return [{ id: selectedItem.id, fieldName }]
        }
      }
    },

    computeHeaders() {
      if (!this.all) return []
      if (this.all.length === 0) return []
      const computeAllHeaders = (all) => {
        /**Loop all values in all getting distinct list of object keys as the headers array */
        //For now just use 1st item.

        return Object.keys(all[0]).map((key) => ({ text: key, value: key }))
      }

      this.computedHeaders = computeAllHeaders(this.all)
      return this.computedHeaders
    },
  },
  methods: {
    getNextId() {
      /***Compute hightest id from all list and add one. */
      if (!this.all) {
        this.all = []
        return 1
      }

      return this.all.sort((a, b) => a - b)[this.all.length - 1].id + 1
    },
    addNew() {
      /**Given our schema, add new item to array with default values. */
      this.$store.dispatch('SMeetingSeries/add', {
        subtreeAddress: this.allSubtreeAddress,
        schemaDefinition: this.schemaDisplayDefinition,
      })
    },
    updateItem(fieldDef, id, e) {
      this.$store.dispatch('SMeetingSeries/update', {
        fieldDef,
        id: id,
        newValue: e,
        subtreeAddress: this.allSubtreeAddress,
        schemaDefinition: this.schemaDisplayDefinition,
      })
    },
    formatArrayCellDescription(selectedItem, item) {
      if (!selectedItem) return ''
      if (!item) return ''

      return selectedItem[item.fieldName]
    },
    computeArrayId(item, selectedItem) {
      return (selectedItem ? selectedItem.id : 'noId') + item.fieldName
      //return selectedItem ? selectedItem.id : 0
    },
    formatCell(value) {
      if (!value) return null

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
    schemaDisplayDefinition: {
      type: Array,
      default: () => [],
    },
    /**Use this to track where in the all subtree we are. */
    allSubtreeAddress: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      search: null,
      selectedItem: null,
      selectedId: null,
      arrayEditToggle: {},
      computedHeaders: null,
    }
  },
}
</script>

<style>
</style>
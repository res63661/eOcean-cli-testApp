<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card flat>
          <v-card-title>{{ capCase(title) }}</v-card-title>
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
                        <v-spacer></v-spacer>

                        <v-slide-x-reverse-transition>
                          <div v-if="showSearch">
                            <v-text-field
                              class="mt-4"
                              label="Search"
                              v-model="search"
                            ></v-text-field>
                          </div>
                        </v-slide-x-reverse-transition>

                        <v-btn icon @click="showSearch = !showSearch"
                          ><v-icon>mdi-magnify</v-icon></v-btn
                        >
                        <v-btn icon @click="doSave"
                          ><v-icon>mdi-content-save-outline</v-icon></v-btn
                        >
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

                    <template v-slot:item.actions="{ item }">
                      <v-icon small class="mr-2"> mdi-pencil </v-icon>
                      <v-icon small> mdi-delete @click="doDelete(item)"</v-icon>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
            </v-container>
          </div>
          <v-expand-transition>
            <div class="selectedItem" v-if="selectedItem">
              <v-container>
                <v-row
                  no-gutters
                  v-if="
                    !schemaDisplayDefinition ||
                    schemaDisplayDefinition.length == 0
                  "
                  justify="center"
                  class="text-center"
                  ><v-col
                    ><span class="warning--text text-h5"
                      >Missing schemaDisplayDefinition</span
                    ></v-col
                  ></v-row
                >
                <v-row
                  class="mx-2"
                  no-gutters
                  v-else
                  v-for="item in schemaDisplayDefinition"
                  :key="item.fieldName"
                >
                  <v-col>
                    <v-row align="center" no-gutters>
                      <v-col> {{ capCase(item.fieldName) }} </v-col>
                      <v-col
                        v-if="
                          selectedItem &&
                          !Array.isArray(selectedItem[item.fieldName])
                        "
                      >
                        <!-- TEXT TYPE -->
                        <v-text-field
                          v-if="selectedItem && item.type == 'text-field'"
                          :value="selectedItem[item.fieldName]"
                          @input="updateItem(item, selectedItem.id, $event)"
                          label="Regular"
                          clearable
                        ></v-text-field>

                        <!-- DATE TYPE -->
                        <v-menu
                          v-else-if="selectedItem && item.type == 'date'"
                          v-model="menu2"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          transition="scale-transition"
                          offset-y
                          min-width="auto"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="selectedItem[item.fieldName]"
                              label="Picker without buttons"
                              prepend-icon="mdi-calendar"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            :value="selectedItem[item.fieldName]"
                            @change="updateItem(item, selectedItem.id, $event)"
                            @input="menu2 = false"
                          ></v-date-picker>
                        </v-menu>

                        <!-- DEFAULT TYPE -->
                        <v-text-field
                          v-else
                          :value="selectedItem[item.fieldName]"
                          @input="updateItem(item, selectedItem.id, $event)"
                          label="Regular"
                          clearable
                        ></v-text-field>
                      </v-col>
                      <v-col v-else>
                        <v-row align="center" no-gutters>
                          <v-col>
                            {{ formatArrayCellDescription(selectedItem, item) }}
                          </v-col>
                          <v-col>
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
                        no-gutters
                        v-if="
                          selectedItem &&
                          Array.isArray(selectedItem[item.fieldName]) &&
                          arrayEditToggle[computeArrayId(item, selectedItem)]
                        "
                      >
                        <v-col
                          class="
                            tile
                            ma-2
                            arrayEditorSurround
                            rounded
                            elevation-3
                            grey
                            lighten-2
                          "
                          color="arrayEditorSurround"
                        >
                          <ArrayEditor
                            v-if="selectedItem"
                            :schemaDisplayDefinition="item.childDisplaySchema"
                            :all="
                              selectedItem ? selectedItem[item.fieldName] : null
                            "
                            :allSubtreeAddress="
                              computeSelectedSubtree(
                                selectedItem,
                                item.fieldName
                              )
                            "
                            :title="item ? item.fieldName : ''"
                          ></ArrayEditor>
                        </v-col>
                      </v-row>
                    </v-expand-transition>
                  </v-col>
                </v-row>
              </v-container>
            </div>
          </v-expand-transition>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { capitalCase } from 'capital-case'

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

        const fields = Object.keys(all[0]).map((key) => ({
          text: capitalCase(key),
          value: key,
        }))
        return [
          ...fields,
          { text: 'Actions', value: 'actions', sortable: false },
        ]
      }

      this.computedHeaders = computeAllHeaders(this.all)
      return this.computedHeaders
    },
  },
  methods: {
    doSave() {
      //Save all on store
      this.$store.dispatch('SMeetingSeries/save')
    },
    doDelete(item) {
      this.$store.dispatch('SMeetingSeries/delete')
    },
    capCase(value) {
      return capitalCase(value)
    },
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

      //return selectedItem[item.fieldName]
      const v = selectedItem[item.fieldName]
      return `Array: [${v.length}]`
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

      // // const retval = value ? capitalCase(value.toString()) : value
      // // console.log('Header: ', retval)
      // // return retval
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
    title: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      menu2: false,
      showSearch: true,
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
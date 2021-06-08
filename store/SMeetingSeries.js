/**
 *    Store: SMeetingSeries
 *    Description: A meeting series contains all meeting objects for a defined 'series'
 *
 *
 *  **THIS CODE WAS GENERATED BY A TOOL**
 * **eOcean vue nuxt generator
 *
 * This is an implementation of a simple generic store to provide
 * -CRUD
 * -get all
 * -search
 *
 * for a single dto (Schema1 in this case).
 * A test data json file is used to spoof a database for now but this would be
 * easily replaced by a mongo api/db.
 */

import displayDef from '@/store/display-schemas/SMeetingSeries.json'

export const state = () => ({
  schemaDisplayDefinition: displayDef,
  selectedMeetingSeries: 'eOcean Data', //Currently selected meetingSeries from all
  selectedMeeting: 'eOcean Data', //Currently selected meeting from the selectedMeetingSeries
  all: [
    {
      id: 1,
      meetingName: 'System X Scrum',
      frequency: 'every weekday',
      required: [
        { id: 3, email: 'kcarlson@rascrane.com', name: 'Kurt' },
        { id: 4, email: 'richard@eoceandata.com', name: 'Richard' },
      ],
      meetings: [
        {
          id: 1,
          dateOfMeeting: '1/1/2021',
          actionItems: [
            {
              id: 1,
              who: 'Kurt',
              what: 'get Rich accesssss',
              dueBy: '5/5/2021',
            },
          ],
        },
      ],
    },
    {
      id: 2,
      meetingName: 'Weekly',
      frequency: 'every Tuesday',
      required: [
        { id: 1, email: 'jsmith@estringsoftware.com', name: 'John Smith' },
        { id: 2, email: 'richard@eoceandata.com', name: 'Richard Strickland' },
      ],
      meetings: [
        {
          id: 1,
          dateOfMeeting: '1/5/2021',
          actionItems: [
            { id: 1, who: 'Rich', what: 'build an app', dueBy: '3/5/2021' },
          ],
        },
      ],
    },
  ], //Array of all meetingSeries objects for the org
})

export const getters = {
  schemaDisplayDefinition: (state) => state.schemaDisplayDefinition,
  selectedMeetingSeries: (state) => state.selectedMeetingSeries, //Currently selected meetingSeries from all
  selectedMeeting: (state) => state.selectedMeeting, //Currently selected meeting from the selectedMeetingSeries
  all: (state) => state.all, //Array of all meetingSeries objects for the org
}

export const actions = {
  update(ctx, data) {
    const updateLevel0 = (ctx, data) => {
      //FInd data in all by id then update.
      const hits = ctx.state.all.filter((f) => f.id == data.id)
      if (!hits)
        throw `Error: found 0 hits in all data collection for id (${data.id})`
      if (hits.length > 1)
        throw `Error: found multiple id's in all data collection for id (${data.id})`

      //Update data in all data for hit and fire mutation
      ctx.commit('update', { dataToUpdate: hits[0], newData: data })
    }

    if (!data.parentFieldName) {
      updateLevel0(ctx, data)
    } else {
      ctx.commit('updateNestedChild', data)
    }
  },
  /*moves meeting playhead fwd one meeting*/
  advanceMeetingPlayhead: (ctx, value) => {},

  add: (ctx, addInfo) => {
    ctx.commit('add', addInfo)
  },
}

export const mutations = {
  schemaDisplayDefinition: (state, value) =>
    (state.schemaDisplayDefinition = value),
  update(state, data) {
    data.dataToUpdate[data.newData.fieldDef.fieldName] = data.newData.newValue
  },
  updateNestedChild(state, data) {
    const updateLevelN = (state, data) => {
      const levels = data.parentFieldName.split('/')
      let currentObject = state.all
      let root
      for (let n = 0; n < levels.length; n++) {
        const levelToken = levels[n]

        /**Using level token
         * -if numeric then construe as an index lookup on current object
         * -if not numeric then construe as a property name on current object
         */
        //If we're at end of list then use this final token as setter
        if (n == levels.length - 1) {
          currentObject[levelToken] = data.newValue
        } else {
          if (!isNaN(levelToken)) {
            //Is numeric so do lookup on current object id using levelToken as id.
            const hit = currentObject.find((o) => o.id == levelToken)
            if (hit) {
              currentObject = hit
            }
          } else {
            currentObject = currentObject[levelToken]
          }
        }
      }
    }

    updateLevelN(state, data)
  },
  add(state, addInfo) {
    /**Using the given subtree as an address for the current array being edited,
     * add new value
     */
    try {
      const { subtreeAddress, schemaDefinition } = addInfo
      let childNode

      //If no subtree address then add new to all and return
      if (!subtreeAddress || subtreeAddress.length == 0) state.all.push({})

      //Else, walk subtree addresses until exhausted then add new.
      //Get the root value and apply to first node.
      childNode = state.all.find((obj) => obj.id === subtreeAddress[0].id)[
        subtreeAddress[0].fieldName
      ]

      //Iterate down through children if applicable
      for (let n = 1; n < subtreeAddress.length; n++) {
        const address = subtreeAddress[n]
        childNode = childNode.find((obj) => obj.id === address.id)[
          address.fieldName
        ]
      }

      const calcNewId = (v) => {
        // return v.sort((a, b) => b.id - a.id)[v.length - 1].id + 1
        return childNode.length + 1
      }

      //Add new value with any defaults
      const createNew = (schemaDefinition) => {
        const keys = Object.keys(schemaDefinition)
        const newObj = {}
        schemaDefinition.map((field) => {
          switch (field.type) {
            case 'text':
              newObj[field.fieldName] = 'default'
              break
            case 'array':
              newObj[field.fieldName] = []
              break
            case 'date':
              newObj[field.fieldName] = Date.now()
              break
          }
        })

        return {
          id: calcNewId(childNode),
          ...newObj,
        }
      }

      childNode.push(createNew(schemaDefinition))
    } catch (error) {
      console.log(
        'Error applying subtree address.  Check your index values?: ',
        error
      )
    }
  },
  remove(state, { todo }) {
    all.list.splice(state.list.indexOf(todo), 1)
  },
  selectedMeetingSeries: (state, value) =>
    (state.selectedMeetingSeries = value), //Currently selected meetingSeries from all
  selectedMeeting: (state, value) => (state.selectedMeeting = value), //Currently selected meeting from the selectedMeetingSeries
  all: (state, value) => (state.all = value), //Array of all meetingSeries objects for the org
}

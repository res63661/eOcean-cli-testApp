import displayDef from '@/schema1.json'

export const state = () => ({
  all: [
    {
      id: 1,
      firstName: 'Richard',
    },
    {
      id: 2,
      firstName: 'Jacob',
    },
  ],
  selected_schema1: {},
  schemaDsiplayDefinition: displayDef,
})

export const getters = {
  schemaDsiplayDefinition: (state) => state.schemaDsiplayDefinition,
  all: (state) => state.all,
}

export const actions = {
  update(ctx, data) {
    //FInd data in all by id then update.
    const hits = ctx.state.all.filter((f) => f.id == data.id)
    if (!hits)
      throw `Error: found 0 hits in all data collection for id (${data.id})`
    if (hits.length > 1)
      throw `Error: found multiple id's in all data collection for id (${data.id})`

    //Update data in all data for hit and fire mutation
    ctx.commit('update', { dataToUpdate: hits[0], newData: data })
  },
}

export const mutations = {
  update(state, data) {
    data.dataToUpdate[data.newData.fieldDef.fieldName] = data.newData.newValue
  },
  add(state, text) {
    all.list.push({
      text,
      done: false,
    })
  },
  remove(state, { todo }) {
    all.list.splice(state.list.indexOf(todo), 1)
  },
  // //     search(state, value) {
  // //       return state.all_schema1 && state.all_schema1.length>0?all_schema1.filter
  // //   }
}

/**
 * Structure of state storage
 * Uses the easy-peasy wrapper for Redux
 */

import { action, thunk, createStore } from 'easy-peasy';
import axios from "axios";

 export const store = createStore({
  activeJob: null, // the oldest job for which we are awaiting results
  awaitingJobs: [], // list of submitted jobs next in line to become activeJob
  results: [], // all results from all jobs submitted during the session
  setActiveJob: action((state, payload) => {
    state.activeJob = payload
  }),
  setAwaitingJob: action((state, payload) => {
    state.awaitingJobs.push(payload)
  }),
  addAwaitingJob: thunk((actions, payload) => {
    actions.setAwaitingJob(payload)
    actions.getNewActiveJob(payload)
  }),
  submitJob: thunk(async (actions, payload) => {
    const { data } = await axios.post('http://127.0.0.1:8000/api/jobs/', payload)
    actions.addAwaitingJob(data.id)
  }),
  setResults: action((state, payload) => {
    state.results.push(payload)
  }),
  // when activeJob has been handled,
  // grab a new activeJob from awaitingJobs,
  // or set to null if no awaiting jobs
  getNewActiveJob: action((state, payload) => {
    if (state.awaitingJobs.length > 0) {
      state.activeJob = state.awaitingJobs[0]
      state.awaitingJobs = state.awaitingJobs.slice(1)
    } else {
      state.activeJob = null
    }
  })
});

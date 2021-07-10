/**
 * Results component
 * Takes no props
 * Handles logic for checking job status and retrieving results
 * Returns a ResultTable for each set of results
 */

import React, { useEffect } from "react";
import ResultTable from './ResultTable'
import { useStoreState, useStoreActions } from 'easy-peasy';

function Results(props) {

  const activeJob = useStoreState((state) => state.activeJob)
  const results = useStoreState((state) => state.results)
  const setResults = useStoreActions((actions) => actions.setResults)

  // function to poll a URL
  // param fn: function that sends request
  // param validate: function that validates response
  // param interval: int polling interval in ms
  // param maxAttempts: int # of attempts before polling stops 
  //                    if no vaild response found
  const poll = async ({ fn, validate, interval, maxAttempts }) => {
    let attempts = 0;

    const executePoll = async (resolve, reject) => {
      const result = await fn();
      attempts++;

      // copy result so body can be consumed to check job.status in validate()
      let resultCopy = result.clone()
      if (await validate(resultCopy)) {
        return resolve(result);
      } else if (maxAttempts && attempts === maxAttempts) {
        // ideally should inform user job has failed before reject()
        return reject(new Error('Exceeded max attempts'));
      } else {
        setTimeout(executePoll, interval, resolve, reject);
      }
    };

    return new Promise(executePoll);
  };

  // retrieves job object
  // returns promise
  const checkJobStatus = async () => {
    const res = await fetch(`http://127.0.0.1:8000/api/jobs/${activeJob}`);
    return res
  }

  // checks for the completion of the activeJob
  // returns true if job finished, else false
  const validate = async (res) => {
    // if request succesful...
    if (res.status == 200) {
      // consume body and check job status for 'f' = finished
      let valid = res.json().then((data) => {
        if (data.status === 'f') {
          return true
        }
        return false
      })
      // valid = true if 'f', else false
      return valid
    }
    // return false if request unsuccessful
    return false
  }

  useEffect(() => {
    // if there is a job being run, poll for 'f' = finished status
    if (activeJob != null) {
      poll({
        fn: checkJobStatus, 
        validate: validate,
        interval: 500, 
        maxAttempts: 60
      })
      .then(() => {
        // once job has finished, retrieve results
        return fetch(`http://127.0.0.1:8000/api/results/?blast_job_id=${activeJob}`)
      })
      .then((res) => res.json())
      .then((data) => {
        // convertarray into single obj
        let newRes = {}
        newRes['data'] = data
        setResults(newRes)
      })
    }
  }, [activeJob]) // fire when new jactiveJob set

  // returns a table of results for each job
  // completed during the session
  return (
    <div>
      {results.map((item) => (
        <ResultTable key={item.id} data={item}/>
      ))}
    </div>
  )
}

export default Results

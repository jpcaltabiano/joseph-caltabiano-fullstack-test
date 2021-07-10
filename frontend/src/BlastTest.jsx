/**
 * BlastTest component
 * Takes no props
 * Handles logic for job submission
 * Returns form for job submission
 */

import React, { useState } from "react";
import { Button } from 'react-bootstrap'
import { useStoreActions } from 'easy-peasy';

function BlastTest(props) {

  const [formInput, setFormInput] = useState('')
  const submitJob = useStoreActions((actions) => actions.submitJob)

  const handleSubmit = async (e) => {
    e.preventDefault()

    let query = {
      'query': formInput,
      'status': 'c'
    }

    // submits the blastn job, see store.js
    submitJob(query)
    setFormInput('')    
  }

  const handleInputChange = (e) => {
    setFormInput(e.target.value)
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <p
          style={{margin: '10px'}}
        >
          Enter your DNA sequence below, containing only the characters A, G, C, T
          Please 
        </p>
        <label style={{margin: '10px 2px 10px 10px'}}>Query:</label>
        <input
          style={{
            margin: '10px 10px 10px 2px',
            width: '30rem'
          }}
          type="text"
          title="10 or more characters; A, C, T, G only"
          value={formInput}
          onChange={handleInputChange}
          pattern="\b[ACTG]{10,}\b"
        />
        <Button
          style={{
            margin: '10px',
            padding: '.2rem .75rem'
          }}
          variant="primary"
          type="submit"
        >
          Submit
        </Button>
      </form>
    </div>
  )
}

export default BlastTest
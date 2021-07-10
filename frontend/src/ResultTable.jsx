/**
 * ResultTable component
 * Takes a single set of results as props
 *    props.data: {data: [ {} ]}
 * Returns a table to display a set of blastn results
 */

import React from "react";
import { Table } from 'react-bootstrap'

function ResultTable(props) {

  return (
    <Table striped bordered hover size="sm">
      <thead>
        <tr>
          <th>job #</th>
          <th>result #</th>
          <th>sstart</th>
          <th>send</th>
          <th>sstrand</th>
          <th>evalue</th>
          <th>pident</th>
          <th>sequence</th>
        </tr>
      </thead>
      <tbody>

        {props.data.data.map((item) => 
          <tr key={item.id}>
            <td>{item.blast_job}</td>
            <td>{item.result_no}</td>
            <td>{item.sstart}</td>
            <td>{item.send}</td>
            <td>{item.sstrand}</td>
            <td>{item.evalue}</td>
            <td>{item.pident}</td>
            <td>{item.sequence}</td>
          </tr>
        )}

      </tbody>
    </Table>
  )
}

export default ResultTable
import React from 'react'

import "components/Appointment/styles.scss";

import Header from "components/Appointment/Header"
import Empty from "components/Appointment/Empty"
import Show from "components/Appointment/Show"

export default function Appointment(props) {

  return props.interview ? (
    <article className="appointment">
      <Header time={props.time} />
      <Show 
        key={props.id}
        student={props.interview.student}
        interviewer={props.interview.interviewer}
      />
    </article>
  ) : (
    <article className="appointment">
      <Header time={props.time} />
      <Empty />
    </article>
  )
}
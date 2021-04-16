import React from 'react'

import "components/Appointment/styles.scss";

import Header from "components/Appointment/Header"
import Empty from "components/Appointment/Empty"
import Show from "components/Appointment/Show"
import Delete from "components/Appointment/Delete"
import Status from "components/Appointment/Status"
import Error from "components/Appointment/Error"
import Form from "components/Appointment/Form"

import useVisualMode from "hooks/useVisualMode"

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  const save = (name, interviewer) => {
    const interview = {
      student: name,
      interviewer
    };

    transition(SAVING);
    props.bookInterview(props.id, interview).then(() => {
      transition(SHOW);
    })
  }

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={props.cancelInterview}
        />
      )}
      {mode === CREATE && <Form 
        interviewers={props.interviewers}
        onCancel={() => back()}
        onSave={save}
      />}
      {mode === SAVING && <Status 
        message="Booking interview"
      />}
    </article>
  )
}
import React from "react";

import "components/InterviewerListItem.scss"

export default function InterviewerListItem(props) {
  let interviewerListItemClass = "interviewers__item";

  if (props.selected) {
    interviewerListItemClass += "--selected";
  }

  return (
    <li className={interviewerListItemClass} onClick={props.setInterviewer}>
      <img
        className="interviewers__item-image"
        src={props.avatar}
        alt={props.name}
      />
      {props.selected && props.name}
    </li>
  )
}
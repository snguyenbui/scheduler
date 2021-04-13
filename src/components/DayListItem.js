import React from "react";
import classNames from "classnames";

import "components/DayListItem.scss";

export default function DayListItem(props) {
  let dayListItemClass = classNames("day-list__item", {
    "day-list__item--selected": props.selected,
    "day-list__item--full": props.spots === 0,
  });
  
  let formatSpots = () => {
    let spots = `${props.spots} spots remaining`;
    if (props.spots === 1) {
      spots = "1 spot remaining";
    }
    if (props.spots === 0) {
      spots = "no spots remaining";
    }
    return spots;
  }

  return (
    <li className={dayListItemClass} onClick={props.setDay}>
      <h2>{props.name}</h2> 
      <h3>{formatSpots()}</h3>
    </li>
  );
}
import { useReducer, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";
  const SET_SPOTS = "SET_SPOTS";

  const reducer = (state, action) => {
    const actions = {
      SET_DAY: { ...state, ...action.day },
      SET_APPLICATION_DATA: {
        ...state,
        days: action.days,
        appointments: action.appointments,
        interviewers: action.interviewers,
      },
      SET_INTERVIEW: { ...state, ...action.appointments },
      SET_SPOTS: { ...state, ...action.days },
      default: new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      ),
    };
    return actions[action.type] || actions.default;
  };

  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  const setDay = (day) => dispatch({ type: SET_DAY, day });
  const setSpots = (day, amount) => {
    const days = [...state.days];
    days.forEach((target) => {
      if (target.name === day) {
        target.spots += amount;
      }
    });
    dispatch({ type: SET_SPOTS, days });
  };

  const bookInterview = (id, interview) => {
    const newAppointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };

    const appointments = {
      ...state.appointments,
      [id]: newAppointment,
    };

    return axios.put(`/api/appointments/${id}`, newAppointment).then(() => {
      if (state.appointments[id].interview === null) {
        setSpots(state.day, -1);
      }
      if (state.appointments[id].interview !== null) {
        setSpots(state.day, 0);
      }
      dispatch({ type: SET_INTERVIEW, appointments });
    });
  };

  const cancelInterview = (id) => {
    const canceledAppointment = {
      ...state.appointments[id],
      interview: null,
    };

    const appointments = {
      ...state.appointments,
      [id]: canceledAppointment,
    };
    return axios.delete(`/api/appointments/${id}`).then(() => {
      setSpots(state.day, 1);
      dispatch({ type: SET_INTERVIEW, appointments });
    });
  };

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
    ]).then((all) => {
      dispatch({
        type: SET_APPLICATION_DATA,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data,
      });
    }, []);
  });

  return { state, setDay, bookInterview, cancelInterview };
}

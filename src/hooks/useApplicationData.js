import axios from "axios";
import { useReducer, useEffect } from "react";

require("dotenv");
const socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
socket.addEventListener("open", function (event) {
  socket.send("ping");
});

export default function useApplicationData() {
  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";
  const SET_SPOTS = "SET_SPOTS";

  const reducer = (state, action) => {
    const actions = {
      SET_DAY: { ...state, ...action.data },
      SET_APPLICATION_DATA: {
        ...state,
        ...action.data,
      },
      SET_INTERVIEW: { ...state, ...action.data },
      SET_SPOTS: { ...state, ...action.data },
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

  const setDay = (day) => dispatch({ type: SET_DAY, data: { day } });
  const setSpots = (day, amount) => {
    const days = [...state.days];
    days.forEach((target) => {
      if (target.name === day) {
        target.spots += amount;
      }
    });
    dispatch({ type: SET_SPOTS, data: { days } });
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
      dispatch({ type: SET_INTERVIEW, data: { appointments } });
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
      dispatch({ type: SET_INTERVIEW, data: { appointments } });
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
        data: {
          days: all[0].data,
          appointments: all[1].data,
          interviewers: all[2].data,
        },
      });
    });
  }, []);

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data !== "pong") {
      if (data.interview === null) {
        const canceledAppointment = {
          ...state.appointments[data.id],
          interview: null,
        };

        const appointments = {
          ...state.appointments,
          [data.id]: canceledAppointment,
        };

        dispatch({ type: SET_INTERVIEW, data: { appointments } });
      }
      if (data.interview !== null) {
        const canceledAppointment = {
          ...state.appointments[data.id],
          interview: data.interview,
        };

        const appointments = {
          ...state.appointments,
          [data.id]: canceledAppointment,
        };

        dispatch({ type: SET_INTERVIEW, data: { appointments } });
      }
    }
  };

  return { state, setDay, bookInterview, cancelInterview };
}

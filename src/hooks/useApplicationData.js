import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  const setDay = (day) => setState({ ...state, day });
  const setSpots = (day, amount) => {
    const days = [...state.days];
    days.forEach((target) => {
      if (target.name === day) {
        target.spots += amount;
      }
    });
    setState({ ...state, days });
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
      setSpots(state.day, -1);
      setState({ ...state, appointments });
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
      setState({ ...state, appointments });
    });
  };

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
    ]).then((all) => {
      setState((prev) => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data,
      }));
    });
  }, []);

  return { state, setDay, bookInterview, cancelInterview };
}

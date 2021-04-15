const getAppointmentsForDay = (state, day) => {
  const appointmentsList = state.days.find(dayData => dayData.name === day);
  let appointmentsForDay = [];
  if (appointmentsList) {
    appointmentsList.appointments.forEach(id => appointmentsForDay.push(state.appointments[id]));
  }
  return appointmentsForDay;
}

const getInterview = (state, interview) => {
  let interviewDetails = null;
  if (interview) {
    const interviewer = state.interviewers[interview.interviewer]
    interviewDetails = {...interview, interviewer};
  }
  return interviewDetails;
};

export { getAppointmentsForDay, getInterview };
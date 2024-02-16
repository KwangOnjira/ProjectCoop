import axios from "axios";

//Maternity Leave
//postMLLeave({ ...formMaternity, date: currentDate },localStorage.getItem("token"));
export const postMLLeave = async (userData, token) =>
  await axios.post("http://localhost:5432/leave/maternityleave", userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

//Orination Leave
//postOLLeave({...formOrdination,date: currentDate,},localStorage.getItem("token"));
export const postOLLeave = async (userData, token) =>
  await axios.post("http://localhost:5432/leave/ordinationleave", userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  //Personal Leave
  //postPLLeave({...formPersonal,date: currentDate,},localStorage.getItem("token"));
  export const postPLLeave = async (userData, token) =>
  await axios.post("http://localhost:5432/leave/personalleave", userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  //Sick Leave
  export const postSLLeave = async (userData, token) =>
  await axios.post("http://localhost:5432/leave/sickleave", userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  //Sick Leave
  export const postSTLLeave = async (userData, token) =>
  await axios.post("http://localhost:5432/leave/studyleave", userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  //Vacation Leave
  export const postVLLeave = async (userData, token) =>
  await axios.post("http://localhost:5432/leave/vacationleave", userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
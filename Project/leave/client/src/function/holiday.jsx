import axios from "axios";

//getHoliday(localStorage.getItem("token"));
export const getHoliday = async (token) =>
  await axios.get("http://localhost:5432/getHoliday",{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
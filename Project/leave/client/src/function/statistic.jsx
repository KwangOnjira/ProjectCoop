import axios from "axios";

//getStatistic(localStorage.getItem('token'))
export const getStatistic = async (token) =>
  await axios.get("http://localhost:5432/statistics",  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  //getLastStatistic(localStorage.getItem("token"));
  export const getLastStatistic = async (token) => {
    try {
      const response = await axios.get("http://localhost:5432/getDataLastStatistic", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Full Response:", response);
      return response;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log("No statistics found for the user");
        return null;
      }
      console.error("Error fetching last statistic:", error);
      throw error;
    }
  };
  
//   //getLastStatistic(localStorage.getItem("token"));
// export const getCheckLastStatistic = async (token) =>
//   await axios.get("http://localhost:5432/lastStatistic",  {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

  //createStat({...statData,leave_count: statData.leave_count + 1,ML_DayCount: statData.ML_DayCount + formMaternity.numDay,},localStorage.getItem("token"));
  export const createStat = async (statData,token) =>
  await axios.post("http://localhost:5432/createStat",statData,  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  export const createInitStatistic = async (statData,token) =>
  await axios.post("http://localhost:5432/createInitStatistic",statData,  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  

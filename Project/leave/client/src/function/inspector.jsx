import axios from "axios";

export const sameDivision = async(token) =>{
    await axios.get("http://localhost:5432/sameDivision",{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
} 

export const sameBothDivAndSubDiv = async(token) =>{
    await axios.get("http://localhost:5432/sameBothDivAndSubDiv",{
        headers: {
            Authorization: `Bearer ${token}`,
          },
    })
} 

export const getUserforEdit = async(citizenID,token) =>{
  try{
    const response = await axios.get(`http://localhost:5432/getuserforEdit/${citizenID}`,{
        headers: {
            Authorization: `Bearer ${token}`,
          },
    })
    return response.data
  }catch(error){
    throw error;
  }
    
} 

export const getUsers = async(citizenID,token) =>{
    try {
    const response = await axios.get(`http://localhost:5432/getuser/${citizenID}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; 
  } catch (error) {
    throw error; 
  }
} 

export const updateLastStatistic = async(citizenID,statData, token) =>
await axios.put(`http://localhost:5432/updateLastStatistic/${citizenID}`, statData, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
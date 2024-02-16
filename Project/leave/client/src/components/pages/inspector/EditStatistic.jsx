import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { currentUser } from '../../../function/auth';
import axios from 'axios';
import { Button } from '@mui/material';
import { intervalToDuration } from 'date-fns';
import { calculateYear } from '../../../function/YearInWork';

const EditStatistic = ({ userId }) => {
  const [currentuserData, setCurrentUserData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchUser = await currentUser(localStorage.getItem("token"));
        console.log(fetchUser.data);
        setCurrentUserData(fetchUser.data);
        console.log("fetchUser.data", fetchUser.data.divisionName);
        if (fetchUser.data.divisionName === "กองช่าง") {
          const usersResponse = await axios.get(
            "http://localhost:5432/sameBothDivAndSubDiv",
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          console.log("usersResponse: ", usersResponse.data);
          setUsersData(usersResponse.data);
        } else {
          const usersResponse = await axios.get(
            "http://localhost:5432/sameDivision",
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          console.log("usersResponse: ", usersResponse.data);
          setUsersData(usersResponse.data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchData();
  }, [userId]);

  const handleDetail = (citizenID) => {
    navigate(`/inspector/edit/detail/${citizenID}`);
  };


  return (
    <div style={{ position: "relative", minHeight: "86vh" }}>
      <h1>แก้ไขวันลา</h1>
      {currentuserData.divisionName === "กองช่าง" ? (
<h2>{currentuserData.divisionName} {currentuserData.sub_division} </h2>
      ) : (
        <h2>กอง {currentuserData.divisionName}</h2>

      )}

      {usersData.length > 0 && (
        <>
          
          <table>
            <thead>
              <tr>
              <th>citizenID</th>
                <th>ชื่อ</th>
                <th>เลขid</th>
                <th>อายุการทำงาน</th>
                <th>วันลาพักผ่อนสะสม</th>
                <th>รวมมีวันลาพักผ่อน</th>
                <th>ลามาแล้ว</th>
                <th>คงเหลือวันลาพักผ่อน</th>
                <th>ลาป่วย</th>
                <th>ลากิจ</th>
                <th>ลาอุปสมบท</th>
                <th>ลาคลอดบุตร</th>
                <th>ลาไปศึกษาต่อ</th>
                <th>แก้ไขข้อมูล</th>
              </tr>
            </thead>
            <tbody>
              {usersData.map((user) => (
                <tr key={user.id}>
                  <td>{user.citizenID}</td>
                  <td>{user.name}</td>
                  <td>{user.statistics[0].statisticID}</td>
                  <td>{calculateYear(user.start_of_work_on)} </td>
                  <td>{user.statistics[0].VL_accumulatedDays}</td>
                  <td>{user.statistics[0].VL_total}</td>
                  <td>{user.statistics[0].currentUseVL}</td>
                  <td>{user.statistics[0].VL_remaining}</td>
                  <td>{user.statistics[0].SL_remaining}</td>
                  <td>{user.statistics[0].PL_remaining}</td>
                  <td>{user.statistics[0].OL_DayCount}</td>
                  <td>{user.statistics[0].ML_DayCount}</td>
                  <td>{user.statistics[0].STL_DayCount}</td>
                  <td>
                    <Button
                      color="primary"
                      size="medium"
                      variant="contained"
                      onClick={()=> handleDetail(user.citizenID)}
                    >
                      แก้ไขข้อมูล
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

    </div>
    
  );
}

export default EditStatistic
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { currentUser } from "../../../function/auth";

const StatDivision = ({ userId }) => {
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

  const handleNavigate = () => {
    navigate("/inspector/edit");
  };

  const handleDetail = (citizenID) => {
    navigate(`/inspector/detail/${citizenID}`);
  };

  return (
    <div style={{ position: "relative", minHeight: "86vh" }}>
      <h1>สถิติวันลา</h1>
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
                <th>ฝ่าย</th>
                <th>ตำแหน่ง</th>
                <th>เลขid</th>
                <th>จำนวนครั้งที่ลา</th>
                <th>ลาป่วย</th>
                <th>ลากิจ</th>
                <th>ลาอุปสมบท</th>
                <th>ลาคลอดบุตร</th>
                <th>ลาไปศึกษาต่อ</th>
                <th>รวมวันลา</th>
                <th>ดู</th>
              </tr>
            </thead>
            <tbody>
              {usersData.map((user) => (
                <tr key={user.id}>
                  <td>{user.citizenID}</td>
                  <td>{user.name}</td>
                  <td>{user.sub_division}</td>
                  <td>{user.position}</td>
                  <td>{user.statistics[0].statisticID}</td>
                  <td>{user.statistics[0].leave_count} ครั้ง</td>
                  <td>{user.statistics[0].SL_remaining}</td>
                  <td>{user.statistics[0].PL_remaining}</td>
                  <td>{user.statistics[0].OL_DayCount}</td>
                  <td>{user.statistics[0].ML_DayCount}</td>
                  <td>{user.statistics[0].STL_DayCount}</td>
                  <td>{user.statistics[0].total_leaveDay} วัน</td>
                  <td>
                    <Button
                      color="primary"
                      size="medium"
                      variant="contained"
                      onClick={() => handleDetail(user.citizenID)}
                    >
                      ดูรายละเอียด
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <Fab
        color="primary"
        aria-label="add"
        onClick={handleNavigate}
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
        }}
      >
        <AddIcon />
      </Fab>
    </div>
  );
};

export default StatDivision;

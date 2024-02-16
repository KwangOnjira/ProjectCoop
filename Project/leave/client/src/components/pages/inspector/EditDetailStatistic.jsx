import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getUserforEdit,
  getUsers,
  updateLastStatistic,
} from "../../../function/inspector";
import { calculateYear } from "../../../function/YearInWork";
import { FormControl } from "@mui/material";

const EditDetailStatistic = () => {
  const [userData, setUserData] = useState();
  const { citizenID } = useParams();
  const [statData, setStatData] = useState({
    leave_rights: "",
    VL_accumulatedDays: "",
    VL_total: "",
    VL_lastLeave: "",
    currentUseVL: "",
    SL_remaining: "",
    PL_remaining: "",
    ML_DayCount: "",
    OL_DayCount: "",
    STL_DayCount: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchUser = await getUserforEdit(
          citizenID,
          localStorage.getItem("token")
        );
        console.log("fetchUser",fetchUser);
        setUserData(fetchUser);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchData();
  }, [citizenID]);

  const updateStat = async () => {
    try {
      const response = await updateLastStatistic(
        citizenID,
        statData,
        localStorage.getItem("token")
      );

      setStatData(response.data);
    } catch (error) {
      console.log("Error updating Last statistic data: " + error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div>
      <h1>แก้ไขวันลา</h1>
      <h4>CitizenID: {citizenID}</h4>
      {userData && (
        <>
          <h3>
            ชื่อ: {userData.name} นามสกุล: {userData.surname}
          </h3>
          <h4>อายุการทำงาน: {calculateYear(userData.start_of_work_on)}</h4>
          <form onSubmit={updateStat}>
            <label>สิทธิวันลาพักผ่อน</label>
            <input
              type="number"
              name="leave_rights"
              value={userData.statistics[0].leave_rights}
              onChange={handleChange}
              required
            />
            <br />
            <label>วันลาพักผ่อนสะสม</label>
            <input
              type="number"
              name="VL_accumulatedDays"
              value={userData.statistics[0].VL_accumulatedDays}
              onChange={handleChange}
              required
            />
            <br />
            <label>รวมมีลาพักผ่อนสะสม</label>
            <input
              type="number"
              name="VL_total"
              value={userData.statistics[0].VL_total}
              onChange={handleChange}
              required
            />
            <br />
            <label>ลาพักผ่อนสะสมไปแล้ว</label>
            <input
              type="number"
              name="VL_lastLeave"
              value={userData.statistics[0].VL_lastLeave}
              onChange={handleChange}
              required
            />
            <br />
            <label>ลาพักผ่อนสะสมไปแล้ว: {userData.statistics[0].VL_total}</label>
            <br />
          </form>
        </>
      )}
    </div>
  );
};

export default EditDetailStatistic;

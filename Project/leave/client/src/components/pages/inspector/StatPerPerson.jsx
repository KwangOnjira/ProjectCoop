import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUsers } from "../../../function/inspector";

const StatPerPerson = () => {
  const [userData, setUserData] = useState();
  const { citizenID } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchUser = await getUsers(
          citizenID,
          localStorage.getItem("token")
        );
        console.log(fetchUser);
        setUserData(fetchUser);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchData();
  }, [citizenID]);

  return (
    <div>
      <h1>สถิติวันลา(รายคน) </h1>
      <h2>CitizenID: {citizenID}</h2>
      {userData && (
        <>
          <h3>
            Name: {userData.name} , Position: {userData.position}{" "}
          </h3>
          <table>
            <thead>
              <tr>
                <th>ลำดับ</th>
                <th>ครั้งที่</th>
                <th>statisticID from leave</th>
                <th>วันที่</th>
                <th>ประเภทการลา</th>
                <th>statisticID from statistic</th>
                <th>วันลาพักผ่อนสะสม</th>
                <th>สิทธิวันลาพักผ่อน</th>
                <th>รวม</th>
                <th>ลาพักผ่อนมาแล้ว</th>
                <th>ลาพักผ่อนลาครั้งนี้</th>
                <th>คงเหลือลาพักผ่อน</th>
                <th>ลาป่วยมาแล้ว</th>
                <th>ลาป่วยลาครั้งนี้</th>
                <th>รวมลาป่วย</th>
                <th>ลากิจมาแล้ว</th>
                <th>ลากิจลาครั้งนี้</th>
                <th>รวมลากิจ</th>
              </tr>
            </thead>
            <tbody>
              {userData.statistics.map((statistic, index) => {
                const matchingLeaves = index -1
                return (
                  <tr key={index}>
                    <td>{index}</td>
                    <td>{statistic.leave_count}</td>

                    {userData.leaves[matchingLeaves] ? (
                        <>
                          <td>{userData.leaves[matchingLeaves].statisticID}</td>
                          <td>
                            {userData.leaves[matchingLeaves].firstDay} - {userData.leaves[matchingLeaves].lastDay}
                          </td>
                          <td>{userData.leaves[matchingLeaves].topic}</td>
                        </>
                      
                    ) : (
                      <>
                        <td>No Leave</td>
                        <td>No Leave</td>
                        <td>No Leave</td>
                      </>
                    )}
                    <td>{statistic.statisticID}</td>
                    <td>{statistic.VL_accumulatedDays}</td>
                    <td>{statistic.leave_rights}</td>
                    <td>{statistic.VL_total}</td>
                    <td>{statistic.VL_lastLeave  }</td>
                    <td>{statistic.VL_thisLeave}</td>
                    <td>{statistic.VL_remaining}</td>
                    <td>{statistic.SL_lastLeave}</td>
                    <td>{statistic.SL_thisLeave}</td>
                    <td>{statistic.SL_remaining}</td>
                    <td>{statistic.PL_lastLeave}</td>
                    <td>{statistic.PL_thisLeave}</td>
                    <td>{statistic.PL_remaining}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default StatPerPerson;

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Transition } from "react-transition-group";
import { Button, Box, Modal, ModalDialog, Typography } from "@mui/joy";
import { useNavigate } from "react-router-dom";
import SubmitButtonAndModal from "../../Popup";
import { findBusinessDays } from "../../../function/BusinessDay";
import { FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { createStat, getLastStatistic } from "../../../function/statistic";
import { currentUser } from "../../../function/auth";
import { getHoliday } from "../../../function/holiday";
import { postVLLeave } from "../../../function/leave";


const VacationLeave = () => {
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    position: "",
  });
  const [holiData, setHoliData] = useState({
    name: "",
    date: "",
  });
  const [statData, setStatData] = useState({
    leave_count: "",
    leave_rights: "",
    VL_accumulatedDays: "",
    VL_total: "",
    VL_lastLeave: "",
    VL_thisLeave: "",
    currentUseVL:"",
    VL_remaining: "",
  });
  const [formVacation, setFormVacation] = useState({
    leaveID: "",
    citizenID: "",
    statisticID: "",
    type: "",
    topic:"",
    to: "",
    date: "",
    contact: "",
    firstDay: null,
    lastDay: null,
    numDay: "",
    status: "",
    allow: "",
    comment: "",
    deputyName: "",
    typeCount: null,
  });
  console.log(formVacation);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchUser = await currentUser(localStorage.getItem("token"))
        console.log(fetchUser.data);
        setUserData(fetchUser.data);

        const fetchStat = await getLastStatistic(localStorage.getItem("token")
        );
        console.log("Fetch Stat Response:", fetchStat.data);
        if (fetchStat) {
          setStatData(fetchStat.data);
          console.log("Updated statData:", fetchStat.data);
        } else {
          console.log("No statistics found for the user");
        }

        const fetchHoliday = await getHoliday(localStorage.getItem("token")
        );
        console.log(fetchHoliday.data);
        setHoliData(fetchHoliday.data);

        setStatData((prevData) => ({
          ...prevData,
          leave_count: fetchStat.data.leave_count,
          leave_rights: fetchStat.data.leave_rights,
          VL_accumulatedDays: fetchStat.data.VL_accumulatedDays,
          VL_total: fetchStat.data.VL_total,
          VL_lastLeave: fetchStat.data.VL_lastLeave,
          VL_thisLeave: fetchStat.data.VL_thisLeave,
          currentUseVL: fetchStat.data.currentUseVL,
          VL_remaining: fetchStat.data.VL_remaining,
        }));

        setFormVacation((prevData) => ({
          ...prevData,
          citizenID: fetchUser.data.citizenID,
          statisticID: fetchStat.data.statisticID,
          name: fetchUser.data.name,
          position: fetchUser.position,
          leave_count: fetchStat.data.leave_count,
          leave_rights: fetchStat.data.leave_rights,
          VL_accumulatedDays: fetchStat.data.VL_accumulatedDays,
          VL_total: fetchStat.data.VL_total,
          VL_lastLeave: fetchStat.data.VL_lastLeave,
          VL_thisLeave: fetchStat.data.VL_thisLeave,
          VL_thisLeave: fetchStat.data.currentUseVL,
          currentUseVL: fetchStat.data.currentUseVL,
          VL_remaining: fetchStat.data.VL_remaining,
        }));
      } catch (err) {
        console.log("Error fetching user data: " + err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue =
      name.includes("Day") && value && value.$d instanceof Date
        ? value.$d
        : value;

    setFormVacation((prevData) => {
      if (name === "typeCount") {
        console.log("Type Count Value:", value);
        return {
          ...prevData,
          numDay: "",
          firstDay: "",
          lastDay: "",
          [name]: value || "",
        };
      }

      if (name === "firstDay" || name === "lastDay") {
        const businessDays = findBusinessDays(
          name === "firstDay" ? parsedValue || new Date() : prevData.firstDay,
          name === "lastDay" ? parsedValue || new Date() : prevData.lastDay,
          holiData
        );

        let newNumDay = 0;
        try {
          if (
            formVacation.typeCount == "morning" ||
            formVacation.typeCount == "afternoon"
          ) {
            newNumDay = businessDays * 0.5;
            console.log("newNumDay:", newNumDay);
          } else if (formVacation.typeCount == "all") {
            newNumDay = businessDays;
            console.log("newNumDay:", newNumDay);
          }
        } catch (error) {
          console.log(error);
        }

        return {
          ...prevData,
          numDay: newNumDay,
          [name]: parsedValue || null,
        };
      } else {
        return {
          ...prevData,
          [name]: parsedValue || "",
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    const currentDate = dayjs().toDate();
    console.log("formVacation:", formVacation);
    try {
      const response = await postVLLeave({
          ...formVacation,
          topic:"ขอลาพักผ่อน",
          date: currentDate,
        },localStorage.getItem("token")
      );
      const responseStat = await createStat({
          ...statData,
          VL_lastLeave: statData.VL_lastLeave + statData.VL_thisLeave,
          VL_thisLeave: formVacation.numDay,
          currentUseVL: (statData.VL_lastLeave + statData.VL_thisLeave)+ formVacation.numDay,
          VL_remaining: statData.VL_remaining -formVacation.numDay,
        },localStorage.getItem("token")
      );

      console.log(response.data);
      setFormVacation(response.data);
      console.log(responseStat.data);
      setStatData((prevData) => ({
        ...prevData,
        VL_lastLeave: prevData.VL_lastLeave + prevData.VL_thisLeave,
        VL_thisLeave: formVacation.numDay,
        currentUseVL: (prevData.VL_lastLeave + prevData.VL_thisLeave) + formVacation.numDay,
        VL_remaining: prevData.VL_remaining - formVacation.numDay,
      }));
    } catch (error) {
      console.log("Post Form Vacation Failed: " + error);
    }
  };

  return (
    <div>
      <h2>VacationLeave</h2>
      {userData && (
        <form onSubmit={handleSubmit}>
          <p>Name: {userData.name}</p>
          <p>Position: {userData.position}</p>
          <p>ครั้งที่ {statData.leave_count + 1} /ปี</p>
          <p>มีวันลาสะสม:{statData.VL_accumulatedDays} วัน</p>
          <p>สิทธิ์วันลาที่มี:{statData.leave_rights} วัน</p>
          <p>รวมเป็น {statData.VL_total} วัน</p>
          <p>ลาพักผ่อนไปแล้ว {statData.VL_total - statData.VL_remaining} วัน</p>
          <label>
            To:
            <input
              type="text"
              name="to"
              value={formVacation.to}
              onChange={handleChange}
              required
              placeholder="Enter your superior"
            />
          </label>
          
          <br />
          <FormControl>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="typeCount"
              onChange={(e) => handleChange(e)}
              value={formVacation.typeCount}
            >
              <FormControlLabel
                value="morning"
                control={<Radio />}
                label="ครึ่งเช้า"
              />
              <FormControlLabel
                value="afternoon"
                control={<Radio />}
                label="ครึ่งบ่าย"
              />
              <FormControlLabel
                value="all"
                control={<Radio />}
                label="ทั้งวัน"
              />
            </RadioGroup>
          </FormControl>
          <br />
          {formVacation.typeCount != null && (
            <>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker
                    onChange={(date) =>
                      handleChange({
                        target: { value: date, name: "firstDay" },
                      })
                    }
                    value={formVacation.firstDay || null}
                    label="firstDay"
                    name="firstDay"
                  />
                </DemoContainer>
              </LocalizationProvider>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker
                    onChange={(date) =>
                      handleChange({
                        target: { value: date, name: "lastDay" },
                      })
                    }
                    value={formVacation.lastDay || null}
                    label="lastDay"
                    name="lastDay"
                  />
                </DemoContainer>
              </LocalizationProvider>
            </>
          )}
          <p>
            Number days:{" "}
            {formVacation.firstDay && formVacation.lastDay && <>{formVacation.numDay}</>}
          </p>
          <label>
            Contact:
            <input
              type="text"
              name="contact"
              value={formVacation.contact}
              onChange={handleChange}
              required
              placeholder="Enter your contact"
            />
          </label>
          <br />
          <label>
            ผู้รับมอบ:
            <input
              type="text"
              name="deputyName"
              value={formVacation.deputyName}
              onChange={handleChange}
              required
              placeholder="Enter your deputy"
            />
          </label>
          <br />
          <br />
          <SubmitButtonAndModal
            open={open}
            setOpen={setOpen}
            handleSubmit={handleSubmit}
          />
          <br />
          <br />
        </form>
      )}
    </div>
  );
};

export default VacationLeave;

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import SubmitButtonAndModal from "../../Popup";
import { findBusinessDays } from "../../../function/BusinessDay";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { createStat, getLastStatistic } from "../../../function/statistic";
import { currentUser } from "../../../function/auth";
import { getHoliday } from "../../../function/holiday";
import { postPLLeave } from "../../../function/leave";

const PersonalLeave = () => {
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    position: "",
    divisionName: "",
    sub_division: "",
  });
  const [holiData, setHoliData] = useState({
    name: "",
    date: "",
  });
  const [statData, setStatData] = useState({
    leave_count: 0,
    PL_lastLeave: "",
    PL_thisLeave: "",
    PL_remaining: "",
    total_leaveDay: 0,
  });
  const [formPersonal, setFormPersonal] = useState({
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
    reason: "",
    typeCount: null,
  });
  console.log(formPersonal);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchUser = await currentUser(localStorage.getItem("token"));
        console.log(fetchUser.data);
        setUserData(fetchUser.data);

        const fetchStat = await getLastStatistic(localStorage.getItem("token"));
        console.log(fetchStat.data);
        setStatData(fetchStat.data);

        const fetchHoliday = await getHoliday(localStorage.getItem("token"));
        console.log(fetchHoliday.data);
        setHoliData(fetchHoliday.data);

        setStatData((prevData) => ({
          ...prevData,
          leave_count: fetchStat.data.leave_count,
          PL_remaining: fetchStat.data.PL_remaining,
          total_leaveDay: fetchStat.data.total_leaveDay,
        }));

        setFormPersonal((prevData) => ({
          ...prevData,
          citizenID: fetchUser.data.citizenID,
          statisticID: fetchStat.data.statisticID,
          name: fetchUser.data.name,
          position: fetchUser.position,
          divisionName: fetchUser.data.divisionName,
          sub_division: fetchUser.data.sub_division,
          leave_count: fetchStat.data.leave_count,
          PL_remaining: fetchStat.data.PL_remaining,
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

    setFormPersonal((prevData) => {
      //clear numDay
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
            formPersonal.typeCount == "morning" ||
            formPersonal.typeCount == "afternoon"
          ) {
            newNumDay = businessDays * 0.5;
            console.log("newNumDay:", newNumDay);
          } else if (formPersonal.typeCount == "all") {
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
    console.log("formPersonal:", formPersonal);
    try {
      const response = await postPLLeave(
        {
          ...formPersonal,
          topic:"ขอลากิจ",
          date: currentDate,
        },
        localStorage.getItem("token")
      );

      const responseStat = await createStat(
        {
          ...statData,
          leave_count: statData.leave_count + 1,
          PL_lastLeave: statData.PL_remaining,
          PL_thisLeave: formPersonal.numDay,
          PL_remaining: statData.PL_remaining + formPersonal.numDay,
          total_leaveDay: statData.total_leaveDay + formPersonal.numDay
        },
        localStorage.getItem("token")
      );

      console.log(response.data);
      setFormPersonal(response.data);
      console.log(responseStat.data);
      setStatData((prevData) => ({
        ...prevData,
        leave_count: prevData.leave_count + 1,
        PL_lastLeave: prevData.PL_remaining,
        PL_thisLeave: formPersonal.numDay,
        PL_remaining: prevData.PL_remaining + formPersonal.numDay,
        total_leaveDay: statData.total_leaveDay + formPersonal.numDay
      }));
    } catch (error) {
      console.log("Post Form Personal Failed: " + error);
    }
  };

  return (
    <div>
      <h2>Personal Leave</h2>
      {userData && (
        <form onSubmit={handleSubmit}>
          <p>Name: {userData.name}</p>
          <p>Division: {userData.divisionName}</p>
          <p>Sub Division: {userData.sub_division}</p>
          <p>Position: {userData.position}</p>
          <p>ครั้งที่ {statData.leave_count + 1} /ปี</p>
          <p>ลากิจไปแล้ว {statData.PL_remaining} วัน</p>
          <label>
            To:
            <input
              type="text"
              name="to"
              value={formPersonal.to}
              onChange={handleChange}
              required
              placeholder="Enter your superior"
            />
          </label>
          <br />
          <label>
            Reason:
            <input
              type="text"
              name="reason"
              value={formPersonal.reason}
              onChange={handleChange}
              required
              placeholder="Enter your reason"
            />
          </label>
          <br />
          <FormControl>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="typeCount"
              onChange={(e) => handleChange(e)}
              value={formPersonal.typeCount}
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
          {formPersonal.typeCount != null && (
            <>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker
                    onChange={(date) =>
                      handleChange({
                        target: { value: date, name: "firstDay" },
                      })
                    }
                    value={formPersonal.firstDay || null}
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
                    value={formPersonal.lastDay || null}
                    label="lastDay"
                    name="lastDay"
                  />
                </DemoContainer>
              </LocalizationProvider>
            </>
          )}
          <p>
            Number days:{" "}
            {formPersonal.firstDay && formPersonal.lastDay && (
              <>{formPersonal.numDay}</>
            )}
          </p>
          <label>
            Contact:
            <input
              type="text"
              name="contact"
              value={formPersonal.contact}
              onChange={handleChange}
              required
              placeholder="Enter your contact"
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

export default PersonalLeave;

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import "dayjs/locale/th";
import React, { useEffect, useState } from "react";
import SubmitButtonAndModal from "../../Popup";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
dayjs.locale("th");
import { findBusinessDays } from "../../../function/BusinessDay";
import { createStat, getLastStatistic } from "../../../function/statistic";
import { currentUser } from "../../../function/auth";
import { getHoliday } from "../../../function/holiday";
import { postOLLeave } from "../../../function/leave";

const OrdinationLeave = () => {
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    position: "",
    divisionName: "",
    sub_division: "",
    birthday: "",
    start_of_work_on: "",
  });
  const [holiData, setHoliData] = useState({
    name: "",
    date: "",
  });
  const [statData, setStatData] = useState({
    leave_count: "",
    OL_DayCount: "",
    total_leaveDay: 0,
  });
  const [formOrdination, setFormOrdination] = useState({
    citizenID: "",
    statisticID: "",
    level: "",
    type: "",
    topic:"",
    to: "",
    date: "",
    firstDay: "",
    lastDay: "",
    numDay: "",
    status: "",
    allow: "",
    comment: "",
    useTo: "",
    nameTemple: "",
    addressTemple: "",
    dateOrdi: "",
    stayTemple: "",
    addressStayTemple: "",
  });
  console.log(formOrdination);

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
          OL_DayCount: fetchStat.data.OL_DayCount,
          total_leaveDay: fetchStat.data.total_leaveDay,
        }));

        setFormOrdination((prevData) => ({
          ...prevData,
          citizenID: fetchUser.data.citizenID,
          statisticID: fetchStat.data.statisticID,
          start_of_work_on: fetchUser.data.start_of_work_on,
          name: fetchUser.data.name,
          position: fetchUser.position,
          divisionName: fetchUser.data.divisionName,
          sub_division: fetchUser.data.sub_division,
          leave_count: fetchStat.data.leave_count,
          OL_DayCount: fetchStat.data.OL_DayCount,
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

    setFormOrdination((prevData) => {
      if (name === "firstDay" || name === "lastDay") {
        const businessDays = findBusinessDays(
          name === "firstDay" ? parsedValue || new Date() : prevData.firstDay,
          name === "lastDay" ? parsedValue || new Date() : prevData.lastDay,
          holiData
        );

        return {
          ...prevData,
          numDay: businessDays,
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
    console.log("formOrdination:", formOrdination);
    try {
      const response = await postOLLeave(
        {
          ...formOrdination,
          topic:"ขอลาอุปสมบท",
          date: currentDate,
        },
        localStorage.getItem("token")
      );

      const responseStat = await createStat(
        {
          ...statData,
          leave_count: statData.leave_count + 1,
          OL_DayCount: statData.OL_DayCount + formOrdination.numDay,
          total_leaveDay: statData.total_leaveDay + formOrdination.numDay
        },
        localStorage.getItem("token")
      );

      console.log(response.data);
      setFormOrdination(response.data);
      setStatData((prevData) => ({
        ...prevData,
        leave_count: prevData.leave_count + 1,
        OL_DayCount: prevData.OL_DayCount + formOrdination.numDay,
        total_leaveDay: statData.total_leaveDay + formOrdination.numDay
      }));
    } catch (error) {
      console.log("Post Form Ordination Failed: " + error);
    }
  };

  return (
    <div>
      <h2>OrdinationLeave</h2>
      {userData && (
        <form onSubmit={handleSubmit}>
          <p>Name: {userData.name}</p>
          <p>Division: {userData.divisionName}</p>
          <p>Sub Division: {userData.sub_division}</p>
          <p>
            level:{" "}
            <input
              type="text"
              name="level"
              value={formOrdination.level || ""}
              onChange={handleChange}
              placeholder="Enter your level"
            ></input>
          </p>
          <p>Position: {userData.position}</p>
          <p>
            Birthday:{" "}
            {dayjs(userData.birthday)
              .add(543, "year")
              .locale("th")
              .format("D MMM YYYY")}
          </p>
          <p>
            วันที่เข้ารับราชการ:{" "}
            {dayjs(userData.start_of_work_on)
              .add(543, "year")
              .locale("th")
              .format("D MMM YYYY")}
          </p>
          <p>ครั้งที่ {statData.leave_count + 1} /ปี</p>
          <p>ลาอุปสมบทไปแล้ว {statData.OL_DayCount} วัน</p>
          <label>
            To:
            <input
              type="text"
              name="to"
              value={formOrdination.to}
              onChange={handleChange}
              required
              placeholder="Enter your superior"
            />
          </label>
          <br />
          <br />
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              เคยอุปสมบทหรือไม่?
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="useTo"
              onChange={handleChange}
              value={formOrdination.useTo || ""}
            >
              <FormControlLabel value="1" control={<Radio />} label="เคย" />
              <FormControlLabel value="0" control={<Radio />} label="ไม่เคย" />
            </RadioGroup>
          </FormControl>
          <br />
          <label>
            Temple:
            <input
              type="text"
              name="nameTemple"
              value={formOrdination.nameTemple}
              onChange={handleChange}
              required
              placeholder="Enter your name of temple"
            />
          </label>
          <br />
          <label>
            Address of Temple:
            <input
              type="text"
              name="addressTemple"
              value={formOrdination.addressTemple}
              onChange={handleChange}
              required
              placeholder="Enter your address of temple"
            />
          </label>
          <br />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <DatePicker
                onChange={(date) =>
                  handleChange({
                    target: { value: date, name: "dateOrdi" },
                  })
                }
                value={formOrdination.dateOrdi || null}
                label="อุปสมบทวันที่"
                name="dateOrdi"
              />
            </DemoContainer>
          </LocalizationProvider>
          <br />
          <label>
            จำพรรษาอยู่ ณ
            <input
              type="text"
              name="stayTemple"
              value={formOrdination.stayTemple}
              onChange={handleChange}
              required
              placeholder="Enter your name of stay temple"
            />
          </label>
          <br />
          <label>
            ตั้งอยู่ ณ
            <input
              type="text"
              name="addressStayTemple"
              value={formOrdination.addressStayTemple}
              onChange={handleChange}
              required
              placeholder="Enter your address of stay temple"
            />
          </label>
          <br />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <DatePicker
                onChange={(date) =>
                  handleChange({
                    target: { value: date, name: "firstDay" },
                  })
                }
                value={formOrdination.firstDay || dayjs()}
                label="firstDay"
                name="firstDay"
              />
            </DemoContainer>
          </LocalizationProvider>
          <br />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <DatePicker
                onChange={(date) =>
                  handleChange({
                    target: { value: date, name: "lastDay" },
                  })
                }
                value={formOrdination.lastDay || dayjs()}
                label="lastDay"
                name="lastDay"
              />
            </DemoContainer>
          </LocalizationProvider>

          <br />
          <p>
            Number days:{" "}
            {formOrdination.firstDay && formOrdination.lastDay && (
              <>{formOrdination.numDay}</>
            )}
          </p>
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

export default OrdinationLeave;

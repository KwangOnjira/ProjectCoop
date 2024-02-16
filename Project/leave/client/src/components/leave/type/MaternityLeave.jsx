import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import SubmitButtonAndModal from "../../Popup";
import { findBusinessDays } from "../../../function/BusinessDay";
import { currentUser } from "../../../function/auth";
import { getHoliday } from "../../../function/holiday";
import { createStat, getLastStatistic } from "../../../function/statistic";
import { postMLLeave } from "../../../function/leave";

const MaternityLeave = () => {
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
    leave_count: "",
    ML_DayCount: "",
    total_leaveDay: 0,
  });
  const [formMaternity, setFormMaternity] = useState({
    leaveID: "",
    citizenID: "",
    statisticID: "",
    type: "",
    topic: "",
    to: "",
    date: "",
    contact: "",
    firstDay: "",
    lastDay: "",
    numDay: "",
    status: "",
    allow: "",
    comment: "",
  });
  console.log(formMaternity);

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
          ML_DayCount: fetchStat.data.ML_DayCount,
          total_leaveDay: fetchStat.data.total_leaveDay,
        }));

        setFormMaternity((prevData) => ({
          ...prevData,
          citizenID: fetchUser.data.citizenID,
          statisticID: fetchStat.data.statisticID,
          name: fetchUser.data.name,
          position: fetchUser.position,
          divisionName: fetchUser.data.divisionName,
          sub_division: fetchUser.data.sub_division,
          leave_count: fetchStat.data.leave_count,
          ML_DayCount: fetchStat.data.ML_DayCount,
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

    setFormMaternity((prevData) => {
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
    console.log("formMaternity:", formMaternity);
    try {
      const response = await postMLLeave(
        { ...formMaternity, topic: "ขอลาคลอด", date: currentDate },
        localStorage.getItem("token")
      );

      const responseStat = await createStat(
        {
          ...statData,
          leave_count: statData.leave_count + 1,
          ML_DayCount: statData.ML_DayCount + formMaternity.numDay,
          total_leaveDay: statData.total_leaveDay + formMaternity.numDay
        },
        localStorage.getItem("token")
      );

      console.log(response.data);
      setFormMaternity(response.data);
      setStatData((prevData) => ({
        ...prevData,
        leave_count: prevData.leave_count + 1,
        ML_DayCount: prevData.ML_DayCount + formMaternity.numDay,
        total_leaveDay: statData.total_leaveDay + formMaternity.numDay
      }));
    } catch (error) {
      console.log("Post Form Maternity Failed: " + error);
    }
  };

  return (
    <div>
      <h2>MaternityLeave</h2>
      {userData && (
        <form onSubmit={handleSubmit}>
          <p>Name: {userData.name}</p>
          <p>Division: {userData.divisionName}</p>
          <p>Sub Division: {userData.sub_division}</p>
          <p>Position: {userData.position}</p>
          <p>ครั้งที่ {statData.leave_count + 1} /ปี</p>
          <p>ลาคลอดไปแล้ว {statData.ML_DayCount} วัน</p>
          <label>
            To:
            <input
              type="text"
              name="to"
              value={formMaternity.to}
              onChange={handleChange}
              required
              placeholder="Enter your superior"
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
                value={formMaternity.firstDay || null}
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
                value={formMaternity.lastDay || null}
                label="lastDay"
                name="lastDay"
              />
            </DemoContainer>
          </LocalizationProvider>

          <br />
          <p>
            Number days:{" "}
            {formMaternity.firstDay && formMaternity.lastDay && (
              <>{formMaternity.numDay}</>
            )}
          </p>
          <label>
            Contact:
            <input
              type="text"
              name="contact"
              value={formMaternity.contact}
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

export default MaternityLeave;

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import SubmitButtonAndModal from "../../Popup";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { findBusinessDays } from "../../../function/BusinessDay";
import { createStat, getLastStatistic } from "../../../function/statistic";
import { getHoliday } from "../../../function/holiday";
import { postSTLLeave } from "../../../function/leave";
import { currentUser } from "../../../function/auth";

const StudyLeave = () => {
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    position: "",
    phone: "",
    divisionName: "",
    sub_division: "",
  });
  const [holiData, setHoliData] = useState({
    name: "",
    date: "",
  });
  const [statData, setStatData] = useState({
    leave_count: "",
    STL_DayCount: "",
    total_leaveDay: 0,
  });
  const [formStudy, setFormStudy] = useState({
    citizenID: "",
    statisticID: "",
    type: "",
    topic:"",
    to: "",
    date: "",
    contact: "",
    firstDay: "",
    lastDay: "",
    numDay: 0,
    status: "",
    allow: "",
    comment: "",
    level: "",
    salaryNumber: "",
    salaryAlphabet: "",
    typeStudy: "",
    subject: "",
    degree: "",
    academy: "",
    countrystudy: "",
    scholarshipstudy: "",
    course: "",
    address: "",
    countrytrain: "",
    scholartrain: "",
  });
  console.log(formStudy);

  const calculateDateDifference = () => {
    if (formStudy.firstDay && formStudy.lastDay) {
      const startDate = dayjs(formStudy.firstDay);
      const endDate = dayjs(formStudy.lastDay);

      const diffMonths = endDate.diff(startDate, "month", true); // Use 'true' to get a floating-point result

      const years = Math.floor(diffMonths / 12);
      const remainingMonthsAfterYears = diffMonths % 12;
      const months = Math.floor(remainingMonthsAfterYears);
      const days =
        Math.round(
          (remainingMonthsAfterYears - months) * endDate.daysInMonth()
        ) + 1;
      return {
        years,
        months,
        days,
      };
    }

    return {
      years: 0,
      months: 0,
      days: 0,
    };
  };

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
          STL_DayCount: fetchStat.data.STL_DayCount,
          total_leaveDay: fetchStat.data.total_leaveDay,
        }));

        setFormStudy((prevData) => ({
          ...prevData,
          citizenID: fetchUser.data.citizenID,
          statisticID: fetchStat.data.statisticID,
          name: fetchUser.data.name,
          phone: fetchUser.data.phone,
          position: fetchUser.position,
          divisionName: fetchUser.data.divisionName,
          sub_division: fetchUser.data.sub_division,
          leave_count: fetchStat.data.leave_count,
          STL_DayCount: fetchStat.data.STL_DayCount,
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

    setFormStudy((prevData) => {
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
    console.log("formStudy:", formStudy);
    try {
      const response = await postSTLLeave(
        {
          ...formStudy,
          topic:"ขอลาไปศึกษา ฝึกอบรม ปฏิบัติการวิจัย หรือดูงาน",
          date: currentDate,
        },
        localStorage.getItem("token")
      );

      const responseStat = await createStat(
        {
          ...statData,
          leave_count: statData.leave_count + 1,
          STL_DayCount: statData.STL_DayCount + formStudy.numDay,
          total_leaveDay: statData.total_leaveDay + formStudy.numDay
        },
        localStorage.getItem("token")
      );

      console.log(response.data);
      setFormStudy(response.data);
      console.log(responseStat.data);
      setStatData((prevData) => ({
        ...prevData,
        leave_count: prevData.leave_count + 1,
        STL_DayCount: prevData.STL_DayCount + formStudy.numDay,
        total_leaveDay: statData.total_leaveDay + formStudy.numDay
      }));
    } catch (error) {
      console.log("Post Form Study Failed: " + error);
    }
  };

  return (
    <div>
      <h2>Study Leave</h2>
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
              value={formStudy.level || ""}
              onChange={handleChange}
              placeholder="Enter your level"
            ></input>
          </p>
          <p>Position: {userData.position}</p>
          <p>ครั้งที่ {statData.leave_count + 1} /ปี</p>
          <label>
            To:
            <input
              type="text"
              name="to"
              value={formStudy.to}
              onChange={handleChange}
              required
              placeholder="Enter your superior"
            />
          </label>
          <p>
            เงินเดือน:{" "}
            <input
              type="text"
              name="salaryNumber"
              value={formStudy.salaryNumber}
              onChange={handleChange}
              required
              placeholder="กรอกเงินเดือนของคุณ"
            />
            |{" "}
            <input
              type="text"
              name="salaryAlphabet"
              value={formStudy.salaryAlphabet}
              onChange={handleChange}
              required
              placeholder="พิมพ์เงินเดือนของคุณ"
            />
            |
          </p>
          <FormControl>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="typeStudy"
              onChange={handleChange}
              value={formStudy.typeStudy || ""}
            >
              <FormControlLabel
                value="ศึกษา"
                control={<Radio />}
                label="ศึกษา"
              />
              <FormControlLabel
                value="ฝึกอบรม"
                control={<Radio />}
                label="ฝึกอบรม"
              />
              <FormControlLabel
                value="ปฏิบัติการวิจัย"
                control={<Radio />}
                label="ปฏิบัติการวิจัย"
              />
              <FormControlLabel
                value="ดูงาน"
                control={<Radio />}
                label="ดูงาน"
              />
            </RadioGroup>
          </FormControl>
          <br />
          {formStudy.typeStudy === "ศึกษา" && (
            <>
              <p>
                วิชา:
                <input
                  type="text"
                  name="subject"
                  value={formStudy.subject || ""}
                  onChange={handleChange}
                  placeholder="subject"
                ></input>
              </p>
              <p>
                ขั้นปริญญา:
                <input
                  type="text"
                  name="degree"
                  value={formStudy.degree || ""}
                  onChange={handleChange}
                  placeholder="degree"
                ></input>
              </p>
              <p>
                สถานศึกษา:
                <input
                  type="text"
                  name="academy"
                  value={formStudy.academy || ""}
                  onChange={handleChange}
                  placeholder="academy"
                ></input>
              </p>
              <p>
                ประเทศ:
                <input
                  type="text"
                  name="countrystudy"
                  value={formStudy.countrystudy || ""}
                  onChange={handleChange}
                  placeholder="countrystudy"
                ></input>
              </p>
              <p>
                ทุน:
                <input
                  type="text"
                  name="scholarshipstudy"
                  value={formStudy.scholarshipstudy || ""}
                  onChange={handleChange}
                  placeholder="scholarshipstudy"
                ></input>
              </p>
            </>
          )}

          {(formStudy.typeStudy === "ฝึกอบรม" ||
            formStudy.typeStudy === "ปฏิบัติการวิจัย") && (
            <>
              <p>
                ณ
                <input
                  type="text"
                  name="address"
                  value={formStudy.address || ""}
                  onChange={handleChange}
                  placeholder="address"
                ></input>
              </p>
              <p>
                ประเทศ
                <input
                  type="text"
                  name="countrytrain"
                  value={formStudy.countrytrain || ""}
                  onChange={handleChange}
                  placeholder="countrytrain"
                ></input>
              </p>
              <p>
                ทุน
                <input
                  type="text"
                  name="scholartrain"
                  value={formStudy.scholartrain || ""}
                  onChange={handleChange}
                  placeholder="scholartrain"
                ></input>
              </p>
            </>
          )}

          {formStudy.typeStudy === "ดูงาน" && (
            <>
              <p>
                ด้าน/หลักสูตร
                <input
                  type="text"
                  name="course"
                  value={formStudy.course || ""}
                  onChange={handleChange}
                  placeholder="course"
                ></input>
              </p>
              <p>
                ณ
                <input
                  type="text"
                  name="address"
                  value={formStudy.address || ""}
                  onChange={handleChange}
                  placeholder="address"
                ></input>
              </p>
              <p>
                ประเทศ
                <input
                  type="text"
                  name="countrytrain"
                  value={formStudy.countrytrain || ""}
                  onChange={handleChange}
                  placeholder="countrytrain"
                ></input>
              </p>
              <p>
                ทุน
                <input
                  type="text"
                  name="scholartrain"
                  value={formStudy.scholartrain || ""}
                  onChange={handleChange}
                  placeholder="scholartrain"
                ></input>
              </p>
            </>
          )}

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <DatePicker
                onChange={(date) =>
                  handleChange({
                    target: { value: date, name: "firstDay" },
                  })
                }
                value={formStudy.firstDay || null}
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
                value={formStudy.lastDay || null}
                label="lastDay"
                name="lastDay"
              />
            </DemoContainer>
          </LocalizationProvider>

          <br />
          <p>
            Number days:{" "}
            {formStudy.firstDay && formStudy.lastDay && (
              <>
                {formStudy.numDay} (
                {calculateDateDifference().years > 0 && (
                  <>
                    {calculateDateDifference().years} year
                    {calculateDateDifference().years > 1 && "s"}{" "}
                  </>
                )}
                {calculateDateDifference().months > 0 && (
                  <>
                    {calculateDateDifference().months} month
                    {calculateDateDifference().months > 1 && "s"}{" "}
                  </>
                )}
                {calculateDateDifference().days > 0 && (
                  <>
                    {calculateDateDifference().days} day
                    {calculateDateDifference().days > 1 && "s"}{" "}
                  </>
                )}
                )
              </>
            )}
          </p>
          <label>
            Contact:
            <input
              type="text"
              name="contact"
              value={formStudy.contact}
              onChange={handleChange}
              required
              placeholder="Enter your contact"
            />
          </label>
          <br />
          <p>หมายเลขโทรศัพท์: {userData.phone}</p>
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

export default StudyLeave;

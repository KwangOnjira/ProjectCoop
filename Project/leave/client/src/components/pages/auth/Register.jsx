import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { differenceInCalendarDays, differenceInYears, formatDuration, intervalToDuration } from "date-fns";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import { register } from "../../../function/auth";

const Register = () => {
  const navigate = useNavigate();

  const divisions = [
    "--Division--",
    "สำนักปลัด อบจ.",
    "สำนักงานเลขานุการ อบจ.",
    "กองยุทธศาสตร์และงบประมาณ",
    "กองคลัง",
    "กองช่าง",
    "กองการศึกษา ศาสนาและวัฒนธรรม",
    "กองพัสดุและทรัพย์สิน",
    "กองสาธารณสุข",
    "กองการเจ้าหน้าที่",
  ];

  const subDivisions = {
    "--Division--": ["--Sub Division--"],
    "สำนักปลัด อบจ.": [
      "ฝ่ายอำนวยการ",
      "กลุ่มงานนิติการ",
      "ฝ่ายส่งเสริมการท่องเที่ยว",
      "ฝ่ายสวัสดิการสังคม",
    ],
    "สำนักงานเลขานุการ อบจ.": [
      "ฝ่ายการประชุม",
      "ฝ่ายกิจการสภา",
      "ฝ่ายกิจการคณะผู้บริหาร",
    ],
    กองยุทธศาสตร์และงบประมาณ: [
      "ฝ่ายนโยบายและแผนงาน",
      "ฝ่ายงบประมาณ",
      "ฝ่ายวิจัยและประเมินผล",
      "ฝ่ายประชาสัมพันธ์",
    ],
    กองคลัง: [
      "ฝ่ายการเงินและบัญชี",
      "ฝ่ายบริหารงานคลัง",
      "ฝ่ายเร่งรัดและจัดเก็บรายได้",
      "ฝ่ายบริหารงานทั่วไป",
    ],
    กองช่าง: [
      "ฝ่ายสำรวจและออกแบบ",
      "ฝ่ายก่อสร้างและซ่อมบำรุง",
      "ฝ่ายเครื่องจักรกล",
      "ฝ่ายสาธารณูปโภค",
      "ฝ่ายผังเมือง",
      "ฝ่ายบริหารงานทั่วไป",
    ],
    "กองการศึกษา ศาสนาและวัฒนธรรม": [
      "ฝ่ายบริหารการศึกษา",
      "ฝ่ายส่งเสริมการศึกษา ศาสนาและวัฒนธรรม",
    ],
    กองพัสดุและทรัพย์สิน: [
      "ฝ่ายจัดซื้อ",
      "ฝ่ายทะเบียนพัสดุและทรัพย์สิน",
      "ฝ่ายจัดจ้าง",
      "ฝ่ายบริหารงานทั่วไป",
    ],
    กองสาธารณสุข: [
      "ฝ่ายบริหารงานสาธารณสุข",
      "ฝ่ายป้องกันและควบคุมโรค",
      "ฝ่ายส่งเสริมสุขภาพ",
      "ฝ่ายบริหารงานทั่วไป",
      "โรงพยาบาลส่งเสริมสุขภาพตำบล",
    ],
    กองการเจ้าหน้าที่: [
      "ฝ่ายสรรหาและบรรจุแต่งตั้ง",
      "ฝ่ายส่งเสริมและพัฒนาบุคลากร",
      "ฝ่ายวินัยและส่งเสริมคุณธรรม",
      "ฝ่ายการเจ้าหน้าที่",
    ],
  };

  const [formData, setFormData] = useState({
    citizenID: "",
    prefix: "",
    name: "",
    surname: "",
    role: "user",
    email: "",
    phone: "",
    divisionName: "--Division--",
    sub_division: "--Sub Division--",
    position: "",
    password: "",
    birthday: null,
    type_of_employee: "",
    start_of_work_on: null,
    number_year_in_work: "",
    who_inspector: "",
    who_first_supeior: "",
    who_second_supeior: "",
  });
  console.log(formData);
  
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "start_of_work_on") {
      const currentDate = new Date();
      const startOfWorkDate = new Date(value);

      const duration = intervalToDuration({ start: startOfWorkDate, end: currentDate });

      console.log(duration)

      const durationString = [
        duration.years !== undefined ? `${duration.years} years` : null,
        duration.months !== undefined ? `${duration.months} months` : null,
        duration.days !== undefined ? `${duration.days} days` : null,
      ].filter(Boolean).join(', ');
      
      setFormData((prevData) => ({
        ...prevData,
        number_year_in_work: durationString,
        [name]: value,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      register(formData)
      console.log("Registration Successful");
      navigate("/login");
    } catch (error) {
      console.log("Registration Failed: " + error);
    }
  };

  console.log(formData);

  return (
    <div className="registration-container">
      <h2>Registration Page</h2>
      <form onSubmit={handleSubmit}>
      <FormControl>
          <FormLabel id="demo-row-radio-buttons-group-label">Gender</FormLabel>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="prefix"
            onChange={handleChange}
            value={formData.prefix}
          >
            <FormControlLabel
              value="นางสาว"
              control={<Radio />}
              label="นางสาว"
            />
            <FormControlLabel value="นาง" control={<Radio />} label="นาง" />
            <FormControlLabel value="นาย" control={<Radio />} label="นาย" />
          </RadioGroup>
        </FormControl>
        <br />
      <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Enter your Name"
        />
        <br />
        <input
          type="text"
          name="surname"
          value={formData.surname}
          onChange={handleChange}
          required
          placeholder="Enter your Surname"
        />
        <br />
        <input
          type="number"
          name="citizenID"
          value={formData.citizenID}
          onChange={handleChange}
          required
          placeholder="Enter your CitizenID"
        />
        <br />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          placeholder="Enter your Password"
        />
        <br />
        <input
          type="text"
          name="position"
          value={formData.position}
          onChange={handleChange}
          required
          placeholder="Enter your Position"
        />
        <br />
        <Box>
          <FormControl fullWidth>
            <InputLabel id="divisionName">Division</InputLabel>
            <Select
              labelId="divisionName"
              id="division"
              value={formData.divisionName}
              label="Division"
              name="divisionName"
              onChange={handleChange}
            >
              {divisions.map((division) => {
                return <MenuItem value={division}>{division}</MenuItem>;
              })}
            </Select>
          </FormControl>
          <br />
          <br />
          <FormControl fullWidth>
            <InputLabel id="subDivision">Sub Division</InputLabel>
            {formData.divisionName && (
              <Select
                labelId="subDivision"
                id="sub_division"
                value={formData.sub_division}
                label="Sub Division"
                name="sub_division"
                onChange={handleChange}
              >
                {subDivisions[formData.divisionName].map((subDivision) => {
                  return <MenuItem value={subDivision}>{subDivision}</MenuItem>;
                })}
              </Select>
            )}
          </FormControl>
          <br />
        </Box>
        <br />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker"]}>
            <DatePicker
              fullWidth
              sx={{
                "& .MuiInputBase-root": {
                  height: "43px",
                },
              }}
              onChange={(date) =>
                handleChange({
                  target: { value: date, name: "birthday" },
                })
              }
              value={formData.birthday}
              label="Birthday"
              name="birthday"
            />
          </DemoContainer>
        </LocalizationProvider>
        <br />
        <input
          type="text"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="Enter your Email"
        />
        <br />
        <input
          type="number"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          placeholder="Enter your Phone"
        />
        <br />
        <FormControl>
          <FormLabel id="demo-row-radio-buttons-group-label">
            Type of employee
          </FormLabel>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="type_of_employee"
            onChange={handleChange}
            value={formData.type_of_employee}
          >
            <FormControlLabel
              value="ข้าราชการ"
              control={<Radio />}
              label="ข้าราชการ"
            />
            <FormControlLabel value="ลูกจ้างประจำ" control={<Radio />} label="ลูกจ้างประจำ" />
            <FormControlLabel value="พนักงานจ้างตามภารกิจ" control={<Radio />} label="พนักงานจ้างตามภารกิจ" />
            <FormControlLabel value="จ้างทั่วไป" control={<Radio />} label="จ้างทั่วไป" />
          </RadioGroup>
        </FormControl>
        <br />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker"]}>
            <DatePicker
              fullWidth
              sx={{
                "& .MuiInputBase-root": {
                  height: "43px",
                },
              }}
              onChange={(date) =>
                handleChange({
                  target: { value: date, name: "start_of_work_on" },
                })
              }
              value={formData.start_of_work_on}
              label="Start of work on"
              name="start_of_work_on"
            />
          </DemoContainer>
        </LocalizationProvider>
        <br />
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};
export default Register;

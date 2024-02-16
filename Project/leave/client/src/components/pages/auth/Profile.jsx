import { MenuItem, Select } from "@mui/base";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import React, { useState, useEffect } from "react";
import { currentUser, updateUser } from "../../../function/auth";

const Profile = () => {
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

  const [userData, setUserData] = useState({
    citizenID: "",
    prefix: "",
    name: "",
    surname: "",
    role: "",
    email: "",
    phone: "",
    divisionName: "--Division--",
    sub_division: "--Sub Division--",
    position: "",
    password: "",
    birthday: "",
    type_of_employee: "",
    start_of_work_on: "",
    number_year_in_work: "",
    who_inspector: "",
    who_first_supeior: "",
    who_second_supeior: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await currentUser(localStorage.getItem("token"))
        console.log(response.data);
        setUserData(response.data);
      } catch (err) {
        console.log("Error fetching user profile data: " + err);
      }
    };

    fetchUserData();
  }, []);

  const updateUserData = async () => {
    try {
      const response = await updateUser(userData,localStorage.getItem("token"))

      setUserData(response.data);
    } catch (err) {
      console.log("Error updating user profile data: " + err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "start_of_work_on") {
      const currentDate = new Date();
      const startOfWorkDate = new Date(value);

      const yearsOfWork = differenceInYears(currentDate, startOfWorkDate);

      // Update the state with the calculated years
      setUserData((prevData) => ({
        ...prevData,
        number_year_in_work: yearsOfWork,
        [name]: value,
      }));
    } else {
      // For other fields, simply update the state
      setUserData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  return (
    <div className="profile-container">
      <div>
        <h2>Profile Page</h2>
        <h2>Your CitizenID is: {userData.citizenID} </h2>
        <form onSubmit={updateUserData}>
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              Gender
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="prefix"
              onChange={handleChange}
              value={userData.prefix}
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
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={handleChange}
            required
          />
          <br />
          <label>Surname</label>
          <input
            type="text"
            name="surname"
            value={userData.surname}
            onChange={handleChange}
            required
          />
          <br />
          <label>Phone</label>
          <input
            type="number"
            name="phone"
            value={userData.phone}
            onChange={handleChange}
            required
          />
          <br />
          <label>Position</label>
          <input
            type="text"
            name="position"
            value={userData.position}
            onChange={handleChange}
            required
          />
          <br />
          <label>Role</label>
        <input
          type="text"
          name="role"
          value={userData.role}
          onChange={handleChange}
          required
        />
        <br />
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={userData.email}
          onChange={handleChange}
          required
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
            value={userData.type_of_employee}
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

          <h2>Your Name is: {userData.name} </h2>
          <h2>Your Division is: {userData.divisionName} </h2>
          <h2>Your Sub-Division is: {userData.sub_division} </h2>
          <button type="submit">Update Profile</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;

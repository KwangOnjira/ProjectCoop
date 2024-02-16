import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login as loginRedux } from "../../../store/userSlice";
import { currentUser, login } from "../../../function/auth";
import { createStat, getLastStatistic } from "../../../function/statistic";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    citizenID: "",
    password: "",
    role: "",
  });

  const [statData, setStatdata] = useState({
    leave_rights: null,
    VL_accumulatedDays: null,
    VL_total: null,
    VL_lastLeave: null,
    VL_thisLeave: null,
    currentUseVL:null,
    VL_remaining: null,
    leave_count: null,
    SL_lastLeave: null,
    SL_thisLeave: null,
    SL_remaining: null,
    PL_lastLeave: null,
    PL_thisLeave: null,
    PL_remaining: null,
    ML_DayCount: null,
    OL_DayCount: null,
    STL_DayCount: null,
    total_leaveDay:0,
  });

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (formData.role === "admin") {
      console.log("Navigating to admin");
      navigate("/admin");
    } else if (formData.role === "user") {
      console.log("Navigating to user homepage");
      navigate("/home");
    } else if (formData.role === "inspector") {
      console.log("Navigating to inspector homepage");
      navigate("/inspector");
    } else if (formData.role === "superior") {
      console.log("Navigating to superior homepage");
      navigate("/superior");
    }
  }, [formData.role, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(formData);
      // console.log(response);
      const token = response.data.accessToken;
      // console.log("Login Token is: " + token);
      //   console.log(response);
      dispatch(
        loginRedux({
          citizenID: response.data.citizenID,
          prefix: response.data.prefix,
          name: response.data.name,
          surname: response.data.surname,
          role: response.data.role,
          email: response.data.email,
          phone: response.data.phone,
          divisionName: response.data.divisionName,
          sub_division: response.data.sub_division,
          position: response.data.position,
          password: response.data.password,
          birthday: response.data.birthday,
          type_of_employee: response.data.type_of_employee,
          start_of_work_on: response.data.start_of_work_on,
          number_year_in_work: response.data.number_year_in_work,
          who_inspector: response.data.who_inspector,
          who_first_supeior: response.data.who_first_supeior,
          who_second_supeior: response.data.who_second_supeior,
          token: token,
        })
      );

      localStorage.setItem("token", token);
      setError("");

      const fetchUserData = async () => {
        try {
          const response = await currentUser(localStorage.getItem("token"));
          // console.log(response.data);

          setFormData(
            (prevData) => ({
              ...prevData,
              role: String(response.data.role),
            }),
            () => {
              console.log(formData);
            }
          );
        } catch (error) {
          console.log("Error Fetching user profile data: " + error);
        }
      };
      fetchUserData();

      const fetchStateData = async () => {
        try {
          const responseStat = await getLastStatistic(
            localStorage.getItem("token")
          );
          console.log("Response from server:", responseStat);

          if (formData.role != "admin") {
            if (responseStat === null) {
              try {
                const createInit = await createStat(
                  {
                    leave_rights: 10,
                    VL_accumulatedDays: 0,
                    VL_total: 10,
                    VL_lastLeave: 0,
                    VL_thisLeave: 0,
                    currentUseVL:0,
                    VL_remaining: 10,
                    leave_count: 0,
                    SL_lastLeave: 0,
                    SL_thisLeave: 0,
                    SL_remaining: 0,
                    PL_lastLeave: 0,
                    PL_thisLeave: 0,
                    PL_remaining: 0,
                    ML_DayCount: 0,
                    OL_DayCount: 0,
                    STL_DayCount: 0,
                    total_leaveDay:0,
                  },
                  localStorage.getItem("token")
                );

                console.log(createInit);
                setStatdata(createInit);
              } catch (error) {
                console.error("Error creating initial statistics:", error);
              }
            } else {
              const lastStatisticID = responseStat.statisticID;
              console.log("Last Statistic ID:", lastStatisticID);
              setStatdata(responseStat);
            }
          }
        } catch (error) {
          console.log("Error Fetching user statistic data: " + error);
        }
      };
      fetchStateData();

      console.log("StatData: ", statData);

      if (statData === null) {
        try {
          const createInit = await createStat(
            {
              ...statData,
              leave_rights: 10,
              VL_accumulatedDays: 0,
              VL_total: 10,
              VL_lastLeave: 0,
              VL_thisLeave: 0,
              currentUseVL:0,
              VL_remaining: 10,
              leave_count: 0,
              SL_lastLeave: 0,
              SL_thisLeave: 0,
              SL_remaining: 0,
              PL_lastLeave: 0,
              PL_thisLeave: 0,
              PL_remaining: 0,
              ML_DayCount: 0,
              OL_DayCount: 0,
              STL_DayCount: 0,
              total_leaveDay:0,
            },
            localStorage.getItem("token")
          );

          console.log(createInit);
          setStatdata(createInit);
        } catch (error) {}
      }
    } catch (error) {
      console.log("Login Failed: " + error);
      setError(error.response.data.message);
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  return (
    <div className="login-container">
      <h2>Login Page</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          name="citizenID"
          value={formData.citizenID}
          onChange={handleChange}
          required
          placeholder="CitizenID"
        />
        <br />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          placeholder="Password"
        />
        <br />
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Login</Link>
      </p>
    </div>
  );
};
export default Login;

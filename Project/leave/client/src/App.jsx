import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Register from "./components/pages/auth/Register";
import Login from "./components/pages/auth/Login";
import Profile from "./components/pages/auth/Profile";
import Statistics from "./components/pages/statistic/Statistics";
import "./App.css";
import TestGetProfile from "./components/pages/auth/TestGetProfile";
import TypeLeave from "./components/leave/TypeLeave";
import FormLeave from "./components/leave/FormLeave";
import HomePageAdmin from "./components/pages/admin/HomePageAdmin";
import AdminRoute from "./routes/AdminRoute";
import UserRoute from "./routes/UserRoute";
import { currentUser } from "./function/auth";
import { useDispatch } from "react-redux";
import { login } from "./store/userSlice";
import Notfound404 from "./components/pages/Notfound404";
import ResponsiveAppBar from "./components/layout/ResponsiveAppBar";
import InspectorRoute from "./routes/InspectorRoute";
import RequestToSuperior from "./components/pages/superior/RequestToSuperior";
import StatDivision from "./components/pages/inspector/StatDivision";
import SuperiorRoute from "./routes/SuperiorRoute";
import RequestFromUser from "./components/pages/inspector/RequestFromUser";
import StatPerPerson from "./components/pages/inspector/StatPerPerson";
import EditStatistic from "./components/pages/inspector/EditStatistic";
import EditDetailStatistic from "./components/pages/inspector/EditDetailStatistic";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const dispatch = useDispatch();

  const authenticate = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log(token);
      currentUser(token)
        .then((response) => {
          console.log(response);
          dispatch(
            login({
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
        })
        .catch((err) => console.log(err));
      // if (token) {
      //   setLoggedIn(true);
      // } else {
      //   setLoggedIn(false);
      // }
    } catch (err) {
      console.log(err);
      // setLoggedIn(false);
    }
  };

  useEffect(() => {
    authenticate();
  }, []);


  return (
    <BrowserRouter>
      {/*Publish */}
      <Routes>
        <Route
          path="*"
          element={
            <Notfound404 text="The page you’re looking for doesn’t exist." />
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Navigate to={"/"} />} />
        <Route
          path="/"
          element={
            <>
              <ResponsiveAppBar />
              <h1>HomePage</h1>
            </>
          }
        />
        

        {/* Normal User */}
        <Route
          path="/home"
          element={
            <UserRoute>
              <Home />
            </UserRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <UserRoute>
              <Profile />
            </UserRoute>
          }
        />
        <Route
          path="/getProfile"
          element={
            <UserRoute>
              <TestGetProfile />
            </UserRoute>
          }
        />
        <Route
          path="/statistics"
          element={
            <UserRoute>
              <Statistics />
            </UserRoute>
          }
        />
        <Route
          path="/leave"
          element={
            <UserRoute>
              <TypeLeave />
            </UserRoute>
          }
        />
        <Route
          path="/leave/:type"
          element={
            <UserRoute>
              <FormLeave />
            </UserRoute>
          }
        />

        {/*Admin*/}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <HomePageAdmin />
            </AdminRoute>
          }
        />

        {/*Inspector*/}
        <Route
          path="/inspector"
          element={
            <InspectorRoute>
              <StatDivision />
            </InspectorRoute>
          }
        />
        <Route
          path="/inspector/edit"
          element={
            <InspectorRoute>
              <EditStatistic />
            </InspectorRoute>
          }
        />
        <Route
          path="/inspector/request"
          element={
            <InspectorRoute>
              <RequestFromUser />
            </InspectorRoute>
          }
        />
        <Route
          path="/inspector/detail/:citizenID"
          element={
            <InspectorRoute>
              <StatPerPerson />
            </InspectorRoute>
          }
        />
        <Route
          path="/inspector/edit/detail/:citizenID"
          element={
            <InspectorRoute>
              <EditDetailStatistic />
            </InspectorRoute>
          }
        />
        
        
        {/*Superior*/}
        <Route
          path="/superior"
          element={
            <SuperiorRoute>
              <RequestToSuperior />
            </SuperiorRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

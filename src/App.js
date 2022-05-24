import React from 'react'
import { Container} from 'react-bootstrap';
import {HashRouter as Router, Routes, Route} from "react-router-dom";

import "./App.css";
import HomePage from './Page_Home';
import SettingPage from './Page_Setting';
import EventPage from './Page_Event';
import RegistrationPage from './Page_Registration';
import RegisterNewPage from './Page_Registration_New';
import RegisterManyPage from './Page_Registration_Many';
import PrintPage from './Page_Print';
import EditPage from './Page_Edit';
import CheckInPage from './Page_Check_In';
import ReportPage from './Page_Report';

function App() {
  return (
    <Container fluid style={{ minHeight: "100vh"}}>
        <Router>
          <Routes>
            <Route exact path="/" element={<HomePage/>} />
            <Route path="/setting" element={<SettingPage/>} />
            <Route path="/event" element={<EventPage/>} />
            <Route path="/registration" element={<RegistrationPage/>} />
            <Route path="/register-new" element={<RegisterNewPage/>} />
            <Route path="/register-many" element={<RegisterManyPage/>} />
            <Route path="/print" element={<PrintPage/>} />
            <Route path="/edit" element={<EditPage/>} />
            <Route path="/check-in" element={<CheckInPage/>} />
            <Route path="/report" element={<ReportPage/>} />
          </Routes>
        </Router>
    </Container>
  );
}

export default App;

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import IssueReport from './pages/IssueReport';
import IssueTracking from './pages/IssueTracking';
import Notifications from './pages/Notifications';
import AdminPanel from './pages/AdminPanel';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import HelpCenter from './pages/HelpCenter';
import IssueDetails from './pages/IssueDetails';
import Reports from './pages/Reports';
import StaffManagement from './pages/StaffManagement';
import UserManagement from './pages/UserManagement';
import SchoolInfo from './pages/SchoolInfo';
import FacilityList from './pages/FacilityList';
import FacilityDetails from './pages/FacilityDetails';
import RepairSchedule from './pages/RepairSchedule';
import VendorList from './pages/VendorList';
import BudgetManagement from './pages/BudgetManagement';
import Inventory from './pages/Inventory';
import SafetyInspection from './pages/SafetyInspection';
import ComplaintList from './pages/ComplaintList';
import Analytics from './pages/Analytics';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/report-issue" element={<IssueReport />} />
        <Route path="/track-issues" element={<IssueTracking />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/issue/:id" element={<IssueDetails />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/staff-management" element={<StaffManagement />} />
        <Route path="/user-management" element={<UserManagement />} />
        <Route path="/school-info" element={<SchoolInfo />} />
        <Route path="/facility-list" element={<FacilityList />} />
        <Route path="/facility/:id" element={<FacilityDetails />} />
        <Route path="/repair-schedule" element={<RepairSchedule />} />
        <Route path="/vendor-list" element={<VendorList />} />
        <Route path="/budget-management" element={<BudgetManagement />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/safety-inspection" element={<SafetyInspection />} />
        <Route path="/complaint-list" element={<ComplaintList />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;

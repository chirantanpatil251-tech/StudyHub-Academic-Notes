import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Resources from './pages/Resources';
import ResourceDetails from './pages/ResourceDetails';
import UploadResource from './pages/UploadResource';
import Bookmarks from './pages/Bookmarks';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import AiStudyAssistant from './pages/AiStudyAssistant';
import Subjects from './pages/Subjects';
import Community from './pages/Community';
import About from './pages/About';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] text-[#0F172A] dark:text-[#F8FAFC] transition-colors duration-200">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/resources/:id" element={<ResourceDetails />} />
                <Route path="/upload" element={<UploadResource />} />
                <Route path="/bookmarks" element={<Bookmarks />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/ai-assistant" element={<AiStudyAssistant />} />
                <Route path="/subjects" element={<Subjects />} />
                <Route path="/community" element={<Community />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

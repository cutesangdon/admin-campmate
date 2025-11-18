// /src/App.js

import './App.css';
import ReservationPage from './Component/ReservationPage';
import CampingZonePage from './Component/CampingZonePage';
import LoginPage from './Component/LoginPage';
import AdminsPage from './Component/AdminPage';
import Header from './Component/header';
import SignUpPage from './Component/SignUpPage';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { fetchWithAuth } from './api';

// --- [수정] ---
import SLogin from './Component/SLogin';
// SuperAdminPage import 제거
// 3개의 신규 페이지 import
import SAccountsPage from './Component/SAccountsPage';
import SReservationsPage from './Component/SReservationsPage';
import SZonesPage from './Component/SZonesPage';
// ---------------

function AppLayout({ user, setUser }) {
  const location = useLocation();
  // --- [수정] SLogin 페이지에서도 헤더 숨김 ---
  const hideHeader = location.pathname === "/Login" || 
                     location.pathname === "/signup" || 
                     location.pathname === "/slogin";

  return (
    <>
      {!hideHeader && <Header user={user} setUser={setUser} />}
      <div className="page-container">
        <Routes>
          <Route path="/" element={<Navigate to="/Login" replace />} />
          <Route path="/Login" element={<LoginPage setUser={setUser} />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* --- [신규] SLogin 경로 추가 --- */}
          <Route path="/slogin" element={<SLogin setUser={setUser} />} />
          
          {/* --- [수정] 역할(Role)에 따른 라우트 보호 --- */}
          
          {/* 1. 일반 관리자 경로 (isSuper 플래그가 없는 경우) */}
          <Route path="/admin" element={user && !user.isSuper ? <AdminsPage user={user} setUser={setUser} /> : <Navigate to="/Login" />} />
          <Route path="/campingzone" element={user && !user.isSuper ? <CampingZonePage user={user} /> : <Navigate to="/Login" />} />
          <Route path="/reservation" element={user && !user.isSuper ? <ReservationPage user={user} /> : <Navigate to="/Login" />} />
          
          {/* 2. 전체 관리자 경로 (isSuper === true) */}
          {/* 기존 /super-admin 라우트 제거 */}
          <Route path="/s-accounts" element={user && user.isSuper === true ? <SAccountsPage user={user} /> : <Navigate to="/Login" />} />
          <Route path="/s-reservations" element={user && user.isSuper === true ? <SReservationsPage user={user} /> : <Navigate to="/Login" />} />
          <Route path="/s-zones" element={user && user.isSuper === true ? <SZonesPage user={user} /> : <Navigate to="/Login" />} />
          
        </Routes>
      </div>
    </>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const autoLogin = async () => {
      const token = localStorage.getItem('authToken');
      // --- [신규] 슈퍼 관리자 플래그 확인 ---
      const superFlag = localStorage.getItem('isSuperAdmin');

      if (superFlag === 'true') {
        // 1. Super Admin으로 자동 로그인
        setUser({ name: "Super Admin", email: "admin", isSuper: true });
      
      } else if (token) {
        // 2. 일반 Admin으로 자동 로그인
        try {
          // (필수) 백엔드에 GET /api/admins/me API가 구현되어 있어야 합니다.
          const userData = await fetchWithAuth('/api/admins/me'); 
          setUser(userData); // 이 객체에는 isSuper 플래그가 없습니다.
        } catch (error) {
          console.error("Auto login failed:", error);
          localStorage.removeItem('authToken');
        }
      }
      setLoading(false); // 모든 인증 시도가 끝나면 로딩 종료
    };
    autoLogin();
  }, []);

  if (loading) {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '20px' }}>
            로그인 정보를 확인 중입니다...
        </div>
    );
  }

  return (
    <div className="App">
      <Router>
        <AppLayout user={user} setUser={setUser} />
      </Router>
    </div>
  );
}

export default App;
// /src/Component/header.js

import React from 'react';
import { Link, useNavigate } from "react-router-dom";

function Header({ user, setUser }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        setUser(null);
        // --- [수정] 모든 로그인 흔적 제거 ---
        localStorage.removeItem("authToken");
        localStorage.removeItem("isSuperAdmin");
        // ---------------------------------
        navigate("/Login");
    };

    const welcomeMessage = user && user.name ? `${user.name}님` : "CampMate";

    return (
        <header className="header">
            <div className="header__content">
                <span className="header__logo">{welcomeMessage}</span>
                <nav className="header__nav">
                    
                    {/* --- [수정] isSuper 플래그에 따른 메뉴 분기 --- */}
                    {user && user.isSuper === true ? (
                        <>
                            {/* 슈퍼 관리자 메뉴 (3개로 분리) */}
                            <Link to="/s-accounts" className='header__nav-link'>전체 계정</Link>
                            <Link to="/s-reservations" className='header__nav-link'>전체 예약</Link>
                            <Link to="/s-zones" className='header__nav-link'>전체 캠핑존</Link>
                        </>
                    ) : user && !user.isSuper ? (
                        <>
                            {/* 일반 관리자 메뉴 */}
                            <Link to="/reservation" className='header__nav-link'>예약 관리</Link>
                            <Link to="/campingzone" className='header__nav-link'>캠핑존 관리</Link>
                            <Link to="/admin" className='header__nav-link'>계정</Link>
                        </>
                    ) : null}
                    {/* ------------------------------------------- */}

                    {user && (
                        <button onClick={handleLogout} className="header__logout-button">로그아웃</button>
                    )}
                </nav>
            </div>
        </header>
    );
}

export default Header;
// /src/Component/SLogin.js

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

// 💡 SLogin.js는 api.js를 사용하지 않습니다.
function SLogin({ setUser }) {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        // 💡 하드코딩된 ID/PW 검증
        if (id === "admin" && password === "admin") {
            // 1. "Super Admin"을 식별할 수 있는 특별한 User 객체 생성
            const superUser = { 
                name: "Super Admin", 
                email: "admin",
                isSuper: true // 💡 슈퍼 관리자 식별 플래그
            };

            // 2. App.js의 user 상태 업데이트
            setUser(superUser); 
            
            // 3. 새로고침 유지를 위해 localStorage에 플래그 저장
            localStorage.setItem("isSuperAdmin", "true");
            
            // 4. (중요) 혹시 모를 일반 관리자 토큰은 제거
            localStorage.removeItem("authToken");

            // --- [수정] ---
            // 5. 전체 관리자 '계정' 페이지로 이동
            navigate("/s-accounts");
            // ---------------

        } else {
            setError("ID 또는 비밀번호가 일치하지 않습니다.");
            setLoading(false);
        }
    };

    return (
        <div className="auth-page"> 
            <form onSubmit={handleSubmit} className="auth-form login-form">
                <h2>👑 Super Admin</h2>
                
                <input type="text" name="id" className="form-input" value={id} placeholder="ID" onChange={e => setId(e.target.value)} required />
                
                <input type="password" name="password" className="form-input" value={password} placeholder="Password" onChange={e => setPassword(e.target.value)} required />
                
                <div className="login-form__signup-link">
                    <Link to="/Login">일반 관리자 로그인</Link>
                </div>
                <button type="submit" disabled={loading} className="button button--primary">
                    {loading ? "로그인 중..." : "로그인"}
                </button>
                {error && <div style={{ color: "red", whiteSpace: "pre-wrap" }}>{error}</div>}
            </form>
        </div>
    );
}

export default SLogin;
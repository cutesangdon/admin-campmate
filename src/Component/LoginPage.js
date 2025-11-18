import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fetchWithAuth } from '../api';

function LoginPage({ setUser }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const data = await fetchWithAuth("/api/admins/login", {
                method: "POST",
                body: JSON.stringify({ email, password })
            });

            setUser(data.user); 
            localStorage.setItem("authToken", data.token);
            navigate("/reservation");

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page"> 
            <form onSubmit={handleSubmit} className="auth-form login-form">
                
                <Link to="/slogin" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h2>CampMate<br />캠핑장 사장님</h2>
                </Link>
                
                <input type="email" name="email" className="form-input" value={email} placeholder="이메일 입력" onChange={e => setEmail(e.target.value)} required />
                
                <input type="password" name="password" className="form-input" value={password} placeholder="Password" onChange={e => setPassword(e.target.value)} required />
                
                <div className="login-form__signup-link">
                    <Link to="/signup">관리자 등록</Link>
                </div>
                <button type="submit" disabled={loading} className="button button--primary">
                    {loading ? "로그인 중..." : "로그인"}
                </button>
                {error && <div style={{ color: "red", whiteSpace: "pre-wrap" }}>{error}</div>}
            </form>
        </div>
    );
}

export default LoginPage;
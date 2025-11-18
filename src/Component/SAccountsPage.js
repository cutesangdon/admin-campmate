// /src/Component/SAccountsPage.js

import React, { useEffect, useState } from "react";
import { fetchWithAuth } from '../api';

function SAccountsPage({ user }) {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAccounts = async () => {
            setLoading(true);
            try {
                // (필수) 백엔드에 GET /api/admins/all API 구현 필요
                const data = await fetchWithAuth('/api/admins/all');
                setAccounts(data);
            } catch (err) {
                console.error("Failed to fetch all accounts:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAccounts();
    }, []);

    if (loading) return <div>전체 계정 목록 로딩 중...</div>;

    return (
        <div className="admin-page">
            <h2>👑 전체 계정 관리</h2>
            <p><strong>{user.name}</strong>님 환영합니다. (총 {accounts.length}개)</p>
            
            <table className="data-table">
                <thead>
                    <tr>
                        {/* --- [수정] --- */}
                        <th>이름</th>
                        <th>이메일</th>
                        <th>주소</th>
                        <th>가입일</th>
                        {/* --------------- */}
                    </tr>
                </thead>
                <tbody>
                    {accounts.length === 0 ? (
                         <tr><td colSpan="4" align="center">데이터가 없습니다.</td></tr>
                    ) : (
                        accounts.map(acc => (
                            <tr key={acc.email}>
                                <td>{acc.name}</td>
                                <td>{acc.email}</td>
                                <td>{acc.address || '-'}</td>
                                <td>{acc.createDt ? new Date(acc.createDt).toLocaleDateString() : '-'}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default SAccountsPage;
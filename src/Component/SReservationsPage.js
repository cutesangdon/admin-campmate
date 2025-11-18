// /src/Component/SReservationsPage.js

import React, { useEffect, useState } from "react";
import { fetchWithAuth } from '../api';

function SReservationsPage({ user }) {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReservations = async () => {
            setLoading(true);
            try {
                // (완료) GET /api/reservations/all API 사용
                const data = await fetchWithAuth('/api/reservations/all');
                setReservations(data);
            } catch (err) {
                console.error("Failed to fetch all reservations:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchReservations();
    }, []);

    if (loading) return <div>전체 예약 목록 로딩 중...</div>;

    return (
        <div className="admin-page">
            <h2>👑 전체 예약 관리</h2>
            <p><strong>{user.name}</strong>님 환영합니다. (총 {reservations.length}건)</p>
            
            <table className="data-table">
                <thead>
                    <tr>
                        <th>예약자</th>
                        <th>캠핑존</th>
                        <th>체크인</th>
                        <th>상태</th>
                        <th>생성일</th>
                    </tr>
                </thead>
                <tbody>
                    {reservations.length === 0 ? (
                        <tr><td colSpan="5" align="center">데이터가 없습니다.</td></tr>
                    ) : (
                        reservations.map(res => (
                            <tr key={res.id}>
                                <td>{res.customerName}</td>
                                <td>{res.zoneName}</td>
                                <td>{res.checkIn}</td>
                                <td>{res.status}</td>
                                <td>{new Date(res.createDt).toLocaleString()}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default SReservationsPage;
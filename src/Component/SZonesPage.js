// /src/Component/SZonesPage.js

import React, { useEffect, useState } from "react";
import { fetchWithAuth } from '../api';

function SZonesPage({ user }) {
    const [zones, setZones] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchZones = async () => {
            setLoading(true);
            try {
                // (완료) GET /api/zones/all API 사용
                const data = await fetchWithAuth('/api/zones/all');
                setZones(data);
            } catch (err) {
                console.error("Failed to fetch all zones:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchZones();
    }, []);

    if (loading) return <div>전체 캠핑존 목록 로딩 중...</div>;

    return (
        <div className="admin-page">
            <h2>👑 전체 캠핑존 관리</h2>
            <p><strong>{user.name}</strong>님 환영합니다. (총 {zones.length}개)</p>
            
            <table className="data-table">
                <thead>
                    <tr>
                        <th>이름</th>
                        <th>가격</th>
                        <th>수용인원</th>
                        <th>상태</th>
                    </tr>
                </thead>
                <tbody>
                    {zones.length === 0 ? (
                        <tr><td colSpan="4" align="center">데이터가 없습니다.</td></tr>
                    ) : (
                        zones.map(zone => (
                            <tr key={zone.id}>
                                <td>{zone.name}</td>
                                <td>{zone.price.toLocaleString()} 원</td>
                                <td>{zone.capacity} 명</td>
                                <td>{zone.isActive ? '예약 가능' : '예약 불가'}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default SZonesPage;
import React, { useEffect, useState } from "react";
import { fetchWithAuth } from '../api';

function ReservationPage({ user }) {
    // 초기값을 빈 배열 []로 설정
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
    // 'R': 예약됨, 'C': 취소됨, 'E': 완료
    const [filterStatus, setFilterStatus] = useState('R'); 

    // 상태 코드를 한글로 변환하기 위한 객체
    const statusMap = {
        'R': '예약됨',
        'E': '이용 완료',
        'C': '취소됨'
    };

    const formatDateTime = (isoString) => {
        if (!isoString) return ''; 
        const date = new Date(isoString);
        
        const pad = (num) => String(num).padStart(2, '0');

        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1); 
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());

        return `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    useEffect(() => {
        const fetchReservations = async () => {
            // user 정보가 없으면 중단
            if (!user || !user.id) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError("");
            try {
                const url = `/api/reservations/admin/${user.id}/status?status=${filterStatus}`;
                const data = await fetchWithAuth(url);
                
                // --- 📝 [수정] 데이터가 배열인지 확인하는 방어 로직 추가 ---
                if (Array.isArray(data)) {
                    setReservations(data);
                } else {
                    // 데이터가 배열이 아니면(예: {}, null) 빈 배열로 초기화하고 로그 출력
                    console.warn("서버로부터 배열이 아닌 데이터를 받았습니다:", data);
                    setReservations([]);
                }
                // ----------------------------------------------------

            } catch (err) {
                console.error("예약 조회 에러:", err);
                setError(err.message);
                setReservations([]); // 에러 발생 시에도 빈 배열로 초기화
            } finally {
                setLoading(false);
            }
        };
        
        fetchReservations();
    }, [user, filterStatus]); 

    const handleFilterChange = (e) => {
        setFilterStatus(e.target.value);
    };

    if (loading) return <div>예약 목록을 불러오는 중...</div>;
    if (error) return <div style={{ color: 'red' }}>에러: {error}</div>;
    
    return (
        <div className="reservation-page">
            <h2>예약 관리 페이지</h2>
            <p>이곳에서 예약 현황을 확인하고 관리할 수 있습니다.</p>

            <div className="reservation-page__filter">
                <label htmlFor="status-filter">예약 상태: </label>
                <select id="status-filter" className="form-select" value={filterStatus} onChange={handleFilterChange}>
                    <option value="R">예약됨</option>
                    <option value="C">취소됨</option>
                    <option value="E">이용 완료</option>
                </select>
            </div>

            <table className="data-table">
                <thead>
                    <tr>
                        <th>예약자 이름</th>
                        <th>연락처</th>
                        <th>체크인</th>
                        <th>체크아웃</th>
                        <th>상태</th>
                        <th>생성일</th>
                    </tr>
                </thead>
                <tbody>
                    {/* --- 📝 [수정] 렌더링 시 안전하게 배열 확인 --- */}
                    {!Array.isArray(reservations) || reservations.length === 0 ? (
                        <tr>
                            <td colSpan="6" align="center">해당 상태의 예약 데이터가 없습니다.</td>
                        </tr>
                    ) : (
                        reservations.map(reservation => (
                            <tr key={reservation.id}>
                                <td>{reservation.customerName}</td>
                                <td>{reservation.customerPhone}</td>
                                <td>{reservation.checkIn}</td>
                                <td>{reservation.checkOut}</td>
                                <td>{statusMap[reservation.status] || reservation.status}</td>
                                <td>{formatDateTime(reservation.createDt)}</td>
                            </tr>
                        ))
                    )}
                    {/* ------------------------------------------ */}
                </tbody>
            </table>
        </div>
    );
}

export default ReservationPage;
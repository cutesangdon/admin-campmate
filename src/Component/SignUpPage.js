import React, { useState } from "react";
import { API_BASE_URL } from '../api';
import { useNavigate, Link } from "react-router-dom";
import PostcodeModal from './PostcodeModal'; // 📝 [추가] 우편번호 모달 import

function SignUpPage() {
    const [campEmail, setEmail] = useState("");
    const [campName, setCampName] = useState("");
    const [password, setPassword] = useState("");
    const [campDesc, setCampDesc] = useState("");
    const [style, setStyle] = useState("");
    const [background, setBackground] = useState("");
    const [mate, setMate] = useState("");
    
    // --- 📝 [수정] 주소 상태 세분화 ---
    const [zipCode, setZipCode] = useState("");
    const [address, setAddress] = useState("");
    const [addressDetail, setAddressDetail] = useState("");
    // ---------------------------------

    const [imageFile, setImageFile] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    // 📝 [추가] 모달 표시 상태
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    // 📝 [추가] 우편번호 검색 완료 시 실행될 콜백
    const handlePostcodeComplete = (data) => {
        let fullAddress = data.address;
        let extraAddress = '';

        if (data.addressType === 'R') {
            if (data.bname !== '') {
                extraAddress += data.bname;
            }
            if (data.buildingName !== '') {
                extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
            }
            fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
        }

        setZipCode(data.zonecode); // 우편번호
        setAddress(fullAddress); // 기본 주소
        setIsModalOpen(false); // 모달 닫기
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // 📝 [수정] zipCode, address 필드 검사
        if (!campName || !campEmail || !password || !campDesc || !style || !background || !mate || !address || !zipCode) {
            setError("모든 필수 항목을 입력하세요. (이미지 파일 및 상세 주소는 선택)");
            return;
        }

        // --- 📝 [수정] FormData에 주소 정보 포함 ---
        const formData = new FormData();
        formData.append('email', campEmail);
        formData.append('name', campName);
        formData.append('password', password);
        formData.append('description', campDesc);
        formData.append('campingStyle', style);
        formData.append('campingBackground', background);
        formData.append('campingType', mate);
        
        // 주소 정보를 (우편번호) 기본주소, 상세주소 형태로 합쳐서 전송
        const fullAddressString = `(${zipCode}) ${address}, ${addressDetail}`;
        formData.append('address', fullAddressString);
        
        if (imageFile) {
            formData.append('imageFile', imageFile);
        }
        // ------------------------------------------

        try {
            const res = await fetch(`${API_BASE_URL}/api/admins/signup`, {
                method: "POST",
                body: formData
            });

            if (!res.ok) {
                const errorText = await res.text();
                try {
                    const errData = JSON.parse(errorText);
                    throw new Error(errData.message || "회원가입 실패");
                } catch (parseError) {
                    throw new Error(errorText || "회원가입 실패");
                }
            }
            setSuccess("회원가입이 완료되었습니다! 잠시 후 로그인 페이지로 이동합니다.");

            setTimeout(() => {
                navigate("/Login");
            }, 2000);

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-page">
            <form className="auth-form signup-form" onSubmit={handleSubmit}>
                <Link to="/Login">
                    <button style={{ position: "absolute", left: '10px', top: '10px' }} type="button" className="button">
                        로그인
                    </button>
                </Link>
                <h2>CampMate 관리자 등록</h2>
                <div className="signup-form__row">
                    <div className="signup-form__column">
                        <label className="form-label" htmlFor="su-name">캠핑장 이름</label>
                        <input id="su-name" className="form-input" placeholder="캠핑장 이름 입력"
                            type="text" value={campName} onChange={e => setCampName(e.target.value)} required />

                        <label className="form-label" htmlFor="su-email">이메일</label>
                        <input id="su-email" className="form-input" placeholder="이메일 입력"
                            type="email" value={campEmail} onChange={e => setEmail(e.target.value)} required />

                        <label className="form-label" htmlFor="su-pass">비밀번호</label>
                        <input id="su-pass" className="form-input" placeholder="비밀번호 입력"
                            type="password" value={password} onChange={e => setPassword(e.target.value)} required />

                        {/* --- 📝 [수정] 주소 입력 필드 변경 --- */}
                        <label className="form-label">캠핑장 주소</label>
                        <div className="address-group">
                            <input className="form-input address-group__zipcode" placeholder="우편번호" 
                                   value={zipCode} readOnly required />
                            <button type="button" className="button button--secondary address-group__button" 
                                    onClick={() => setIsModalOpen(true)}>
                                우편번호 검색
                            </button>
                        </div>
                        <input className="form-input" placeholder="기본 주소" 
                               value={address} readOnly required />
                        <input className="form-input" placeholder="상세 주소 (선택)" 
                               value={addressDetail} onChange={e => setAddressDetail(e.target.value)} />
                        {/* --------------------------------- */}
                        
                        <label className="form-label" htmlFor="su-image">대표 이미지 파일</label>
                        <input id="su-image" className="form-input"
                            type="file" accept="image/*" onChange={handleFileChange} />
                        
                        <label className="form-label" htmlFor="su-desc">캠핑장 설명</label>
                        <textarea id="su-desc" className="form-textarea" value={campDesc} onChange={e => setCampDesc(e.target.value)} required/>
                    </div>
                    <div className="signup-form__column">
                        
                        <label className="form-label" htmlFor="su-style">캠핑 스타일</label>
                        <select id="su-style" className="form-select" value={style} onChange={e => setStyle(e.target.value)} required>
                            <option value="">선택</option>
                            <option value="오토캠핑">오토캠핑</option>
                            <option value="백패킹">백패킹</option>
                            <option value="글램핑">글램핑</option>
                            <option value="카라반">카라반</option>
                        </select>
                        
                        <label className="form-label" htmlFor="su-bg">캠핑장 배경</label>
                        <select id="su-bg" className="form-select" value={background} onChange={e => setBackground(e.target.value)} required>
                            <option value="">선택</option>
                            <option value="산">산속</option>
                            <option value="바다">바다</option>
                            <option value="계곡">계곡</option>
                        </select>
                        
                        <label className="form-label" htmlFor="su-type">추천 동행자</label>
                        <select id="su-type" className="form-select" value={mate} onChange={e => setMate(e.target.value)} required>
                            <option value="">선택</option>
                            <option value="가족">가족</option>
                            <option value="연인">연인</option>
                            <option value="친구">친구</option>
                            <option value="반려동물">반려동물</option>
                            <option value="혼자">혼자</option>
                        </select>
                    </div>
                </div>
                <div style={{ marginTop: "24px", textAlign: "center" }}>
                    <button className="button button--primary" type="submit">가입하기</button>
                </div>
                {error && <div style={{ color: "red", marginTop: "12px" }}>{error}</div>}
                {success && <div style={{ color: "green", marginTop: "12px" }}>{success}</div>}
            </form>

            {/* 📝 [추가] 모달 조건부 렌더링 */}
            {isModalOpen && (
                <PostcodeModal 
                    onComplete={handlePostcodeComplete} 
                    onClose={() => setIsModalOpen(false)} 
                />
            )}
        </div>
    );
}

export default SignUpPage;
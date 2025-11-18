import React, { useState, useEffect } from "react";
import { fetchWithAuth } from '../api';

function AdminsPage({ user, setUser }) {
    const [editMode, setEditMode] = useState(false);
    const [editedUser, setEditedUser] = useState({ ...user } || {});
    const [imageFile, setImageFile] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        setEditedUser({ ...user });
        setImageFile(null); 
    }, [user, editMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedUser(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSave = async () => {
        setError(null);
        const formData = new FormData();
        
        formData.append('email', editedUser.email || '');
        formData.append('name', editedUser.name || '');
        formData.append('description', editedUser.description || '');
        formData.append('campingStyle', editedUser.campingStyle || '');
        formData.append('campingBackground', editedUser.campingBackground || '');
        formData.append('campingType', editedUser.campingType || '');
        formData.append('address', editedUser.address || '');

        if (imageFile) {
            formData.append('imageFile', imageFile);
        }

        try {
            const updatedUser = await fetchWithAuth(`/api/admins/me`, {
                method: 'PUT',
                body: formData
            });
            setUser(updatedUser); 
            setEditMode(false);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleCancel = () => {
        setEditedUser({ ...user });
        setEditMode(false);
        setError(null);
        setImageFile(null);
    };

    const handleEditClick = () => {
        setEditMode(true);
        setError(null);
    };

    if (!user) return <div>로딩 중...</div>;

    return (
        <div className="admin-page">
            <h2>관리자 정보</h2>
            <table className="data-table">
                <tbody>
                    <tr>
                        <th>이메일</th>
                        <td>
                            {editMode ? (
                                <input name="email" className="form-input" value={editedUser.email || ''} onChange={handleChange} />
                            ) : (
                                user.email
                            )}
                        </td>
                    </tr>
                    <tr>
                        <th>이름</th>
                        <td>
                            {editMode ? (
                                <input name="name" className="form-input" value={editedUser.name || ''} onChange={handleChange} />
                            ) : (
                                user.name
                            )}
                        </td>
                    </tr>
                    <tr>
                        <th>캠핑장 주소</th>
                        <td>
                            {editMode ? (
                                <input name="address" className="form-input" value={editedUser.address || ''} onChange={handleChange} />
                            ) : (
                                user.address
                            )}
                        </td>
                    </tr>
                    <tr>
                        <th>대표 이미지</th>
                        <td>
                            {editMode ? (
                                <div>
                                    <input name="imageFile" type="file" className="form-input" accept="image/*" onChange={handleFileChange} />
                                    <small style={{ display: 'block', marginTop: '5px' }}>
                                        현재 이미지: {user.imageUrl ? <a href={user.imageUrl} target="_blank" rel="noopener noreferrer">보기</a> : '없음'}
                                    </small>
                                </div>
                            ) : (
                                user.imageUrl ? (
                                    <img src={user.imageUrl} alt="대표 이미지" />
                                ) : (
                                    '없음'
                                )
                            )}
                        </td>
                    </tr>
                    <tr>
                        <th>캠핑장 설명</th>
                        <td>
                            {editMode ? (
                                <input name="description" className="form-input" value={editedUser.description || ''} onChange={handleChange} />
                            ) : (
                                user.description
                            )}
                        </td>
                    </tr>
                    <tr>
                        <th>선호 캠핑 스타일</th>
                        <td>
                            {editMode ? (
                                <select name="campingStyle" className="form-select" value={editedUser.campingStyle || ''} onChange={handleChange}>
                                    <option value="">선택</option>
                                    <option value="오토캠핑">오토캠핑</option>
                                    <option value="백패킹">백패킹</option>
                                    <option value="글램핑">글램핑</option>
                                    <option value="카라반">카라반</option>
                                </select>
                            ) : (
                                user.campingStyle
                            )}
                        </td>
                    </tr>
                    <tr>
                        <th>선호 캠핑 배경</th>
                        <td>
                            {editMode ? (
                                <select name="campingBackground" className="form-select" value={editedUser.campingBackground || ''} onChange={handleChange}>
                                    <option value="">선택</option>
                                    <option value="산">산속</option>
                                    <option value="바다">바다</option>
                                    <option value="계곡">계곡</option>
                                </select>
                            ) : (
                                user.campingBackground
                            )}
                        </td>
                    </tr>
                    <tr>
                        <th>추천 동행자</th>
                        <td>
                            {editMode ? (
                                <select name="campingType" className="form-select" value={editedUser.campingType || ''} onChange={handleChange}>
                                    <option value="">선택</option>
                                    <option value="가족">가족</option>
                                    <option value="연인">연인</option>
                                    <option value="친구">친구</option>
                                    <option value="반려동물">반려동물</option>
                                    <option value="혼자">혼자</option>
                                </select>
                            ) : (
                                user.campingType
                            )}
                        </td>
                    </tr>
                    <tr>
                        <th>계정 생성일</th>
                        <td>{user.createDt ? new Date(user.createDt).toLocaleString() : ''}</td>
                    </tr>
                </tbody>
            </table>

            <div style={{ marginTop: "16px", textAlign: "center" }}>
                {editMode ? (
                    <>
                        <button onClick={handleSave} className="button button--primary">저장</button>
                        <button onClick={handleCancel} className="button button--secondary" style={{ marginLeft: "10px" }}>취소</button>
                    </>
                ) : (
                    <button onClick={handleEditClick} 
                    style={{ marginLeft: '5px', backgroundColor: '#D1D8BE' }} 
                    className="button">수정
                    </button>
                )}
                {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
            </div>
        </div>
    );
}

export default AdminsPage;
// src/Component/PostcodeModal.js

import React, { useEffect, useRef } from 'react';

/**
 * Daum(Kakao) 우편번호 검색 API를 띄우는 모달 컴포넌트
 * (수동 임베드 방식)
 * @param {function} onComplete - 주소 검색 완료 시 호출될 콜백 함수 (data 객체를 인자로 받음)
 * @param {function} onClose - 모달을 닫을 때 호출될 함수
 */
function PostcodeModal({ onComplete, onClose }) {
    const modalContentRef = useRef(null); // 모달 컨텐츠 DOM을 참조
    // --- 📝 [추가] 스크립트가 이미 임베드되었는지 확인하는 Ref ---
    const isEmbedded = useRef(false);

    // 모달 외부(배경) 클릭 시 닫기
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // 모달 내부 클릭 시 닫히지 않도록 이벤트 전파 중지
    const handleModalContentClick = (e) => {
        e.stopPropagation();
    };

    useEffect(() => {
        // --- 📝 [추가] 이미 임베드되었다면, 두 번째 실행(Strict Mode)을 막음 ---
        if (isEmbedded.current) {
            return;
        }
        // -----------------------------------------------------------

        // 컴포넌트가 마운트될 때, index.html에 로드된 window.daum 객체를 사용합니다.
        if (window.daum && window.daum.Postcode) {
            new window.daum.Postcode({
                oncomplete: function(data) {
                    // 사용자가 주소를 선택했을 때 실행될 콜백
                    onComplete(data);
                    onClose(); // 모달 닫기
                },
                width: '100%',
                height: '100%'
            }).embed(modalContentRef.current); // modalContentRef가 참조하는 div에 렌더링

            // --- 📝 [추가] 임베드가 완료되었음을 표시 ---
            isEmbedded.current = true;
            // --------------------------------------

        } else {
            console.error("Daum 우편번호 스크립트가 로드되지 않았습니다. public/index.html 파일을 확인하세요.");
        }
        
        // 🚨 참고: 이 useEffect는 onComplete, onClose가 변경될 때마다 실행되지만,
        // isEmbedded 플래그 덕분에 Postcode 임베드는 한 번만 실행됩니다.
    }, [onComplete, onClose]);

    return (
        <div className="modal__backdrop" onClick={handleBackdropClick}>
            <div 
                className="modal__content" 
                style={{ width: '90%', maxWidth: '500px', height: '500px', padding: '0', position: 'relative' }}
                onClick={handleModalContentClick}
            >
                {/* Daum 우편번호 서비스가 이 div 안에 렌더링됩니다. */}
                <div ref={modalContentRef} style={{ width: '100%', height: '100%' }} />
                
                {/* 모달 닫기 버튼 */}
                <button 
                    onClick={onClose} 
                    className="button"
                    style={{ 
                        position: 'absolute', 
                        top: '10px', 
                        right: '10px', 
                        background: '#aaa', 
                        color: 'white', 
                        width: 'auto', 
                        height: 'auto',
                        padding: '5px 10px',
                        fontSize: '14px'
                    }}
                >
                    &times; 닫기
                </button>
            </div>
        </div>
    );
}

export default PostcodeModal;
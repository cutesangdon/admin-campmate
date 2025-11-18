// src/api.js

// API 요청의 기본 URL을 설정합니다.
const API_BASE_URL = 'http://175.118.115.201:8080';

export const fetchWithAuth = async (endpoint, options = {}) => {
    const token = localStorage.getItem('authToken');
    // FormData인 경우 Content-Type을 설정하지 않도록 기본값 변경
    const headers = {
        ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });

    // 응답이 성공적이지 않을 때 에러 처리를 강화합니다.
    if (!response.ok) {
        let errorMessage = `API Error: ${response.status} ${response.statusText}`;
        try {
            // 서버가 JSON 에러 메시지를 보냈는지 확인
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                const errorData = await response.json();
                errorMessage = errorData.message || JSON.stringify(errorData);
            } else {
                // JSON이 아니면 텍스트로 읽음 (HTML 에러 페이지 등)
                errorMessage = await response.text();
            }
        } catch (e) {
            // JSON 파싱 실패 시 텍스트로 읽기 시도
            try {
                 errorMessage = await response.text();
            } catch (textError) {
                // 텍스트 읽기도 실패하면 기본 메시지 사용
                console.error("Failed to read error response:", textError);
            }
            console.error("Received non-JSON response or failed to parse JSON:", e);
            if (!errorMessage.startsWith('API Error')) {
                 errorMessage = "서버로부터 잘못된 응답을 받았습니다. 백엔드 설정을 확인하세요.";
            }
        }
        throw new Error(errorMessage);
    }

    // 응답 본문이 비어있을 경우를 대비
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        // 응답 본문이 있는지 확인 후 파싱 시도
        const responseText = await response.text();
        return responseText ? JSON.parse(responseText) : {};
    }
    return {}; // 본문이 없는 성공 응답(예: 204 No Content) 처리
};
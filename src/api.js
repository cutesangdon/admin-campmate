export const API_BASE_URL = 'https://unpromotional-ungrown-kenisha.ngrok-free.dev';

export const fetchWithAuth = async (endpoint, options = {}) => {
    const token = localStorage.getItem('authToken');
    const headers = {
        ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        // 📝 [핵심 수정] Ngrok 경고 페이지 우회 헤더 추가
        'ngrok-skip-browser-warning': '69420', 
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });

    if (!response.ok) {
        let errorMessage = `API Error: ${response.status} ${response.statusText}`;
        try {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                const errorData = await response.json();
                errorMessage = errorData.message || JSON.stringify(errorData);
            } else {
                errorMessage = await response.text();
            }
        } catch (e) {
            console.error("Error parsing error response:", e);
        }
        throw new Error(errorMessage);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        const responseText = await response.text();
        return responseText ? JSON.parse(responseText) : {};
    }
    
    // JSON이 아닌 경우(성공했으나 빈 값 등) 처리
    return {}; 
};
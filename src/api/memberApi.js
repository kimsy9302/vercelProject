import axios from "axios";

// 서버 도메인 (반드시 www 포함)
export const API_SERVER_HOST = "https://hotelatelier.shop";
const prefix = `/api/atelier`;

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: API_SERVER_HOST,
  withCredentials: true, // 쿠키 기반 인증을 위해 필요
});

// 요청 시 Authorization 자동 삽입
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 로그인 요청 (JSON 기반)
export const loginPost = async (loginParam) => {
  console.log("loginPost:", loginParam);
  const header = {
    headers: { "Content-Type": "application/json" },
  };
  const res = await api.post(`${prefix}/login`, loginParam, header);
  return res.data;
};

// 로그아웃 요청
export const logout = async () => {
  const token = localStorage.getItem("accessToken");
  const header = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await api.get(`${prefix}/logout`, header);
  return res.data;
};

// 회원가입 요청 (JSON 기반)
export const signupPost = async (signupParam) => {
  console.log("signupPost:", signupParam);
  const header = { headers: { "Content-Type": "application/json" } };
  const res = await api.post(`${prefix}/register`, signupParam, header);
  return res.data;
};

// 비밀번호 검증 요청 (JSON 기반)
export const verifyPassword = async ({ email, password }) => {
  try {
    const res = await api.post(`${prefix}/member/verify-password`, {
      email,
      password,
    });
    return { success: true, data: res.data };
  } catch (err) {
    return { success: false };
  }
};

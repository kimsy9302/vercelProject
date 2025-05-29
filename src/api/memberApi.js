import axios from "axios";
import qs from "qs";

// 반드시 www 포함된 도메인 사용
export const API_SERVER_HOST = "https://www.hotelatelier.shop";
const prefix = `/api/atelier`;

// axios 인스턴스 생성
const api = axios.create({
  baseURL: API_SERVER_HOST,
  withCredentials: true,
});

// 요청 시 Authorization 헤더 자동 삽입
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

// 로그인 요청 (x-www-form-urlencoded)
export const loginPost = async (loginParam) => {
  console.log("loginPost:", loginParam);
  const header = {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  };
  const formData = qs.stringify(loginParam);
  const res = await api.post(`${prefix}/login`, formData, header);
  return res.data;
};

// 로그아웃 요청 (토큰 포함)
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

// 회원가입 요청 (application/json)
export const signupPost = async (signupParam) => {
  console.log("signupPost:", signupParam);
  const header = { headers: { "Content-Type": "application/json" } };
  const res = await api.post(`${prefix}/register`, signupParam, header);
  return res.data;
};

// 비밀번호 확인 (JSON 본문 요청)
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

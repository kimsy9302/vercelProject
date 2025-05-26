import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createReview, updateReview, getReviewById } from "../../api/reviewApi";

const ReviewWriteComponent = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const reviewId = searchParams.get("reviewId");
  const residenceId = searchParams.get("residenceId");
  const isEdit = !!reviewId;

  const loginData = JSON.parse(localStorage.getItem("login"));
  const { userId } = loginData;

  const [form, setForm] = useState({
    userId: userId,
    residenceId: residenceId ? parseInt(residenceId) : 1,
    rating: 5,
    title: "",
    comment: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/member/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (!isEdit && residenceId) {
      setForm((prev) => ({
        ...prev,
        residenceId: parseInt(residenceId),
        userId,
      }));
    }
  }, [residenceId, isEdit]);

  useEffect(() => {
    if (isEdit) {
      getReviewById(reviewId).then((data) => {
        setForm({
          userId: data.userId,
          residenceId: data.residenceId,
          rating: data.rating,
          title: data.title,
          comment: data.comment,
        });
      });
    }
  }, [isEdit, reviewId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEdit) {
      await updateReview(reviewId, form);
    } else {
      await createReview(form);
    }
    navigate("/mypage");
  };

  return (
    <div className="max-w-2xl w-full bg-white p-10 shadow-lg rounded-2xl">
      <h2 className="text-2xl font-bold mb-8 text-center text-[#5c3d1b]">
        {isEdit ? "리뷰 수정" : "리뷰 작성"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6 text-sm font-medium">
        <div>
          <label htmlFor="title" className="block mb-1 text-[#5c3d1b] font-semibold">
            제목
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="리뷰 제목을 입력하세요"
            className="w-full border border-gray-400 rounded px-5 py-3 focus:outline-none focus:ring-2 focus:ring-[#5c3d1b]"
            required
          />
        </div>

        <div>
          <label htmlFor="comment" className="block mb-1 text-[#5c3d1b] font-semibold">
            내용
          </label>
          <textarea
            name="comment"
            value={form.comment}
            onChange={handleChange}
            placeholder="리뷰 내용을 입력하세요"
            className="w-full border border-gray-400 rounded px-5 py-3 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-[#5c3d1b]"
            required
          />
        </div>

        <div>
          <label htmlFor="rating" className="block mb-1 text-[#5c3d1b] font-semibold">
            평점 (1~5)
          </label>
          <input
            type="number"
            name="rating"
            value={form.rating}
            onChange={handleChange}
            min="1"
            max="5"
            className="w-full border border-gray-400 rounded px-5 py-3 focus:outline-none focus:ring-2 focus:ring-[#5c3d1b]"
            required
          />
        </div>

        <div className="text-right pt-2 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-white text-gray-700 px-8 py-3 font-bold rounded-md border border-gray-400 hover:bg-gray-100 transition"
          >
            이전 페이지
          </button>

          <button
            type="submit"
            className="bg-[#a07c5b] text-white px-8 py-3 font-bold rounded-md hover:opacity-90 transition"
          >
            {isEdit ? "수정 완료" : "작성 완료"}
          </button>
        </div>

      </form>
    </div>
  );
};

export default ReviewWriteComponent;

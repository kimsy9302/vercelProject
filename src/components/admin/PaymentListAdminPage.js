import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import PaymentListTableAdmin from "./PaymentListTableAdmin";
import { fetchAllPayments } from "../../api/adminApi";
// 전체 결제 내역 조회 API
// const fetchAllPayments = async () => {
//   const res = await axios.get("/api/atelier/payment/list");
//   return res.data;
// };

const PaymentListAdminPage = () => {
  const {
    data = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["allpayment"],
    queryFn: fetchAllPayments,
  });

  if (isLoading) return <p>...로딩중</p>;
  if (error) return <p>에러 발생.</p>;

  // 상태별 분리
  const pendingList = data.filter(
    (payment) => payment.paymentStatus === "PENDING"
  );

  const completedList = data.filter(
    (payment) => payment.paymentStatus === "COMPLETED"
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">💳 결제 내역 (관리자)</h2>

      <h3 className="text-xl font-semibold mt-6 text-blue-600">
        🕓 대기 중 (PENDING)
      </h3>
      <PaymentListTableAdmin paymentList={pendingList} onRefetch={refetch} />

      <h3 className="text-xl font-semibold mt-10 text-green-600">
        ✅ 결제 완료 (COMPLETED)
      </h3>
      <PaymentListTableAdmin paymentList={completedList} onRefetch={refetch} />
    </div>
  );
};

export default PaymentListAdminPage;

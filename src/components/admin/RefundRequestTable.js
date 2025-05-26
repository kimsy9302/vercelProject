// src/admin/components/RefundRequestTable.jsx
import React from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { approveRefund } from "../../api/adminApi";

const RefundRequestTable = ({ refundList, onApprove }) => {
  const approveMutation = useMutation({
    mutationFn: approveRefund,
    onSuccess: () => {
      alert(" 환불 승인 완료");
      onApprove(); // 목록 다시 불러오기
    },
    onError: () => {
      alert("승인 실패");
    },
  });

  if (refundList.length === 0) {
    return <div className="text-gray-500">환불 요청이 없습니다.</div>;
  }

  return (
    <table className="w-full border mt-4">
      <thead>
        <tr className="bg-gray-100">
          <th className="py-2 px-4">주문 ID</th>
          <th className="py-2 px-4">유저 ID</th>
          <th className="py-2 px-4">결제 금액</th>
          <th className="py-2 px-4">환불 상태</th>
          <th className="py-2 px-4">승인</th>
        </tr>
      </thead>
      <tbody>
        {refundList.map((order) => (
          <tr key={order.id} className="text-center border-b">
            <td className="py-2 px-4">{order.id}</td>
            <td className="py-2 px-4">{order.userId}</td>
            <td className="py-2 px-4">{order.totalPrice.toLocaleString()}원</td>
            <td className="py-2 px-4">
              <span
                className={`px-2 py-1 rounded-full text-sm font-semibold
                  ${order.refundStatus === "REFUND_PENDING"
                    ? "bg-yellow-100 text-yellow-700"
                    : order.refundStatus === "REFUNDED"
                    ? "bg-red-100 text-red-600"
                    : "bg-gray-100 text-gray-600"}`}
              >
                {order.refundStatus === "REFUND_PENDING"
                  ? "요청 중"
                  : order.refundStatus === "REFUNDED"
                  ? "환불 완료"
                  : order.refundStatus}
              </span>
            </td>
            <td className="py-2 px-4">
              {order.refundStatus === "REFUND_PENDING" ? (
                <button
                  onClick={() => {
                    const ok = window.confirm("정말 환불 승인할까요?");
                    if (ok) approveMutation.mutate(order.id);
                  }}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  승인
                </button>
              ) : (
                <span className="text-gray-400 text-sm">-</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RefundRequestTable;

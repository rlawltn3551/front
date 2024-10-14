import React, { createContext, useState } from 'react';

// Context 생성
export const ReviewContext = createContext();

// Provider 컴포넌트
export const ReviewProvider = ({ children }) => {
  const [reviews, setReviews] = useState([]);

  // 리뷰 추가 함수
  const addReview = (newReview) => {
    setReviews((prevReviews) => [
      ...prevReviews,
      { ...newReview, id: Date.now() }, // 리뷰에 고유 ID 추가
    ]);
  };

  // 리뷰 수정 함수
  const updateReview = (id, updatedReview) => {
    setReviews((prevReviews) =>
      prevReviews.map((review) =>
        review.id === id ? { ...review, ...updatedReview } : review
      )
    );
  };

  // 리뷰 삭제 함수
  const deleteReview = (id) => {
    setReviews((prevReviews) =>
      prevReviews.filter((review) => review.id !== id)
    );
  };

  return (
    <ReviewContext.Provider
      value={{
        reviews,
        addReview,
        updateReview,
        deleteReview,
      }}
    >
      {children}
    </ReviewContext.Provider>
  );
};

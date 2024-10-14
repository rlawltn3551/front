import React, { useState } from 'react';
import ReactStars from 'react-rating-stars-component';

const StarRating = () => {
  const [rating, setRating] = useState(0); // 초기값 0점 (0.5점 단위로)

  const ratingChanged = (newRating) => {
    setRating(newRating);
  };

  return (
    <div>
      <h3>별점</h3>
      <ReactStars
        count={5}
        onChange={ratingChanged}
        size={24}
        isHalf={true} // 0.5점 단위로 별점 설정 가능
        value={rating}
        activeColor="#ffd700"
      />
      <p>{rating}점 (5.0점 만점)</p> {/* 별점 옆에 점수를 텍스트로 표시 */}
    </div>
  );
};

export default StarRating;

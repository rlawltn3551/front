import React, { useEffect, useRef, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import StarRatings from 'react-star-ratings';
import { ReviewContext } from '../context/ReviewContext'; // Review Context import
import { FavoriteMoviesContext } from '../context/FavoriteMoviesContext';
import '../styles/MyPage.css';

const MyPage = () => {
  const { reviews, updateReview, deleteReview } = useContext(ReviewContext); // Context에서 리뷰 관련 함수와 데이터 가져오기
  const { favoriteMovies, removeFromFavoriteMovies } = useContext(
    FavoriteMoviesContext
  ); // 관심 영화 관련 Context
  const [editReviewId, setEditReviewId] = useState(null);
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);
  const textareaRef = useRef(null); // ref 생성

  // 리뷰 수정 함수
  const handleEdit = (review) => {
    setEditReviewId(review.id); // 수정할 리뷰의 ID 설정
    setContent(review.review.content); // 리뷰 내용 설정
    setRating(review.review.rating); // 별점 설정
  };

  // 리뷰 수정 제출 함수
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editReviewId) {
      const updatedReview = {
        movie: reviews.find((review) => review.id === editReviewId).movie, // 영화 정보
        review: { content, rating }, // 수정된 리뷰 내용
      };
      updateReview(editReviewId, updatedReview); // 부모 컴포넌트의 리뷰 업데이트 함수 호출

      // 폼 초기화
      setEditReviewId(null);
      setContent('');
      setRating(0);
    }
  };

  // 수정 폼이 열리면 포커스 설정
  useEffect(() => {
    if (editReviewId && textareaRef.current) {
      textareaRef.current.focus(); // 텍스트 영역에 포커스
      // 커서를 텍스트 끝으로 이동
      setTimeout(() => {
        textareaRef.current.selectionStart = content.length;
        textareaRef.current.selectionEnd = content.length;
      }, 0);
    }
  }, [editReviewId, content]);

  return (
    <div className="mypage">
      <h2>나의 관심 영화</h2>
      {favoriteMovies.length > 0 ? (
        <div className="favorite-movies">
          {favoriteMovies.map((movie) => (
            <div key={movie.id} className="favorite-movie-card">
              <Link to={`/movie/${movie.id}`}>
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                />
              </Link>
              <h3>{movie.title}</h3>
              <p>개봉일: {movie.release_date}</p>
              <button onClick={() => removeFromFavoriteMovies(movie.id)}>
                삭제
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>관심 영화 목록이 없습니다.</p>
      )}

      <h2>내가 작성한 리뷰</h2>
      {reviews.length > 0 ? (
        <ul>
          {reviews.map((review) => (
            <li key={review.id}>
              <Link to={`/movie/${review.movie.movieDetail.id}`}>
                <img
                  src={`https://image.tmdb.org/t/p/w500${review.movie.movieDetail.poster_path}`}
                  alt={review.movie.movieDetail.title}
                />
              </Link>
              <div>
                <h3>{review.movie.movieDetail.title}</h3>
                <p className="review-content">{review.review.content}</p>
                <div className="star-rating">
                  <StarRatings
                    rating={review.review.rating}
                    starRatedColor="gold"
                    starEmptyColor="lightgray"
                    numberOfStars={5}
                    starDimension="24px"
                    starSpacing="2px"
                    name="rating"
                  />
                </div>
                <div className="buttons">
                  <button onClick={() => handleEdit(review)}>수정</button>
                  <button onClick={() => deleteReview(review.id)}>삭제</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>작성된 리뷰가 없습니다.</p>
      )}

      {editReviewId && (
        <form onSubmit={handleSubmit}>
          <h3>리뷰 수정</h3>
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="리뷰 내용을 입력하세요."
            required
          />
          <StarRatings
            rating={rating}
            starRatedColor="gold"
            starHoverColor="#DAA520"
            starEmptyColor="lightgray"
            changeRating={setRating}
            numberOfStars={5}
            starDimension="24px"
            starSpacing="2px"
            name="rating"
          />
          <div className="form-buttons">
            <button type="submit">수정</button>
            <button type="button" onClick={() => setEditReviewId(null)}>
              취소
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default MyPage;

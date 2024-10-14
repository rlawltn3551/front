import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ReviewContext } from '../context/ReviewContext';
import { FavoriteMoviesContext } from '../context/FavoriteMoviesContext';
import StarRatings from 'react-star-ratings';
import emptyHeart from '../images/empty-heart.svg';
import filledHeart from '../images/filled-heart.svg';
import '../styles/MovieDetail.css';

const MovieDetailPage = () => {
  const { movieId } = useParams();
  const { reviews, addReview, updateReview, deleteReview } =
    useContext(ReviewContext); // Context에서 리뷰 관련 함수 가져오기
  const { favoriteMovies, addToFavoriteMovies, removeFromFavoriteMovies } =
    useContext(FavoriteMoviesContext);

  const [movieDetail, setMovieDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);
  const [ageRating, setAgeRating] = useState('정보 없음');
  const [editReviewId, setEditReviewId] = useState(null); // 수정할 리뷰 ID

  const TMDB_API_KEY = '';

  const numericMovieId = parseInt(movieId, 10); // 10진수로 변환

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&language=ko-KR&append_to_response=credits,release_dates`
        );
        setMovieDetail(response.data);

        const koreaReleaseInfo = response.data.release_dates.results.find(
          (release) => release.iso_3166_1 === 'KR'
        );
        const usReleaseInfo = response.data.release_dates.results.find(
          (release) => release.iso_3166_1 === 'US'
        );

        let ratingInfo = null;
        if (koreaReleaseInfo) {
          ratingInfo = koreaReleaseInfo.release_dates.find(
            (item) => item.certification
          );
        }
        if (!ratingInfo && usReleaseInfo) {
          ratingInfo = usReleaseInfo.release_dates.find(
            (item) => item.certification
          );
        }

        setAgeRating(ratingInfo ? ratingInfo.certification : '정보 없음');
        setLoading(false);
      } catch (error) {
        console.error('영화 상세 정보를 가져오는 데 실패했습니다.', error);
        setError('영화 상세 정보를 가져오는 데 실패했습니다.');
        setLoading(false);
      }
    };

    fetchMovieDetail();
  }, [movieId]); // movieId가 변경될 때만 useEffect가 다시 실행

  // 리뷰 제출 처리 함수
  const handleSubmit = (e) => {
    e.preventDefault();

    // 리뷰 내용과 평점이 모두 입력되었는지 확인
    if (!content || !rating) {
      window.alert('리뷰 내용과 평점을 입력해 주세요.'); // 팝업으로 알림
      return;
    }

    const movie = { movieId, movieDetail };
    const reviewData = { movie, review: { content, rating } };

    if (editReviewId) {
      // 리뷰 수정
      updateReview(editReviewId, reviewData);
      setEditReviewId(null); // 수정 모드 해제
    } else {
      // 새 리뷰 추가
      addReview(reviewData);
    }

    // 폼 초기화
    resetForm();
    console.log('Post-reset rating:', rating);
  };

  // 리뷰 수정 처리 함수
  const handleEdit = (id) => {
    const reviewToEdit = reviews.find((review) => review.id === id);
    if (reviewToEdit) {
      setContent(reviewToEdit.review.content);
      setRating(reviewToEdit.review.rating);
      setEditReviewId(id); // 수정할 리뷰 ID 설정
    }
  };

  // 폼 초기화 함수
  const resetForm = () => {
    setContent(''); // 입력값 초기화
    setRating(0); // 평점 초기화
    setError(null); // 에러 메시지 초기화
    console.log('Form reset, rating:', rating); // 추가된 로그
  };

  // 리뷰 삭제 처리 함수
  const handleDelete = (id) => {
    if (window.confirm('리뷰를 삭제하시겠습니까?')) {
      deleteReview(id);
    }
  };

  if (loading) return <p>대기 중...</p>;
  if (error) return <p>{error}</p>;

  const posterUrl = `https://image.tmdb.org/t/p/w500${movieDetail.poster_path}`;
  const director = movieDetail.credits
    ? movieDetail.credits.crew.find((director) => director.job === 'Director')
    : null;

  // 특정 영화에 해당하는 리뷰만 필터링
  const movieReviews = reviews.filter(
    (review) => review.movie.movieId === movieId
  );

  // 관심 영화 관련 함수
  const isFavorite = favoriteMovies.some(
    (favMovie) => favMovie.id === numericMovieId
  );

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      removeFromFavoriteMovies(numericMovieId);
    } else {
      addToFavoriteMovies(movieDetail);
    }
  };

  return (
    <div className="movie-detail">
      <div className="movie-content">
        {/* 영화 포스터 */}
        <img src={posterUrl} alt={movieDetail.title} className="movie-poster" />

        {/* 영화 정보 */}
        <div className="movie-info">
          <h1 className="movie-title">{movieDetail.title}</h1>

          {/* 하트 아이콘 */}
          <button
            onClick={handleFavoriteToggle}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            className="favorite-button"
          >
            <img
              src={isFavorite ? filledHeart : emptyHeart}
              alt={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              style={{ width: '30px', height: '30px' }} // 원하는 크기로 조정
            />
          </button>

          {/* 관람 등급, 개봉일 */}
          <p>
            관람 등급 : {ageRating} | 개봉일 : {movieDetail.release_date}
          </p>

          {/* 장르를 아래로 내림 */}
          <div>
            장르 :
            {movieDetail.genres.map((genre) => (
              <span key={genre.id} className="genre-tag">
                #{genre.name} {/* 태그 형식으로 장르 표시 */}
              </span>
            ))}
          </div>

          {/* 러닝타임 */}
          <p>러닝타임 : {movieDetail.runtime}분</p>

          {/* 감독 */}
          <p>감독 : {director ? director.name : '정보 없음'}</p>

          {/* 출연진 정보 */}
          <h2>출연진</h2>
          <ul className="cast-list">
            {movieDetail.credits &&
              movieDetail.credits.cast.slice(0, 5).map((actor) => (
                <li key={actor.id}>
                  {actor.name}{' '}
                  <span className="character">({actor.character})</span>
                </li>
              ))}
          </ul>
        </div>
      </div>

      {/* 개요 (포스터 아래) */}
      <div className="movie-overview-section">
        <br />
        <h2>개요</h2>
        <p>{movieDetail.overview}</p>
      </div>

      {/* 리뷰 작성 */}
      <br />
      <br />
      <h2>리뷰 작성하기</h2>
      <form className="review-form" onSubmit={handleSubmit}>
        <div className="star-rating">
          <StarRatings
            rating={rating}
            starRatedColor="gold"
            starHoverColor="#DAA520"
            starEmptyColor="lightgray"
            changeRating={setRating}
            numberOfStars={5}
            name="rating"
            starDimension="24px"
            starSpacing="2px"
          />
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="리뷰 내용을 입력하세요.(100자 이내)"
          maxLength={100}
          required
        />

        {/* 100자 표시 */}
        <p className="movie-meta" style={{ textAlign: 'right' }}>
          {content.length} 자 / 100 자
        </p>

        {/* 리뷰 저장 버튼 */}
        <button type="submit" className="save-button">
          {editReviewId !== null ? '리뷰 수정' : '리뷰 저장'}
        </button>
      </form>

      <br />
      <br />
      {/* 리뷰 목록 */}
      <h2>리뷰 목록</h2>
      {movieReviews.length === 0 ? (
        <p>리뷰가 없습니다.</p>
      ) : (
        <ul className="review-list">
          {movieReviews.map((review) => (
            <li key={review.id} className="review-item">
              <div className="review-content">
                <p>내용: {review.review.content}</p>
                <StarRatings
                  key={`review-stars-${review.id}`}
                  rating={review.review.rating}
                  starRatedColor="gold"
                  starEmptyColor="lightgray"
                  numberOfStars={5}
                  starDimension="20px"
                  starSpacing="2px"
                  edit={false}
                />
              </div>
              <div className="review-buttons">
                <button onClick={() => handleEdit(review.id)}>수정</button>
                <button onClick={() => handleDelete(review.id)}>삭제</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MovieDetailPage;

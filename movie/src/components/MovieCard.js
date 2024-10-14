import React, { useContext } from 'react';
import { FavoriteMoviesContext } from '../context/FavoriteMoviesContext';
import emptyHeart from '../images/empty-heart.svg';
import filledHeart from '../images/filled-heart.svg';

const MovieCard = ({ movie }) => {
  const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  const { favoriteMovies, addToFavoriteMovies, removeFromFavoriteMovies } =
    useContext(FavoriteMoviesContext);

  const isFavorite = favoriteMovies.some(
    (favMovie) => favMovie.id === movie.id
  );

  // 하트 클릭 시 동작하는 함수
  const handleFavoriteToggle = (event) => {
    // 하트 클릭 시 카드 클릭 방지
    event.preventDefault(); // 기본 동작을 방지
    event.stopPropagation(); // 이벤트 전파 방지

    if (isFavorite) {
      removeFromFavoriteMovies(movie.id);
      console.log(`${movie.title}이 관심 영화 목록에서 제거되었습니다.`, movie);
    } else {
      addToFavoriteMovies(movie);
      console.log(`${movie.title}이 관심 영화 목록에 추가되었습니다.`, movie);
    }
  };

  return (
    <div style={{ position: 'relative' }} className="movie-card">
      <img
        src={posterUrl}
        alt={movie.title}
        style={{ width: '100%', borderRadius: '8px' }}
      />
      <h3>{movie.title}</h3>
      <p>개봉일: {movie.release_date}</p>

      {/* 하트 버튼 */}
      <button
        onClick={handleFavoriteToggle}
        style={{
          marginTop: '10px',
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          position: 'absolute',
          top: '5px',
          right: '10px',
          zIndex: 1, // 하트 버튼이 다른 요소 위에 있도록 설정
        }}
      >
        <img
          src={isFavorite ? filledHeart : emptyHeart}
          alt="관심 영화 추가/제거"
          style={{ width: '30px', height: '30px' }}
        />
      </button>
    </div>
  );
};

export default MovieCard;

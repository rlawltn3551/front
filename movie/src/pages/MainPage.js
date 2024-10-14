import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import { FavoriteMoviesContext } from '../context/FavoriteMoviesContext'; // Context import
import emptyHeart from '../images/empty-heart.svg'; // 빈 하트 이미지 import
import filledHeart from '../images/filled-heart.svg'; // 채운 하트 이미지 import
import '../styles/MainPage.css';

const MainPage = () => {
  const { favoriteMovies, addToFavoriteMovies, removeFromFavoriteMovies } =
    useContext(FavoriteMoviesContext);
  const [search, setSearch] = useState(''); // 검색어 상태
  const [movies, setMovies] = useState([]); // 영화 목록 상태
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const inputRef = useRef(null);
  const navigate = useNavigate(); // React Router의 useNavigate 훅 사용

  const TMDB_API_KEY = '';

  // 영화 목록을 가져오는 함수
  const fetchMovies = async () => {
    setLoading(true); // 로딩 상태 시작
    setError(null); // 이전 오류 초기화
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=ko-KR&`
      );
      const data = response.data.results;

      if (data) {
        const movieList = data.slice(0, 10).map((movie, index) => ({
          rank: index + 1,
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path, // TMDB API에서 제공하는 포스터 URL
          release_date: movie.release_date,
        }));
        setMovies(movieList); // 영화 목록 업데이트
      } else {
        setError('영화를 찾을 수 없습니다.');
      }
    } catch (error) {
      setError('영화 데이터를 가져오는 데 오류가 발생했습니다.');
      console.error(error);
    }
    setLoading(false); // 로딩 상태 종료
  };

  // 컴포넌트가 처음 렌더링될 때 인기 영화 불러오기
  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus(); // 새로고침 후 포커스를 자동으로 input에 줌
    }
  }, []);

  // 검색 버튼 클릭 시 실행되는 함수
  const handleSearch = (e) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지
    if (search.trim()) {
      navigate(`/search?query=${encodeURIComponent(search)}`); // 검색어를 쿼리 파라미터로 전달
    }
  };

  const handleFavorite = (movie) => {
    if (favoriteMovies.some((fav) => fav.id === movie.id)) {
      // 이미 찜한 영화라면 제거
      removeFromFavoriteMovies(movie.id);
    } else {
      // 찜 목록에 추가
      addToFavoriteMovies(movie);
    }
  };

  return (
    <div className="main_page">
      <form onSubmit={handleSearch}>
        <input
          className="search-form"
          type="text"
          ref={inputRef}
          placeholder="영화 제목을 검색하세요"
          value={search}
          onChange={(e) => setSearch(e.target.value)} // 검색어 입력 시 상태 업데이트
          style={{ flex: 1, marginRight: '10px' }} // 입력 필드에 유연성 추가
        />
        <button type="submit" className="submitBt">
          검색
        </button>
      </form>
      <div>
        <h2>무비 차트</h2>
        <button
          className="show_all"
          onClick={() => navigate('/popular')} // navigate를 직접 호출
        >
          전체보기
        </button>
      </div>
      {loading ? (
        <p>로딩 중...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="movie-grid">
          {/* 영화 카드 그리드 */}

          {movies.map((movie) => (
            <div className="movie-card" key={movie.rank}>
              <NavLink to={`/movie/${movie.id}`} className="nav-link">
                <div style={{ display: 'flex', position: 'relative' }}>
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    style={{ width: '100%', borderRadius: '8px' }}
                  />
                  <div className="rankview">{movie.rank}</div>
                </div>
                <p>{movie.title}</p>
              </NavLink>
              <button
                onClick={() => handleFavorite(movie)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0',
                  marginTop: '10px',
                }}
              >
                <img
                  src={
                    favoriteMovies.some((fav) => fav.id === movie.id)
                      ? filledHeart
                      : emptyHeart
                  }
                  alt={
                    favoriteMovies.some((fav) => fav.id === movie.id)
                      ? '관심 영화 해제'
                      : '관심 영화 등록'
                  }
                  style={{ width: '30px', height: '30px' }} // 하트 아이콘 크기 조절
                />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MainPage;

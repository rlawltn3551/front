import axios from 'axios';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import MovieList from '../components/MovieList';
import '../styles/MovieList.css';

const MovieListPage = () => {
  const [movies, setMovies] = useState([]); // 영화 목록 상태
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const [genres, setGenres] = useState([]); // 장르 목록 상태
  const [selectedGenre, setSelectedGenre] = useState(''); // 선택된 장르 상태
  const pageRef = useRef(1); // 현재 페이지를 ref로 관리
  const hasMoreRef = useRef(true); // 더 가져올 영화가 있는지 여부
  const loader = useRef(null); // 로딩 요소 참조를 위한 ref

  const TMDB_API_KEY = ''; // API 키

  // 장르 목록 가져오는 함수
  const fetchGenres = async () => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}&language=ko-KR`
      );
      setGenres(response.data.genres); // 장르 목록 저장
    } catch (error) {
      console.error('장르 목록을 가져오는 데 실패했습니다.', error);
      setError('장르 목록을 가져오는 데 실패했습니다.');
    }
  };

  // 영화 목록 가져오는 함수 (선택된 장르에 따라 다르게 호출)
  const fetchMovies = useCallback(async (genreId = '') => {
    if (loading || !hasMoreRef.current) return; // 이미 로딩 중이거나 더 이상 영화가 없으면 종료
    setLoading(true);

    try {
      const url = genreId
        ? `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&language=ko-KR&page=${pageRef.current}&with_genres=${genreId}`
        : `https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&language=ko-KR&page=${pageRef.current}`;

      const response = await axios.get(url);
      const fetchedMovies = response.data.results;

      setMovies((prevMovies) => {
        const newMovies = [...prevMovies, ...fetchedMovies];
        const uniqueMovies = newMovies.filter(
          (movie, index, self) =>
            index === self.findIndex((m) => m.id === movie.id)
        ); // 영화 ID를 기준으로 중복 제거
        return uniqueMovies;
      });

      // 추가 영화가 없으면 false 설정
      if (fetchedMovies.length === 0) {
        hasMoreRef.current = false;
      }
      pageRef.current += 1; // 다음 페이지로 증가
    } catch (error) {
      setError('영화 목록을 가져오는 데 실패했습니다.');
      console.error(error);
    } finally {
      setLoading(false); // 로딩 상태 종료
    }
  }, []);

  // 처음 렌더링될 때 장르 목록과 영화 목록을 가져오기
  useEffect(() => {
    fetchGenres(); // 장르 목록 가져오기
    fetchMovies(); // 처음엔 전체 영화 목록을 가져옴
  }, [fetchMovies]);

  // 장르가 변경될 때 영화 목록을 다시 가져오기
  useEffect(() => {
    setMovies([]); // 장르가 바뀌면 영화 목록을 초기화
    pageRef.current = 1; // 페이지도 초기화
    hasMoreRef.current = true; // 추가 로딩 가능

    if (selectedGenre === '') {
      fetchMovies(); // 장르가 선택되지 않으면 전체 영화 목록 가져오기
    } else {
      fetchMovies(selectedGenre); // 선택된 장르에 맞는 영화 목록 가져오기
    }
  }, [selectedGenre, fetchMovies]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading && hasMoreRef.current) {
        fetchMovies(selectedGenre); // 선택된 장르에 맞는 다음 페이지 영화 가져오기
      }
    });

    if (loader.current) {
      observer.observe(loader.current); // 로딩 요소를 관찰
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current); // 컴포넌트가 언마운트될 때 관찰 해제
      }
    };
  }, [fetchMovies, selectedGenre, loading]);

  if (loading && movies.length === 0) {
    return <p>대기 중...</p>; // 초기 로딩
  }

  if (error) {
    return <p>{error}</p>; // 에러 처리
  }

  return (
    <div>
      <h1>모든 영화 목록</h1>
      {/* 장르 선택 버튼들 */}
      <div
        className="genre-buttons"
        style={{ display: 'flex', position: 'relative' }}
      >
        <button
          className={`genre-button ${selectedGenre === '' ? 'active' : ''}`}
          onClick={() => setSelectedGenre('')} // 모든 장르 선택
        >
          모든 장르
        </button>
        {genres.map(
          (
            genre // 장르 목록을 버튼으로 표시
          ) => (
            <button
              key={genre.id}
              className={`genre-button ${
                selectedGenre === genre.id ? 'active' : ''
              }`}
              onClick={() => setSelectedGenre(genre.id)} // 특정 장르 선택
            >
              {genre.name}
            </button>
          )
        )}
      </div>
      {/* 영화 목록 표시 */}
      <MovieList movies={movies} className="movie-list" />
      {loading && <p>추가 데이터 로딩 중...</p>} {/* 추가 데이터 로딩 표시 */}
      <div ref={loader} style={{ height: '20px', margin: '20px 0' }} />
    </div>
  );
};

export default React.memo(MovieListPage);

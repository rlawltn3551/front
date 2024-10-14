import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { NavLink, useParams } from 'react-router-dom';
import MovieList from '../components/MovieList'; // 영화 목록을 렌더링할 컴포넌트

const CategoryPage = () => {
  const [genres, setGenres] = useState([]); // 장르 목록 상태
  const [movies, setMovies] = useState([]); // 영화 목록 상태
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const { genreId } = useParams(); // URL 파라미터에서 장르 ID를 가져옴
  const pageRef = useRef(1); // 페이지 번호 관리
  const hasMoreRef = useRef(true); // 더 가져올 데이터가 있는지 여부

  const TMDB_API_KEY = ''; // API 키

  // 장르 목록을 가져오는 함수
  const fetchGenres = async () => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}&language=ko-KR`
      );
      setGenres(response.data.genres);
    } catch (error) {
      console.error('장르 목록을 가져오는 데 실패했습니다.', error);
      setError('장르 목록을 가져오는 데 실패했습니다.');
    }
  };

  // 장르별 영화 목록을 가져오는 함수 (무한 스크롤 기능 포함)
  const fetchMoviesByGenre = async () => {
    if (loading || !hasMoreRef.current) return; // 이미 로딩 중이거나 더 이상 가져올 영화가 없으면 종료
    setLoading(true);

    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&language=ko-KR&page=${pageRef.current}&with_genres=${genreId}`
      );
      const fetchedMovies = response.data.results;

      // 영화 목록 상태를 업데이트 (기존 영화 목록에 새로 가져온 영화 추가)
      setMovies((prevMovies) => {
        const newMovies = [...prevMovies, ...fetchedMovies];
        // 중복 제거
        const uniqueMovies = Array.from(
          new Set(newMovies.map((movie) => movie.id))
        ).map((id) => newMovies.find((movie) => movie.id === id));
        return uniqueMovies; // 중복이 제거된 영화 목록 반환
      });

      // 추가 영화가 없으면 더 이상 데이터를 요청하지 않음
      if (fetchedMovies.length === 0) {
        hasMoreRef.current = false;
      }

      pageRef.current += 1; // 다음 페이지로 증가
    } catch (error) {
      console.error('영화 목록을 가져오는 데 실패했습니다.', error);
      setError('영화 목록을 가져오는 데 실패했습니다.');
    } finally {
      setLoading(false); // 로딩 상태 종료
    }
  };

  // 컴포넌트가 처음 렌더링될 때 장르 목록 가져오기
  useEffect(() => {
    fetchGenres();
  }, []);

  // 장르가 바뀔 때마다 영화 목록을 초기화하고 새로 가져오기
  useEffect(() => {
    setMovies([]); // 영화 목록 초기화
    pageRef.current = 1; // 페이지 번호 초기화
    hasMoreRef.current = true; // 추가 데이터를 가져올 수 있도록 설정

    if (genreId) {
      fetchMoviesByGenre(); // 해당 장르의 영화를 가져옴
    }
  }, [genreId]);

  // 무한 스크롤을 위한 스크롤 이벤트 핸들러
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100 // 페이지 하단에서 100px 남았을 때
      ) {
        fetchMoviesByGenre(); // 더 많은 영화 요청
      }
    };

    window.addEventListener('scroll', handleScroll); // 스크롤 이벤트 리스너 추가
    return () => window.removeEventListener('scroll', handleScroll); // 컴포넌트 언마운트 시 리스너 제거
  }, [genreId]);

  if (loading && movies.length === 0) {
    return <p>대기 중...</p>; // 초기 로딩 상태
  }

  if (error) {
    return <p>{error}</p>; // 에러 메시지
  }

  return (
    <div>
      <h1>영화 카테고리</h1>
      <ul>
        {genres.map((genre) => (
          <li key={genre.id}>
            <NavLink to={`/category/${genre.id}`}>{genre.name}</NavLink>
            {/* 장르별로 링크 */}
          </li>
        ))}
      </ul>
      {/* 영화 목록 표시 */}
      <MovieList movies={movies} />
      {loading && <p>추가 영화 로딩 중...</p>} {/* 추가 로딩 상태 표시 */}
    </div>
  );
};

export default CategoryPage;

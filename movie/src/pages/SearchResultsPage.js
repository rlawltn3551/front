import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import MovieList from '../components/MovieList';
import { useLocation } from 'react-router-dom';

const SearchResultsPage = () => {
  const [movies, setMovies] = useState([]); // 영화 목록
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null); // 오류 메시지
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [hasMore, setHasMore] = useState(true); // 더 가져올 영화가 있는지
  const location = useLocation(); // 현재 위치 가져오기
  const loader = useRef(null); // 로더 요소 참조

  const TMDB_API_KEY = '';

  const getQuery = () => {
    return new URLSearchParams(location.search).get('query');
  };

  // 영화 목록을 가져오는 함수
  const fetchMovies = async (searchQuery, page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&language=ko-KR&query=${encodeURIComponent(
          searchQuery
        )}&page=${page}`
      );
      const moviesData = response.data.results;
      setMovies((prevMovies) => [...prevMovies, ...moviesData]); // 이전 영화 목록에 추가

      // 총 페이지 수에 도달했는지 확인
      setHasMore(page < response.data.total_pages);
      setLoading(false);
    } catch (error) {
      console.error('영화 목록을 가져오는 데 실패했습니다.', error);
      setError('영화 목록을 가져오는 데 실패했습니다.');
      setLoading(false);
    }
  };

  // 컴포넌트가 처음 렌더링될 때 검색어로 영화 목록 가져오기
  useEffect(() => {
    const searchQuery = getQuery();
    if (searchQuery) {
      setMovies([]); // 새로운 검색 시 영화 목록 초기화
      setCurrentPage(1); // 첫 페이지로 초기화
      setHasMore(true); // 더 가져올 영화가 있다고 설정
      fetchMovies(searchQuery, 1); // 첫 번째 페이지 영화 목록 가져오기
    }
  }, [location.search]);

  // 현재 페이지가 바뀔 때마다 영화 목록 가져오기
  useEffect(() => {
    const searchQuery = getQuery();
    if (searchQuery && currentPage > 1 && hasMore) {
      fetchMovies(searchQuery, currentPage); // 다음 페이지 영화 목록 가져오기
    }
  }, [currentPage, location.search, hasMore]);

  // Intersection Observer를 통해 무한 스크롤 구현
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading && hasMore) {
        setCurrentPage((prevPage) => prevPage + 1); // 다음 페이지로 증가
      }
    });

    if (loader.current) {
      observer.observe(loader.current); // 로더 요소 관찰
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current); // 언마운트 시 관찰 해제
      }
    };
  }, [loader, loading, hasMore]);

  return (
    <div>
      <h1>영화 검색</h1>
      {loading && <p>대기 중...</p>}
      {error && <p>{error}</p>}
      {movies.length > 0 ? (
        <>
          <MovieList movies={movies} /> {/* 필터링된 영화 목록 보여주기 */}
          {hasMore && (
            <div ref={loader} style={{ height: '50px', margin: '20px 0' }}>
              {/* 로더를 위한 빈 div */}
            </div>
          )}
        </>
      ) : (
        <p>검색된 영화가 없습니다.</p> /* 검색 결과가 없을 경우 */
      )}
    </div>
  );
};

export default SearchResultsPage;

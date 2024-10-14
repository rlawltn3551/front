import React, { useEffect, useState } from 'react';
import MovieList from '../components/MovieList';
import axios from 'axios';

const PopularMoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const TMDB_API_KEY = '';

  useEffect(() => {
    const fetchPopularMovies = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=ko-KR`
        );
        setMovies(response.data.results); // 인기 영화 목록 설정
      } catch (e) {
        setError('영화 목록을 가져오는 데 실패했습니다.');
        console.log(e);
      }
      setLoading(false);
    };
    fetchPopularMovies();
  }, []);

  if (loading) {
    return <p>대기 중...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>인기 영화 목록</h1>
      <MovieList movies={movies} />
    </div>
  );
};

export default PopularMoviesPage;

import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MovieListPage from './pages/MovieListPage';
import Navbar from './components/Navbar';
import PopularMoviesPage from './pages/PopularMoviesPage';
import SearchResultsPage from './pages/SearchResultsPage';
import MainPage from './pages/MainPage';
import ErrorPage from './pages/ErrorPage';
import MovieDetailPage from './pages/MovieDetailPage';
import MyPage from './pages/MyPage';
import { ReviewProvider } from './context/ReviewContext';
import { FavoriteMoviesProvider } from './context/FavoriteMoviesContext';
import './styles/App.css';

const App = () => {
  return (
    <div className="App">
      <Navbar />
      {/* 관심 영화 Provider */}
      <FavoriteMoviesProvider>
        {/* 리뷰 Provider */}
        <ReviewProvider>
          <Routes>
            <Route path="/" element={<MainPage />} />
            {/* 영화 목록 페이지 */}
            <Route path="/movies" element={<MovieListPage />} />
            {/* 인기 영화 목록 페이지 */}
            <Route path="/popular" element={<PopularMoviesPage />} />
            {/* 검색 결과 페이지 */}
            <Route path="/search" element={<SearchResultsPage />} />
            {/* 영화 상세 페이지(리뷰 추가 기능) */}
            <Route path="/movie/:movieId" element={<MovieDetailPage />} />
            {/* 마이 페이지(리뷰 목록 확인, 리뷰 삭제 기능) */}
            <Route path="/mypage" element={<MyPage />} />
            {/* 에러 페이지 */}
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </ReviewProvider>
      </FavoriteMoviesProvider>
    </div>
  );
};

export default App;

import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/NavBar.css';

const NavBar = () => {
  return (
    <nav>
      <ul>
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? 'active-link' : '')}
            end // 홈 경로를 정확히 매칭하기 위해 end 추가
          >
            홈
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/movies"
            className={({ isActive }) => (isActive ? 'active-link' : '')}
          >
            영화 목록
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/popular"
            className={({ isActive }) => (isActive ? 'active-link' : '')}
          >
            인기 영화
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/mypage"
            className={({ isActive }) => (isActive ? 'active-link' : '')}
          >
            마이페이지
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;

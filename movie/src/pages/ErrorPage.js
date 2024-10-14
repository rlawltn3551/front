import React from 'react';

const ErrorPage = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>페이지를 찾을 수 없습니다!</h1>
      <p>죄송합니다. 요청하신 페이지가 존재하지 않습니다.</p>
      <p>
        홈페이지로 돌아가려면 <a href="/">여기를 클릭하세요.</a>
      </p>
    </div>
  );
};

export default ErrorPage;

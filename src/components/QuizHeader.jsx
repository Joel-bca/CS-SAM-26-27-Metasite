import React from 'react';

const QuizHeader = ({ voterName }) => {
  return (
    <div className="quiz-header">
      <img
        src="https://raw.githubusercontent.com/Joel-bca/CS-SAM-26-27-Metasite/9f7c2746ec4ea940c7d622fcb4ab477379765386/chirst_logo.png"
        alt="Christ Logo"
        className="logo"
      />
      <h1>National Voters' Day Quiz</h1>
      <p>Welcome, <strong>{voterName}</strong></p>
    </div>
  );
};

export default QuizHeader;
import React from 'react';

const TimerCircle = ({ timeLeft }) => {
  const timerClass = timeLeft <= 15 ? "timer-warning" : "";

  return (
    <div className={`timer-circle ${timerClass}`}>
      <div className="timer-inner">
        <span className="timer-seconds">{timeLeft}</span>
        <span className="timer-label">sec</span>
      </div>
    </div>
  );
};

export default TimerCircle;
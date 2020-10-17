import React from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { Card } from 'reactstrap';

const minuteSeconds = 60;
const hourSeconds = 3600;
const daySeconds = 86400;

const timerProps = {
  isPlaying: true,
  size: 80,
  strokeWidth: 6,
};

const renderTime = (dimension, time) => {
  return (
    <div className="time-wrapper">
      <div className="time">{time}</div>
      <div>{dimension}</div>
    </div>
  );
};

const getTimeSeconds = (time) => (minuteSeconds - time / 1000) | 0;
const getTimeMinutes = (time) => ((time % hourSeconds) / minuteSeconds) | 0;

export default function CountdownPreguntas(props) {
  const mins = props.remainingTime
    ? Number(props.remainingTime.substring(0, 2)) * 60
    : 0;
  const segs = props.remainingTime
    ? Number(props.remainingTime.substring(3, 5))
    : 0;
  const remainingTime = mins + segs; // queda en segundos
  return (
    <div className="countdown">
      <Card className="mb-4 card-countdown-preguntas">
        <h3 className="text-countdown">Tiempo restante</h3>
        <CountdownCircleTimer
          {...timerProps}
          colors={[['#e2863b']]}
          duration={hourSeconds}
          initialRemainingTime={remainingTime % hourSeconds}
          onComplete={props.onFinish}
        >
          {({ elapsedTime }) =>
            renderTime(
              'minutos',
              getTimeMinutes(hourSeconds - elapsedTime / 1000)
            )
          }
        </CountdownCircleTimer>
        <CountdownCircleTimer
          {...timerProps}
          colors={[['#e2863b']]}
          duration={minuteSeconds}
          initialRemainingTime={remainingTime % minuteSeconds}
          onComplete={(totalElapsedTime) => [
            remainingTime - totalElapsedTime > 0,
          ]}
        >
          {({ elapsedTime }) =>
            renderTime('segundos', getTimeSeconds(elapsedTime))
          }
        </CountdownCircleTimer>
      </Card>
    </div>
  );
}

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
const getTimeHours = (time) => ((time % daySeconds) / hourSeconds) | 0;
const getTimeDays = (time) => (time / daySeconds) | 0;

export default function CountdownPreguntas(props) {
  // const startTime = props.start ? props.start.seconds : Date.now() / 1000; // use UNIX timestamp in seconds
  // const endTime = props.end.seconds; // use UNIX timestamp in seconds. Representa el horario de la preg lanzada + mins + segs seleccionados por el docente

  //const remainingTime = endTime - startTime;
  const mins = Number(props.remainingTime.substring(0, 2)) * 60;
  const segs = Number(props.remainingTime.substring(3, 5));
  const remainingTime = mins + segs;
  console.log('remainingTime', remainingTime);
  const days = Math.ceil(remainingTime / daySeconds);
  const daysDuration = days * daySeconds;
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

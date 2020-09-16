import React from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { Card } from 'reactstrap';

import * as _moment from 'moment';

// const renderTime = ({ remainingTime }) => {
//     const hours = Math.floor(remainingTime / 3600);
//     const minutes = Math.floor((remainingTime % 3600) / 60);
//     const seconds = remainingTime % 60;

//     if (remainingTime === 0) {
//       return <div className="timer">Too lale...</div>;
//     }

//     return (
//       <div className="timer">
//         <div className="text">Te quedan</div>
//         <div className="value">
//           {hours} hs :{minutes} min :{seconds} seg
//         </div>
//         {/* <div className="text">seconds</div> */}
//       </div>
//     );
//   };

//   export default function Countdown() {
//     return (
//       <div className="App">
//         <h1>
//           CountdownCircleTimer
//           <br />
//           React Component
//         </h1>
//         <div className="timer-wrapper">
//           <CountdownCircleTimer
//             isPlaying
//             duration={5000}
//             colors={[["#004777", 0.33], ["#F7B801", 0.33], ["#A30000"]]}
//             onComplete={() => [true, 1000]}
//           >
//             {renderTime}
//           </CountdownCircleTimer>
//         </div>
//         <p className="info">
//           Change component properties in the code filed on the right to try
//           difference functionalities
//         </p>
//       </div>
//     );
//   }

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

export default function Countdown(props) {
  const stratTime = props.start ? props.start.seconds : Date.now() / 1000; // use UNIX timestamp in seconds
  const endTime = props.end.seconds; // use UNIX timestamp in seconds
  const remainingTime = endTime - stratTime;
  const days = Math.ceil(remainingTime / daySeconds);
  const daysDuration = days * daySeconds;
  return (
    <div className="countdown">
      <Card className="mb-4 card-countdown">
        <h3 className="text-countdown">Tiempo restante</h3>
        <CountdownCircleTimer
          {...timerProps}
          colors={[['#e2863b']]}
          duration={daysDuration}
          initialRemainingTime={remainingTime}
        >
          {({ elapsedTime }) =>
            renderTime('días', getTimeDays(daysDuration - elapsedTime / 1000))
          }
        </CountdownCircleTimer>
        <CountdownCircleTimer
          {...timerProps}
          colors={[['#e2863b']]}
          duration={daySeconds}
          initialRemainingTime={remainingTime % daySeconds}
          onComplete={(totalElapsedTime) => [
            remainingTime - totalElapsedTime > hourSeconds,
          ]}
        >
          {({ elapsedTime }) =>
            renderTime('horas', getTimeHours(daySeconds - elapsedTime / 1000))
          }
        </CountdownCircleTimer>
        <CountdownCircleTimer
          {...timerProps}
          colors={[['#e2863b']]}
          duration={hourSeconds}
          initialRemainingTime={remainingTime % hourSeconds}
          onComplete={(totalElapsedTime) => [
            remainingTime - totalElapsedTime > minuteSeconds,
          ]}
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

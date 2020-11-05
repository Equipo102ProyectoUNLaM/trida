import { chartTooltip } from './util';

export const lineChartOptions = {
  legend: {
    display: false,
  },
  title: {
    display: true,
    text: 'Tiempo de Conexión por Clase (minutos)',
    fontFamily: 'Nunito',
  },
  responsive: true,
  maintainAspectRatio: false,
  tooltips: chartTooltip,
  plugins: {
    datalabels: {
      display: false,
    },
  },
  scales: {
    yAxes: [
      {
        gridLines: {
          display: true,
          lineWidth: 1,
          color: 'rgba(0,0,0,0.1)',
          drawBorder: false,
        },
        ticks: {
          beginAtZero: true,
          stepSize: 60,
          min: 0,
          max: 180,
          padding: 20,
          fontFamily: 'Nunito',
        },
        labels: {
          fontFamily: 'Nunito',
        },
      },
    ],
    xAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          fontFamily: 'Nunito',
        },
      },
    ],
  },
};

export const doughnutChartOptions = {
  legend: {
    position: 'bottom',
    labels: {
      padding: 30,
      usePointStyle: true,
      fontSize: 12,
      fontFamily: 'Nunito',
    },
  },
  responsive: true,
  maintainAspectRatio: false,
  title: {
    display: false,
  },
  cutoutPercentage: 80,
  layout: {
    padding: {
      bottom: 20,
    },
  },
  tooltips: chartTooltip,
};

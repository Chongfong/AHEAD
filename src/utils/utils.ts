const options = {
  scales: {
    x: { min: 200, max: 1000, title: { display: true, text: 'CD45-KrO' } },
    y: { min: 0, max: 1000, title: { display: true, text: 'SS INT LIN' } },
  },
  plugins: {
    title: {
      display: true,
      text: 'Cell Distribution (CD45+)',
    },
    legend: {
      display: false,
    },
  },
  animation: {
    duration: 0,
  },
  datasets: {
    scatter: {
      showLine: false,
    },
  },
  maintainAspectRatio: false,
};

function roundTo(number: number, decimalPlaces: number) {
  const factor = 10 ** decimalPlaces;
  return Math.round(number * factor) / factor;
}

export { options, roundTo };

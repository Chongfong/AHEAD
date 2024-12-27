import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { Scatter } from 'react-chartjs-2';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Chart as ChartJS } from 'chart.js/auto';

function ScatterPlot() {
  const [data, setData] = useState([]);

  const chartData = {
    datasets: [
      {
        label: 'Cell Distribution (CD45+)',
        data: data.map((item) => ({ x: item['CD45-KrO'], y: item['SS INT LIN'] })),
        backgroundColor: 'gray',
        pointRadius: 1,
        showLine: false,
      },
    ],
  };

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
    animation: false,
    datasets: {
      scatter: {
        showLine: false,
      },
    },
    maintainAspectRatio: false,
  };

  useEffect(() => {
    fetch('/dataset/example.csv')
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          complete: (results) => {
            console.log('Parsing complete');
            setData(results.data);
          },
          error: (error) => {
            console.error('Error parsing CSV:', error);
          },
        });
      });
  }, []);
  return (
    <div>
      <Scatter data={chartData} options={options} />
    </div>
  );
}

export default ScatterPlot;

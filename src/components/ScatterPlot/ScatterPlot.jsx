import { useEffect, forwardRef } from 'react';
import Papa from 'papaparse';
import { Scatter } from 'react-chartjs-2';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Chart as ChartJS } from 'chart.js/auto';

// eslint-disable-next-line react/prop-types
const ScatterPlot = forwardRef(({ data, setData, options }, ref) => {
  const chartData = {
    datasets: [
      {
        label: 'Cell Distribution (CD45+)',
        // eslint-disable-next-line react/prop-types
        data: data.map((item) => ({ x: item['CD45-KrO'], y: item['SS INT LIN'] })),
        backgroundColor: 'gray',
        pointRadius: 1,
        showLine: false,
      },
    ],
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
  return <Scatter ref={ref} data={chartData} options={options} />;
});

export default ScatterPlot;
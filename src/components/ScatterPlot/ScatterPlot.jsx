import { useEffect, forwardRef, useMemo } from 'react';
import Papa from 'papaparse';
import { Scatter } from 'react-chartjs-2';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Chart as ChartJS } from 'chart.js/auto';

// eslint-disable-next-line react/prop-types
const ScatterPlot = forwardRef(({ data, setData, options }, ref) => {
  const chartData = useMemo(
    () => ({
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
    }),
    [data],
  );

  useEffect(() => {
    fetch('/dataset/CD45_pos.csv')
      .then((response) => response.body.getReader())
      .then(
        (reader) =>
          new ReadableStream({
            start(controller) {
              function push() {
                reader.read().then(({ done, value }) => {
                  if (done) {
                    controller.close();
                    return;
                  }
                  controller.enqueue(value);
                  push();
                });
              }
              push();
            },
          }),
      )
      .then((stream) => new Response(stream))
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          chunk: (results) => {
            setData((prevData) => [...prevData, ...results.data]);
          },
          chunkSize: 1024 * 1024 * 1,
          complete: () => {
            console.log('Parsing complete');
          },
          error: (error) => {
            console.error('Error parsing CSV:', error);
          },
        });
      });
  }, [setData]);
  return <Scatter ref={ref} data={chartData} options={options} />;
});

export default ScatterPlot;

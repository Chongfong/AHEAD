import React, { useEffect, forwardRef, useMemo } from 'react';
import Papa from 'papaparse';
import { Scatter } from 'react-chartjs-2';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import type { ChartData, ChartOptions } from 'chart.js';
import { ChartJSOrUndefined } from 'react-chartjs-2/dist/types';
import { DataInterface, Point } from '../ScatterPlotDisplay';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface ScatterPlotProps {
  data: DataInterface[];
  setData: React.Dispatch<React.SetStateAction<DataInterface[]>>;
  options: ChartOptions<'scatter'>;
}

const ScatterPlot = forwardRef(
  (
    { data, setData, options }: ScatterPlotProps,
    ref: React.ForwardedRef<ChartJSOrUndefined<'scatter', (number | Point | null)[], unknown>>,
  ) => {
    const chartData = useMemo<ChartData<'scatter'>>(
      () => ({
        datasets: [
          {
            label: 'Cell Distribution (CD45+)',
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
        .then((response) => {
          if (response.body) {
            return response.body.getReader();
          }
          throw new Error('No response body');
        })

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
            chunk: (results: { data: DataInterface[] }) => {
              setData((prevData) => [...prevData, ...results.data]);
            },
            chunkSize: 1024 * 1024 * 1,
            complete: () => {
              console.log('Parsing complete');
            },
            error: (error: Error) => {
              console.error('Error parsing CSV:', error);
            },
          });
        });
    }, [setData]);
    return <Scatter ref={ref} data={chartData} options={options} />;
  },
);

export default ScatterPlot;

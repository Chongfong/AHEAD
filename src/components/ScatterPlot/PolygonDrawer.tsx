import React, { useState, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Chart as ChartJS } from 'chart.js/auto';
import { ChartJSOrUndefined } from 'react-chartjs-2/dist/types';
import pointInPolygon from '../../utils/polygonUtils';
import ScatterPlot from './ScatterPlot';
import { options } from '../../utils/utils';
// eslint-disable-next-line import/no-cycle
import { DataInterface, PolygonInterface, Point } from '../ScatterPlotDisplay';

interface PolygonDrawerProps {
  drawing: boolean;
  setDrawing: React.Dispatch<React.SetStateAction<boolean>>;
  data: DataInterface[];
  setData: React.Dispatch<React.SetStateAction<DataInterface[]>>;
  polygons: PolygonInterface[];
  setPolygons: React.Dispatch<React.SetStateAction<PolygonInterface[]>>;
  setColors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
}

function PolygonDrawer({
  drawing,
  setDrawing,
  data,
  setData,
  polygons,
  setPolygons,
  setColors,
}: PolygonDrawerProps) {
  const [currentPolygonPoints, setCurrentPolygonPoints] = useState<Point[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);
  const startPoint = useRef<Point | null>(null);
  const chartRef = useRef<ChartJSOrUndefined<'scatter', (number | Point | null)[], unknown>>(null);
  const countRef = useRef<number>(0);

  const isCloseToStart = (point: Point) => {
    if (!startPoint.current) return false;
    const distance = Math.sqrt(
      (point.x - startPoint.current.x) ** 2 + (point.y - startPoint.current.y) ** 2,
    );
    return distance < 20;
  };

  const getChartPoint = useCallback(
    (point: Point) => {
      const chart = chartRef.current;
      if (!chart) return [0, 0];
      const xScale = chart.scales.x;
      const yScale = chart.scales.y;
      return [xScale.getValueForPixel(point.x), yScale.getValueForPixel(point.y)];
    },
    [chartRef],
  );

  const getPixelPoint = (dataPoint: Point) => {
    const chart = chartRef.current;
    if (!chart) return { x: 0, y: 0 };
    const xScale = chart.scales.x;
    const yScale = chart.scales.y;
    return { x: xScale.getPixelForValue(dataPoint.x), y: yScale.getPixelForValue(dataPoint.y) };
  };

  const currentPoint = currentPolygonPoints.map((p) => {
    if (!chartRef.current) return { x: 0, y: 0 };
    return getPixelPoint({
      x:
        options.scales.x.min +
        ((options.scales.x.max - options.scales.x.min) * p.x) / chartRef.current.chartArea.width,
      y:
        options.scales.y.max -
        ((options.scales.y.max - options.scales.y.min) * p.y) / chartRef.current.chartArea.height,
    });
  });

  const handleMouseDownCallback = useCallback(
    (e: React.MouseEvent) => {
      if (!chartRef.current || !drawing) return;

      const { chartArea } = chartRef.current;
      const { canvas } = chartRef.current;

      if (!chartArea || !canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - chartArea.left;
      const y = e.clientY - rect.top - chartArea.top;

      const newPoint = { x, y };

      if (currentPolygonPoints.length > 2 && isCloseToStart(newPoint)) {
        const chartPolygon = currentPoint.map((p) => getChartPoint(p));

        const selectedPointsSet = new Set<string>();
        data.forEach((dataPoint) => {
          if (pointInPolygon([dataPoint['CD45-KrO'], dataPoint['SS INT LIN']], chartPolygon)) {
            selectedPointsSet.add(JSON.stringify(dataPoint));
          }
        });

        const newPolygon: PolygonInterface = {
          id: uuidv4(),
          points: [...currentPolygonPoints, currentPolygonPoints[0]],
          label: `Polygon ${(countRef.current += 1)}`,
          selected: Array.from(selectedPointsSet).map((s) => JSON.parse(s)) as DataInterface[],
          hide: false,
          strokeWidth: 2,
          showMarker: false,
          color: '',
        };

        const newColor = `#${(Math.random() * 0xfffff * 1000000).toString(16).slice(0, 6)}`;
        setColors((prevColors) => ({ ...prevColors, [newPolygon.id]: newColor }));
        newPolygon.color = newColor;
        setPolygons([...polygons, newPolygon]);
        setCurrentPolygonPoints([]);
        startPoint.current = null;
        setDrawing(false);
      } else {
        setCurrentPolygonPoints([...currentPolygonPoints, newPoint]);
        if (currentPolygonPoints.length === 0) {
          startPoint.current = newPoint;
        }
      }
    },
    [
      chartRef,
      drawing,
      currentPolygonPoints,
      currentPoint,
      data,
      setColors,
      setPolygons,
      polygons,
      setDrawing,
      getChartPoint,
    ],
  );

  const handleMouseDown = (e: React.MouseEvent) => handleMouseDownCallback(e);

  return (
    <div className='scatter-container'>
      <ScatterPlot ref={chartRef} data={data} setData={setData} options={options} />
      <svg ref={svgRef} width='100%' height='100%' onMouseDown={handleMouseDown}>
        {polygons.map((polygon) => {
          const pixelPoints = polygon.points.map((p) => {
            if (!chartRef.current) return { x: 0, y: 0 };
            return getPixelPoint({
              x:
                options.scales.x.min +
                ((options.scales.x.max - options.scales.x.min) * p.x) /
                  chartRef.current.chartArea.width,
              y:
                options.scales.y.max -
                ((options.scales.y.max - options.scales.y.min) * p.y) /
                  chartRef.current.chartArea.height,
            });
          });

          const polygonPath = pixelPoints.map((p) => `${p.x},${p.y}`).join(' ');

          return polygon.hide ? null : (
            <g key={uuidv4()}>
              <polygon
                points={polygonPath}
                fill='none'
                stroke={polygon.color}
                strokeWidth={polygon.strokeWidth}
                opacity={1}
                markerEnd={polygon.showMarker ? 'url(#circle)' : undefined}
                markerStart={polygon.showMarker ? 'url(#circle)' : undefined}
                markerMid={polygon.showMarker ? 'url(#circle)' : undefined}
              />
              <marker
                id='circle'
                markerWidth='12'
                markerHeight='12'
                refX='6'
                refY='6'
                markerUnits='userSpaceOnUse'
              >
                <circle cx='6' cy='6' r='3' strokeWidth='2' stroke='context-stroke' fill='white' />
              </marker>
              <text x={pixelPoints[0].x + 10} y={pixelPoints[0].y - 10} fill={polygon.color}>
                {polygon.label}
              </text>
            </g>
          );
        })}
        {currentPolygonPoints.length > 0 && (
          <polygon
            points={currentPoint.map((p) => `${p.x},${p.y}`).join(' ')}
            fill='rgba(0, 0, 255, 0.3)'
            stroke='blue'
          />
        )}
      </svg>
    </div>
  );
}

export default PolygonDrawer;

/* eslint-disable react/prop-types */
import { useState } from 'react';
import useIntersectionCalculation from '../../hooks/useIntersectionCalculation';
import { PolygonInterface, DataInterface } from '../ScatterPlotDisplay';

interface CountSectionProps {
  polygons: PolygonInterface[];
  selectedPolygons: (string | null)[];
  handleSelectPolygon: (polygonId: string | null, index: number) => void;
  data: DataInterface[];
}

function CountSection({
  polygons,
  selectedPolygons,
  handleSelectPolygon,
  data,
}: CountSectionProps) {
  const [symbol, setSymbol] = useState('and');
  const { intersectionCount, intersectionPercentage } = useIntersectionCalculation(
    polygons,
    data,
    selectedPolygons,
    symbol,
  );

  // console.log(polygons);
  // console.log(selectedPolygons);

  return (
    <>
      <h2>Count</h2>
      <div className='button-container'>
        <select
          value={selectedPolygons[0] as string}
          onChange={(e) => handleSelectPolygon(e.target.value === '' ? null : e.target.value, 0)}
        >
          {polygons.map((polygon) => (
            <option key={polygon.id} value={polygon.id}>
              {polygon.label}
            </option>
          ))}
        </select>
        <select value={symbol} onChange={(e) => setSymbol(e.target.value)}>
          <option value='and'>AND</option>
          <option value='or'>OR</option>
          <option value='not'>NOT</option>
        </select>
        <select
          value={selectedPolygons[1] as string}
          onChange={(e) => handleSelectPolygon(e.target.value === '' ? null : e.target.value, 1)}
        >
          {polygons.map((polygon) => (
            <option key={polygon.id} value={polygon.id}>
              {polygon.label}
            </option>
          ))}
        </select>
      </div>
      <p>
        Calculate: {intersectionCount} / {intersectionPercentage}%
      </p>
    </>
  );
}

export default CountSection;

/* eslint-disable react/prop-types */
import { useState } from 'react';
import useIntersectionCalculation from '../../hooks/useIntersectionCalculation';

function CountSection({ polygons, selectedPolygons, handleSelectPolygon, data }) {
  const [symbol, setSymbol] = useState('and');
  const { intersectionCount, intersectionPercentage } = useIntersectionCalculation(
    polygons,
    data,
    selectedPolygons,
    symbol,
  );

  return (
    <>
      <h2>Count</h2>
      <div className='button-container'>
        <select
          value={selectedPolygons[0]}
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
          value={selectedPolygons[1]}
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

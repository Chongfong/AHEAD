/* eslint-disable react/prop-types */
import React from 'react';

// eslint-disable-next-line react/prop-types
function SettingsDisplay({ drawing, setDrawing, data, polygons, setPolygons }) {
  const handleDrawing = () => {
    setDrawing(!drawing);
  };

  function roundTo(number, decimalPlaces) {
    const factor = 10 ** decimalPlaces;
    return Math.round(number * factor) / factor;
  }

  const handleHide = (polygonId) => {
    setPolygons((prevPolygons) =>
      prevPolygons.map((polygon) =>
        polygon.id === polygonId ? { ...polygon, hide: !polygon.hide } : polygon,
      ),
    );
  };

  return (
    <div className='data-display'>
      <h2>Data Display</h2>
      <button type='button' onClick={handleDrawing}>
        Add
      </button>
      <p>Number of points: {data.length}</p>
      {polygons.map((polygon) => (
        <div key={polygon.id}>
          <p>{`Polygon ${polygon.label}`}</p>
          <p>{`Selected points: ${polygon.selected.length}, ${roundTo((polygon.selected.length / data.length) * 100, 2)} %`}</p>
          <button type='button' onClick={() => handleHide(polygon.id)}>
            {polygon.hide ? 'Show' : 'Hide'}
          </button>
        </div>
      ))}
    </div>
  );
}

export default SettingsDisplay;

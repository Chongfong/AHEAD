/* eslint-disable react/prop-types */
import React from 'react';

// eslint-disable-next-line react/prop-types
function SettingsDisplay({ drawing, setDrawing, selectedPointsRef }) {
  const handleDrawing = () => {
    setDrawing(!drawing);
  };

  return (
    <div className='data-display'>
      <h2>Data Display</h2>
      <button type='button' onClick={handleDrawing}>
        Add
      </button>
      {Array.from(selectedPointsRef.current.entries()).map(([key, polygon]) => (
        <div key={key}>
          <p>{`Polygon ${polygon.label}`}</p>
          <p>{`Number of points: ${polygon.points.length}`}</p>
        </div>
      ))}
    </div>
  );
}

export default SettingsDisplay;

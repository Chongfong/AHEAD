import React from 'react';

// eslint-disable-next-line react/prop-types
function SettingsDisplay({ drawing, setDrawing }) {
  const handleDrawing = () => {
    setDrawing(!drawing);
  };

  return (
    <div className='data-display'>
      <h2>Data Display</h2>
      <button type='button' onClick={handleDrawing}>
        Add
      </button>
    </div>
  );
}

export default SettingsDisplay;

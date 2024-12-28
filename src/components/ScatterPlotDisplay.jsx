import React, { useState, useRef } from 'react';
import PolygonDrawer from './ScatterPlot/PolygonDrawer';
import SettingsDisplay from './ScatterPlot/SettingsDisplay';

function ScatterPlotDisplay() {
  const [drawing, setDrawing] = useState(false);
  const selectedPointsRef = useRef(new Map());

  return (
    <div className='scatter-plot'>
      <PolygonDrawer
        setDrawing={setDrawing}
        drawing={drawing}
        selectedPointsRef={selectedPointsRef}
      />
      <SettingsDisplay
        setDrawing={setDrawing}
        drawing={drawing}
        selectedPointsRef={selectedPointsRef}
      />
    </div>
  );
}

export default ScatterPlotDisplay;

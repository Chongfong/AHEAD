import React, { useState } from 'react';
import PolygonDrawer from './ScatterPlot/PolygonDrawer';
import SettingsDisplay from './ScatterPlot/SettingsDisplay';

function ScatterPlotDisplay() {
  const [drawing, setDrawing] = useState(false);
  return (
    <div className='scatter-plot'>
      <PolygonDrawer setDrawing={setDrawing} drawing={drawing} />
      <SettingsDisplay setDrawing={setDrawing} drawing={drawing} />
    </div>
  );
}

export default ScatterPlotDisplay;

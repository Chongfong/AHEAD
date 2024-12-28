import React, { useState } from 'react';
import PolygonDrawer from './ScatterPlot/PolygonDrawer';
import SettingsDisplay from './ScatterPlot/SettingsDisplay';

function ScatterPlotDisplay() {
  const [drawing, setDrawing] = useState(false);
  const [data, setData] = useState([]);
  const [polygons, setPolygons] = useState([]);

  return (
    <div className='scatter-plot'>
      <PolygonDrawer
        setDrawing={setDrawing}
        drawing={drawing}
        polygons={polygons}
        setPolygons={setPolygons}
        data={data}
        setData={setData}
      />
      <SettingsDisplay setDrawing={setDrawing} drawing={drawing} polygons={polygons} data={data} />
    </div>
  );
}

export default ScatterPlotDisplay;

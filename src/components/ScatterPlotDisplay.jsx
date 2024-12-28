import React, { useState } from 'react';
import PolygonDrawer from './ScatterPlot/PolygonDrawer';
import SettingsDisplay from './ScatterPlot/SettingsDisplay';

function ScatterPlotDisplay() {
  const [drawing, setDrawing] = useState(false);
  const [data, setData] = useState([]);
  const [polygons, setPolygons] = useState([]);
  const [colors, setColors] = useState({});

  return (
    <div className='scatter-plot'>
      <PolygonDrawer
        setDrawing={setDrawing}
        drawing={drawing}
        polygons={polygons}
        setPolygons={setPolygons}
        data={data}
        setData={setData}
        setColors={setColors}
        colors={colors}
      />
      <SettingsDisplay
        setDrawing={setDrawing}
        drawing={drawing}
        polygons={polygons}
        setPolygons={setPolygons}
        data={data}
        setColors={setColors}
        colors={colors}
      />
    </div>
  );
}

export default ScatterPlotDisplay;

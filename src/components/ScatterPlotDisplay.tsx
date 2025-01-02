import React, { useState } from 'react';
import PolygonDrawer from './ScatterPlot/PolygonDrawer';
import SettingsDisplay from './SettingsDisplay/SettingsDisplay';

export interface DataInterface {
  'FS INT LIN': number;
  'SS INT LIN': number;
  'Kappa-FITC': number;
  'Lambda-PE': number;
  'CD10-ECD': number;
  'CD5-PC5.5': number;
  'CD200-PC7': number;
  'CD34-APC': number;
  'CD38-APC-A700': number;
  'CD20-APC-A750': number;
  'CD19-PB': number;
  'CD45-KrO': number;
  TIME: number;
  'FS PEAK LIN': number;
  'SS PEAK LIN': number;
}

export interface Point {
  x: number;
  y: number;
}

export interface PolygonInterface {
  id: string;
  points: Point[];
  label: string;
  selected: DataInterface[];
  hide: boolean;
  strokeWidth: number;
  showMarker: boolean;
  color: string;
}

function ScatterPlotDisplay() {
  const [drawing, setDrawing] = useState<boolean>(false);
  const [data, setData] = useState<DataInterface[]>([]);
  const [polygons, setPolygons] = useState<PolygonInterface[]>([]);
  const [colors, setColors] = useState<{ [key: string]: string }>({});

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

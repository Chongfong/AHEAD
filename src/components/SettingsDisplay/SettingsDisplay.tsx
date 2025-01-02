/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import PolygonSection from './PolygonsSection';
import CountSection from './CountSection';
import { DataInterface, PolygonInterface } from '../ScatterPlotDisplay';

interface SettingsDisplayProps {
  drawing: boolean;
  setDrawing: React.Dispatch<React.SetStateAction<boolean>>;
  data: DataInterface[];
  polygons: PolygonInterface[];
  setPolygons: React.Dispatch<React.SetStateAction<PolygonInterface[]>>;
  colors: { [key: string]: string };
  setColors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
}

function SettingsDisplay({
  drawing,
  setDrawing,
  data,
  polygons,
  setPolygons,
  colors,
  setColors,
}: SettingsDisplayProps) {
  const [openColorPickers, setOpenColorPickers] = useState<{ [key: string]: boolean }>({});
  const colorPickerRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [selectedPolygons, setSelectedPolygons] = useState<(string | null)[]>([null, null]);

  const handleClickOutside = useCallback(
    (event: MouseEvent, polygonId: string) => {
      const ref = colorPickerRefs.current[polygonId];
      if (ref && !ref.contains(event.target as Node)) {
        setOpenColorPickers((prev) => ({ ...prev, [polygonId]: false }));
      }
    },
    [colorPickerRefs],
  );

  useEffect(() => {
    const handleGlobalClick = (event: MouseEvent) => {
      Object.keys(openColorPickers).forEach((polygonId) => {
        if (openColorPickers[polygonId]) {
          handleClickOutside(event, polygonId);
        }
      });
    };

    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, [handleClickOutside, openColorPickers]);

  const handleDrawing = () => {
    setDrawing(true);
  };

  const handleSelectPolygon = useCallback(
    (polygonId: string | null, position: number) => {
      setSelectedPolygons((prevSelected) => {
        const newSelection = [...prevSelected];
        newSelection[position] = polygonId;
        return newSelection as string[];
      });
    },
    [setSelectedPolygons],
  );

  useEffect(() => {
    if (polygons.length === 1) {
      const firstPolygonId = polygons[0]?.id;
      setSelectedPolygons([firstPolygonId, firstPolygonId]);
    }
  }, [polygons, setSelectedPolygons]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className='data-display'>
        <h2>Data Display</h2>
        <div className='button-container'>
          <button type='button' onClick={handleDrawing} className='add-button'>
            ＋
          </button>
          {drawing && <span>click to draw</span>}
        </div>
        <p>Number of points: {data.length}</p>
        {polygons.length > 0 &&
          polygons.map((polygon, index) => (
            <PolygonSection
              key={polygon.id}
              polygon={polygon}
              index={index}
              polygons={polygons}
              selectedPolygons={selectedPolygons}
              setSelectedPolygons={setSelectedPolygons}
              setColors={setColors}
              setPolygons={setPolygons}
              openColorPickers={openColorPickers}
              setOpenColorPickers={setOpenColorPickers}
              colors={colors}
              data={data}
              colorPickerRefs={colorPickerRefs}
            />
          ))}

        {polygons.length > 1 && (
          <CountSection
            polygons={polygons}
            selectedPolygons={selectedPolygons}
            handleSelectPolygon={handleSelectPolygon}
            data={data}
          />
        )}
      </div>
    </DndProvider>
  );
}

export default SettingsDisplay;

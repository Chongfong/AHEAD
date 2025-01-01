/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import PolygonSection from './PolygonsSection';
import CountSection from './CountSection';

// eslint-disable-next-line react/prop-types
function SettingsDisplay({ drawing, setDrawing, data, polygons, setPolygons, colors, setColors }) {
  const [openColorPickers, setOpenColorPickers] = useState({});
  const colorPickerRefs = useRef({});
  const [selectedPolygons, setSelectedPolygons] = useState([null, null]);

  const handleClickOutside = useCallback(
    (event, polygonId) => {
      if (
        colorPickerRefs.current[polygonId] &&
        !colorPickerRefs.current[polygonId].contains(event.target)
      ) {
        setOpenColorPickers((prev) => ({ ...prev, [polygonId]: false }));
      }
    },
    [colorPickerRefs],
  );

  useEffect(() => {
    const handleGlobalClick = (event) => {
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
    (polygonId, position) => {
      setSelectedPolygons((prevSelected) => {
        const newSelection = [...prevSelected];
        newSelection[position] = polygonId;
        return newSelection;
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

/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';

// eslint-disable-next-line react/prop-types
function SettingsDisplay({ drawing, setDrawing, data, polygons, setPolygons, colors, setColors }) {
  const [openColorPickers, setOpenColorPickers] = useState({});
  const colorPickerRefs = useRef({});

  const handleClickOutside = (event, polygonId) => {
    if (
      colorPickerRefs.current[polygonId] &&
      !colorPickerRefs.current[polygonId].contains(event.target)
    ) {
      setOpenColorPickers((prev) => ({ ...prev, [polygonId]: false }));
    }
  };

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
  }, [openColorPickers]);

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

  const handleChangeColor = (polygonId, newColor) => {
    setPolygons((prevPolygons) =>
      prevPolygons.map((polygon) =>
        polygon.id === polygonId ? { ...polygon, color: newColor } : polygon,
      ),
    );
    setColors((prevColors) => ({ ...prevColors, [polygonId]: newColor }));
  };

  const handleOpenColorPicker = (polygonId) => {
    setOpenColorPickers((prev) => ({ ...prev, [polygonId]: true }));
  };

  const handleChangeStroke = (polygonId, showMarker, width) => {
    setPolygons((prevPolygons) =>
      prevPolygons.map((polygon) =>
        polygon.id === polygonId ? { ...polygon, showMarker, strokeWidth: width } : polygon,
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
          <div
            type='button'
            className='color-pick'
            ref={(el) => {
              colorPickerRefs.current[polygon.id] = el;
            }}
            style={{ backgroundColor: polygon.color }}
            onClick={() => handleOpenColorPicker(polygon.id)}
            tabIndex={0}
            role='button'
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleOpenColorPicker();
              }
            }}
          >
            {openColorPickers[polygon.id] && (
              <HexColorPicker
                color={colors[polygon.id]}
                onChange={(newColor) => handleChangeColor(polygon.id, newColor)}
              />
            )}
          </div>
          <select
            value={polygon.showMarker ? 'marker' : 'straight'}
            onChange={(e) =>
              handleChangeStroke(polygon.id, e.target.value === 'marker', polygon.strokeWidth)
            }
          >
            <option value='straight'>---</option>
            <option value='marker'>o-o-o</option>
          </select>
          <p>width</p>
          <select
            label='width'
            value={polygon.strokeWidth}
            onChange={(e) => handleChangeStroke(polygon.id, polygon.showMarker, e.target.value)}
          >
            {[...Array(10)]
              .map((_, i) => i + 1)
              .map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
          </select>
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

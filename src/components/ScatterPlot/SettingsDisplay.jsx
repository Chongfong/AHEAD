/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { HexColorPicker } from 'react-colorful';
import update from 'immutability-helper';
import _ from 'lodash';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { v4 as uuidv4 } from 'uuid';
import { DraggableComponent } from './DraggableComponent';

// eslint-disable-next-line react/prop-types
function SettingsDisplay({ drawing, setDrawing, data, polygons, setPolygons, colors, setColors }) {
  const [openColorPickers, setOpenColorPickers] = useState({});
  const colorPickerRefs = useRef({});
  const [selectedPolygons, setSelectedPolygons] = useState([0, 1]);
  const [symbol, setSymbol] = useState('and');

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
    setDrawing(true);
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

  const handleLabelChange = (polygonId, newLabel) => {
    if (newLabel.trim() === '') return;
    setPolygons((prevPolygons) =>
      prevPolygons.map((polygon) =>
        polygon.id === polygonId ? { ...polygon, label: newLabel } : polygon,
      ),
    );
  };

  const handleSelectPolygon = (polygonId, position) => {
    setSelectedPolygons((prevSelected) => {
      const newSelection = [...prevSelected];
      newSelection[position] = polygonId;
      return newSelection;
    });
  };

  const calculateIntersection = (polygon1, polygon2, operator) => {
    if (!polygon1 || !polygon2) return [];
    const p1 = polygon1.selected;
    const p2 = polygon2.selected;
    if (operator === 'and') {
      return _.intersectionWith(p1, p2, _.isEqual);
    }
    if (operator === 'or') {
      return _.unionWith(p1, p2, _.isEqual);
    }
    return _.differenceWith(p1, p2, _.isEqual);
  };

  const moveEl = useCallback(
    (dragIndex, hoverIndex) => {
      setPolygons((prevEls) =>
        update(prevEls, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prevEls[dragIndex]],
          ],
        }),
      );
    },
    [setPolygons],
  );

  const handleCopy = (polygonId) => {
    const copySelectedPolygons = polygons.filter((p) => p.id === polygonId)[0];
    const newPolygon = {
      ...copySelectedPolygons,
      id: polygons.length + 1,
      label: `${copySelectedPolygons.label} copy`,
    };
    setPolygons((prevPolygons) => [...prevPolygons, newPolygon]);
  };

  const handleDelete = (polygonId) => {
    setPolygons((prevPolygons) => {
      const updatedPolygons = prevPolygons.filter((p) => p.id !== polygonId);
      if (selectedPolygons.includes(polygonId)) {
        if (updatedPolygons.length >= 2) {
          setSelectedPolygons([updatedPolygons[0].id, updatedPolygons[1].id]);
        } else {
          setSelectedPolygons([updatedPolygons[0].id, updatedPolygons[0].id]);
        }
      }
      return updatedPolygons;
    });
  };

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
        {polygons.map((polygon, index) => (
          <DraggableComponent
            key={polygon.id}
            id={polygon.id}
            index={index}
            type='landing-page-element'
            onDrop={moveEl}
          >
            <div
              key={polygon.id}
              className='polygon-container'
              style={{
                opacity: polygon.hide ? 0.2 : 1,
              }}
            >
              <div className='label-container'>
                <input
                  type='text'
                  value={polygon.label}
                  onChange={(e) => handleLabelChange(polygon.id, e.target.value)}
                  className='label-input'
                />
                <div className='button-container'>
                  <div
                    role='button'
                    tabIndex='0'
                    onClick={() => handleHide(polygon.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleHide(polygon.id);
                      }
                    }}
                    className='button'
                  >
                    <img
                      className='button-img'
                      src={polygon.hide ? '/hide.svg' : '/show.svg'}
                      alt={polygon.hide ? 'show' : 'hide'}
                    />
                  </div>
                  <div
                    role='button'
                    tabIndex='0'
                    onClick={() => handleCopy(polygon.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleCopy(polygon.id);
                      }
                    }}
                    className='button'
                  >
                    <img className='button-img' src='/copy.svg' alt='copy' />
                  </div>
                  <div
                    role='button'
                    tabIndex='0'
                    onClick={() => handleDelete(polygon.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleDelete(polygon.id);
                      }
                    }}
                    className='button'
                  >
                    <img className='button-img' src='/close.svg' alt='close' />
                  </div>
                </div>
              </div>
              <div className='button-container'>
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
                <fieldset>
                  <legend>Marker</legend>
                  <select
                    value={polygon.showMarker ? 'marker' : 'straight'}
                    onChange={(e) =>
                      handleChangeStroke(
                        polygon.id,
                        e.target.value === 'marker',
                        polygon.strokeWidth,
                      )
                    }
                  >
                    <option value='straight'>---</option>
                    <option value='marker'>o-o-o</option>
                  </select>
                </fieldset>
                <fieldset>
                  <legend>line width</legend>
                  <select
                    label='width'
                    value={polygon.strokeWidth}
                    onChange={(e) =>
                      handleChangeStroke(polygon.id, polygon.showMarker, e.target.value)
                    }
                  >
                    {[...Array(10)]
                      .map((__, i) => i + 1)
                      .map((i) => (
                        <option key={uuidv4()} value={i}>
                          {i}
                        </option>
                      ))}
                  </select>
                </fieldset>
              </div>
              <div className='count-container'>
                <span className='count'>{polygon.selected.length}</span>
                {`/${data.length} points selected, `}
                <span className='count'>
                  {roundTo((polygon.selected.length / data.length) * 100, 2)} %
                </span>
              </div>
            </div>
          </DraggableComponent>
        ))}

        {polygons.length > 1 && (
          <>
            <h2>Count</h2>
            <div className='button-container'>
              <select
                value={selectedPolygons[0]}
                onChange={(e) =>
                  handleSelectPolygon(
                    e.target.value === '' ? null : parseInt(e.target.value, 10),
                    0,
                  )
                }
              >
                {polygons.map((polygon) => (
                  <option key={polygon.id} value={polygon.id}>
                    {polygon.label}
                  </option>
                ))}
              </select>
              <select value={symbol} onChange={(e) => setSymbol(e.target.value)}>
                <option value='and'>AND</option>
                <option value='or'>OR</option>
                <option value='not'>NOT</option>
              </select>
              <select
                value={selectedPolygons[1]}
                onChange={(e) =>
                  handleSelectPolygon(
                    e.target.value === '' ? null : parseInt(e.target.value, 10),
                    1,
                  )
                }
              >
                {polygons.map((polygon) => (
                  <option key={polygon.id} value={polygon.id}>
                    {polygon.label}
                  </option>
                ))}
              </select>
            </div>
            <p>
              Calculate:{' '}
              {
                calculateIntersection(
                  polygons.filter((p) => p.id === selectedPolygons[0])[0],
                  polygons.filter((p) => p.id === selectedPolygons[1])[0],
                  symbol,
                ).length
              }
              {' / '}
              {roundTo(
                (calculateIntersection(
                  polygons.filter((p) => p.id === selectedPolygons[0])[0],
                  polygons.filter((p) => p.id === selectedPolygons[1])[0],
                  symbol,
                ).length /
                  data.length) *
                  100,
                2,
              )}
              %
            </p>
          </>
        )}
      </div>
    </DndProvider>
  );
}

export default SettingsDisplay;

/* eslint-disable no-param-reassign */
/* eslint-disable react/prop-types */
import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { HexColorPicker } from 'react-colorful';
import update from 'immutability-helper';
import { DraggableComponent } from './DraggableComponent';
import { roundTo } from '../../utils/utils';

function PolygonSection({
  polygon,
  index,
  setPolygons,
  polygons,
  selectedPolygons,
  setSelectedPolygons,
  setColors,
  setOpenColorPickers,
  colors,
  openColorPickers,
  data,
  colorPickerRefs,
}) {
  const handleHide = (polygonId) => {
    setPolygons((prevPolygons) =>
      prevPolygons.map((p) => (p.id === polygonId ? { ...p, hide: !p.hide } : p)),
    );
  };

  const handleChangeColor = useCallback(
    (polygonId, newColor) => {
      setPolygons((prevPolygons) =>
        prevPolygons.map((p) => (p.id === polygonId ? { ...p, color: newColor } : p)),
      );
      setColors((prevColors) => ({ ...prevColors, [polygonId]: newColor }));
    },
    [setPolygons, setColors],
  );
  const handleOpenColorPicker = useCallback(
    (polygonId) => {
      setOpenColorPickers((prev) => ({ ...prev, [polygonId]: true }));
    },
    [setOpenColorPickers],
  );

  const handleChangeStroke = useCallback(
    (polygonId, showMarker, width) => {
      setPolygons((prevPolygons) =>
        prevPolygons.map((p) =>
          p.id === polygonId ? { ...p, showMarker, strokeWidth: width } : p,
        ),
      );
    },
    [setPolygons],
  );

  const handleLabelChange = useCallback(
    (polygonId, newLabel) => {
      if (newLabel.trim() === '') return;
      setPolygons((prevPolygons) =>
        prevPolygons.map((p) => (p.id === polygonId ? { ...p, label: newLabel } : p)),
      );
    },
    [setPolygons],
  );

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

  const handleCopy = useCallback(
    (polygonId) => {
      const copySelectedPolygons = polygons.filter((p) => p.id === polygonId)[0];
      const newPolygon = {
        ...copySelectedPolygons,
        id: polygons.length + 1,
        label: `${copySelectedPolygons.label} copy`,
      };
      setPolygons((prevPolygons) => [...prevPolygons, newPolygon]);
    },
    [polygons, setPolygons],
  );

  const handleDelete = useCallback(
    (polygonId) => {
      setPolygons((prevPolygons) => {
        const updatedPolygons = prevPolygons.filter((p) => p.id !== polygonId);
        if (selectedPolygons.includes(polygonId)) {
          if (updatedPolygons.length >= 2) {
            setSelectedPolygons([updatedPolygons[0].id, updatedPolygons[1].id]);
          } else {
            setSelectedPolygons([updatedPolygons[0]?.id, updatedPolygons[0]?.id]);
          }
        }
        return updatedPolygons;
      });
    },
    [setPolygons, selectedPolygons, setSelectedPolygons],
  );

  return (
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
                handleChangeStroke(polygon.id, e.target.value === 'marker', polygon.strokeWidth)
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
              onChange={(e) => handleChangeStroke(polygon.id, polygon.showMarker, e.target.value)}
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
  );
}

export default PolygonSection;

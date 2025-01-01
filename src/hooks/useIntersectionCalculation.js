import { useEffect, useState } from 'react';
import { roundTo } from '../utils/utils';

const calculateIntersection = (polygon1, polygon2, operator) => {
  if (!polygon1 || !polygon2) return [];
  const p1 = polygon1.selected;
  const p2 = polygon2.selected;
  if (!p1 || !p2 || p1.length === 0 || p2.length === 0) return [];

  const set1 = new Set(p1.map((point) => JSON.stringify(point)));
  const set2 = new Set(p2.map((point) => JSON.stringify(point)));

  const result = [];

  if (operator === 'and') {
    set1.forEach((pointStr) => {
      if (set2.has(pointStr)) {
        result.push(JSON.parse(pointStr));
      }
    });
  } else if (operator === 'or') {
    const combinedSet = new Set([...set1, ...set2]);
    Array.from(combinedSet).forEach((pointStr) => {
      result.push(JSON.parse(pointStr));
    });
  } else {
    set1.forEach((pointStr) => {
      if (!set2.has(pointStr)) {
        result.push(JSON.parse(pointStr));
      }
    });
  }

  return result;
};

const useIntersectionCalculation = (polygons, data, selectedPolygons, symbol) => {
  const [intersectionCount, setIntersectionCount] = useState(0);
  const [intersectionPercentage, setIntersectionPercentage] = useState(0);

  useEffect(() => {
    if (polygons.length > 1 && selectedPolygons.length === 2) {
      const intersection = calculateIntersection(
        polygons.filter((p) => p.id === selectedPolygons[0])[0],
        polygons.filter((p) => p.id === selectedPolygons[1])[0],
        symbol,
      );
      setIntersectionCount(intersection.length);
      setIntersectionPercentage(roundTo((intersection.length / data.length) * 100, 2));
    }
  }, [polygons, data, selectedPolygons, symbol]);

  return { intersectionCount, intersectionPercentage };
};

export default useIntersectionCalculation;

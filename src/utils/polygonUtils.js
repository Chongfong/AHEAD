function pointInPolygon(point, vs) {
  const x = point[0];
  const y = point[1];
  let inside = false;
  const start = 0;
  const end = vs.length;
  const len = end - start;
  for (let i = 0, j = len - 1; i < len; j = i, i += 1) {
    const xi = vs[i + start][0];
    const yi = vs[i + start][1];
    const xj = vs[j + start][0];
    const yj = vs[j + start][1];
    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) {
      inside = !inside;
    }
  }
  return inside;
}

export default pointInPolygon;

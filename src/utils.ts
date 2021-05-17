export const distSquared = (x1: number, y1: number, x2: number, y2: number) => {
  return (x1 - x2) ** 2 + (y1 - y2) ** 2;
};

export const findBounds = (arr: any[]) => {
  const xMax = arr.length;
  const yMax = Math.max(...arr.map((p) => p.val));
  return { xMax, yMax };
};

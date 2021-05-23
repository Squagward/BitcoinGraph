const today = new Date();
const dayOfYear = Math.ceil((today.valueOf() - new Date(today.getFullYear(), 0, 1).valueOf()) / 86400000);
export const Range = {
    "5d": 5,
    "1m": 30,
    "6m": 180,
    "ytd": dayOfYear,
    "1y": 365,
    "5y": 1825
};
export const Colors = {
    TEXT: Renderer.color(214, 200, 49),
    TEXT_BACKGROUND: Renderer.color(77, 77, 77),
    AXES: [235 / 255, 64 / 255, 52 / 255],
    POINTS: [52 / 255, 168 / 255, 235 / 255],
    INTERSECT_LINES: [52 / 255, 235 / 255, 101 / 255],
    GRAPH_BACKGROUND: [0.3, 0.3, 0.3]
};

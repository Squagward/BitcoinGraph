export const GL11 = Java.type("org.lwjgl.opengl.GL11");
export const GraphDimensions = { width: 300, height: 300 };
export const screenCenterX = Renderer.screen.getWidth() / 2;
export const screenCenterY = Renderer.screen.getHeight() / 2;
export const Colors = {
    TEXT: [214, 200, 49],
    TEXT_BACKGROUND: [77, 77, 77],
    GRAPH_OUT_OF_BOUNDS: [100, 100, 100],
    AXES: [235, 64, 52].map((v) => v / 255),
    POINTS: [52, 168, 235].map((v) => v / 255),
    INTERSECT_LINES: [52, 235, 101].map((v) => v / 255),
    GRAPH_BACKGROUND: [77, 77, 77].map((v) => v / 255)
};
export const StartDates = {
    BTC: 1437350400000,
    ETH: 1463529600000,
    DOGE: 1622678400000,
    USDT: 1620086400000,
    ADA: 1616025600000,
    XLM: 1552521600000,
    LINK: 1561680000000,
    UNI: 1600300800000,
    BCH: 1513728000000,
    LTC: 1471478400000,
    GRT: 1608163200000,
    FIL: 1607472000000,
    AAVE: 1607990400000,
    EOS: 1554768000000,
    ALGO: 1565827200000,
    XTZ: 1565049600000,
    YFI: 1600128000000,
    NU: 1606867200000
};

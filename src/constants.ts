import type { Triplet } from "./types";

export const GL11 = Java.type("org.lwjgl.opengl.GL11");

export const GraphDimensions = { width: 300, height: 300 };

export const screenCenterX = Renderer.screen.getWidth() / 2;

export const screenCenterY = Renderer.screen.getHeight() / 2;

export const Colors: Record<string, Triplet> = {
  TEXT: [214, 200, 49] as Triplet,
  TEXT_BACKGROUND: [77, 77, 77] as Triplet,
  GRAPH_OUT_OF_BOUNDS: [100, 100, 100] as Triplet,
  AXES: [235, 64, 52].map((v) => v / 255) as Triplet,
  POINTS: [52, 168, 235].map((v) => v / 255) as Triplet,
  INTERSECT_LINES: [52, 235, 101].map((v) => v / 255) as Triplet,
  GRAPH_BACKGROUND: [77, 77, 77].map((v) => v / 255) as Triplet
};

export const StartDates: Record<string, number> = {
  BTC: 1437350400000, // "2015-07-20"
  ETH: 1463529600000, // "2016-05-18"
  DOGE: 1622678400000, // "2021-06-03"
  USDT: 1620086400000, // "2021-05-04"
  ADA: 1616025600000, // "2021-03-18"
  XLM: 1552521600000, // "2019-03-14"
  LINK: 1561680000000, // "2019-06-28"
  UNI: 1600300800000, // "2020-09-17"
  BCH: 1513728000000, // "2017-12-20"
  LTC: 1471478400000, // "2016-08-18"
  GRT: 1608163200000, // "2020-12-17"
  FIL: 1607472000000, // "2020-12-09"
  AAVE: 1607990400000, // "2020-12-15"
  EOS: 1554768000000, // "2019-04-09"
  ALGO: 1565827200000, // "2019-08-15"
  XTZ: 1565049600000, // "2019-08-06"
  YFI: 1600128000000, // "2020-09-15"
  NU: 1606867200000 // "2020-12-02"
};

export const enum Mode {
  HISTORICAL,
  LIVE
}

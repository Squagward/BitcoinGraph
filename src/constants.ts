import {
  AdditiveConstraint,
  ChildBasedMaxSizeConstraint,
  ChildBasedSizeConstraint,
  ConstantColorConstraint,
  PixelConstraint,
  UIContainer,
  UIRoundedRectangle,
  Window
} from "../../Elementa/index";
// @ts-ignore
import PogObject from "../../PogData";
import {
  getDayOfMonthsAgo,
  getDayOfYear,
  getDayOfYearsAgo,
  getDaysBetween
} from "./utils/dates";

export const GL11 = Java.type("org.lwjgl.opengl.GL11");

export const ScaledResolution = Java.type(
  "net.minecraft.client.gui.ScaledResolution"
);

export const URI = Java.type("java.net.URI") as any;

export const WebSocketClient = Java.type(
  "org.java_websocket.client.WebSocketClient"
);

const Color = Java.type("java.awt.Color");

export const Colors = {
  TEXT_BACKGROUND: [51, 51, 51],
  GRAPH_OUT_OF_BOUNDS: [76, 76, 76],
  AXES: [0.92, 0.25, 0.2],
  POINTS: [0.2, 0.66, 0.92],
  INTERSECT_LINES: [0.2, 0.92, 0.4],
  GRAPH_BACKGROUND: [0.2, 0.2, 0.2]
} as const;

export const StartDates = {
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
} as const;

export const enum Mode {
  HISTORICAL,
  LIVE
}

export const Range = {
  "5d": 5,
  "1m": getDaysBetween(getDayOfMonthsAgo(1)),
  "3m": getDaysBetween(getDayOfMonthsAgo(3)),
  "6m": getDaysBetween(getDayOfMonthsAgo(6)),
  "ytd": getDayOfYear(),
  "1y": getDaysBetween(getDayOfYearsAgo(1)),
  "2y": getDaysBetween(getDayOfYearsAgo(2)),
  "5y": getDaysBetween(getDayOfYearsAgo(5)),
  "max": 0
} as const;

export const entries = Object.entries<number>(StartDates);

export const data = new PogObject("BitcoinGraph", { x: 0, y: 0 });
data.autosave();

export const liveGui = new Gui();

export const liveDisplayBackground = new UIRoundedRectangle(5)
  .setX(new PixelConstraint(0))
  .setY(new PixelConstraint(0))
  .setColor(new ConstantColorConstraint(new Color(0.2, 0.2, 0.2, 0.5)))
  .setWidth(
    new AdditiveConstraint(
      new ChildBasedMaxSizeConstraint(),
      new PixelConstraint(10)
    )
  )
  .setHeight(
    new AdditiveConstraint(
      new ChildBasedSizeConstraint(),
      new PixelConstraint(10)
    )
  );

export const liveDisplayContainer = new UIContainer()
  .addChild(liveDisplayBackground)
  .setX(new PixelConstraint(data.x))
  .setY(new PixelConstraint(data.y))
  .setWidth(new ChildBasedMaxSizeConstraint())
  .setHeight(new ChildBasedSizeConstraint());

export const window = new Window().addChild(liveDisplayContainer);

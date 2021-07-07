import PogObject from "../../PogData";
import { getDayOfMonthsAgo, getDayOfYear, getDayOfYearsAgo, getDaysBetween } from "./utils/dates";
export const GL11 = Java.type("org.lwjgl.opengl.GL11");
export const ScaledResolution = Java.type("net.minecraft.client.gui.ScaledResolution");
export const URI = Java.type("java.net.URI");
export const WebSocketClient = Java.type("org.java_websocket.client.WebSocketClient");
export const Color = Java.type("java.awt.Color");
export const Colors = {
    GRAPH_OUT_OF_BOUNDS: [76, 76, 76],
    AXES: [0.92, 0.25, 0.2],
    POINTS: [0.2, 0.66, 0.92],
    INTERSECT_LINES: [0.2, 0.92, 0.4],
    GRAPH_BACKGROUND: [0.2, 0.2, 0.2]
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
};
export const entries = Object.entries(StartDates);
export const data = new PogObject("BitcoinGraph", { x: 0, y: 0 });
data.autosave();
export const liveGui = new Gui();

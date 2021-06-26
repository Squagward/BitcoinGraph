/// <reference types="../../ctautocomplete/index" />
import type { Triplet } from "./types";
export declare const GL11: any;
export declare const ScaledResolution: any;
export declare const URI: any;
export declare const WebSocketClient: any;
export declare const GraphDimensions: {
    width: number;
    height: number;
};
export declare const screenCenterX: number;
export declare const screenCenterY: number;
export declare const Colors: Record<string, Triplet>;
export declare const StartDates: Record<string, number>;
export declare const enum Mode {
    HISTORICAL = 0,
    LIVE = 1
}
export declare const Range: Record<string, number>;
export declare const entries: [string, number][];
export declare const data: any;
export declare const liveGui: Gui;
export declare const liveDisplay: Display;

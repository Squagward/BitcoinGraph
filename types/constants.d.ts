import type { Triplet } from "./types";
export declare const GL11: any;
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

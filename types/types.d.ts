export declare type DataEntry = [number, number, number, number, number, number];
export declare type DataPoint = {
    date: string;
    price: number;
};
export declare type ScreenPoint = {
    x: number;
    y: number;
};
declare type BasicPoint = [number, number];
export declare type Axes = [BasicPoint, BasicPoint, BasicPoint];
export declare type Triplet = [number, number, number];
export declare type WebSocketData = {
    type: string;
    sequence: number;
    product_id: string;
    price: string;
    open_24h: string;
    volume_24h: string;
    low_24h: string;
    high_24h: string;
    volume_30d: string;
    best_bid: string;
    best_ask: string;
    side: string;
    time: string;
    trade_id: number;
    last_size: string;
};
export {};

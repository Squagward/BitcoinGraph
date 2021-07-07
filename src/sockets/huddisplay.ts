import {
  CenterConstraint,
  PixelConstraint,
  UIText
} from "../../../Elementa/index";
// @ts-ignore
import Settings from "../../dist/settings";
import {
  data,
  entries,
  liveDisplayBackground,
  liveDisplayContainer,
  liveGui,
  URI,
  WebSocketClient,
  window
} from "../constants";
import type { WebSocketData } from "../types";
import { addCommas, findDecimalPlaces, formatTime } from "../utils/format";
import { createEmptyChildren, getPriceChangeColor } from "../utils/index";

const lines = createEmptyChildren(9);
const title = new UIText("")
  .setX(new CenterConstraint())
  .setY(new PixelConstraint(5));

let subscribed = false;
let lastPrice = 0;

// @ts-ignore
const displaySocket = new JavaAdapter(
  WebSocketClient,
  {
    onMessage(message: string): void {
      const {
        type,
        product_id,
        price,
        open_24h,
        volume_24h,
        low_24h,
        high_24h,
        volume_30d,
        time,
        last_size
      }: WebSocketData = JSON.parse(message);
      if (type !== "ticker") return;

      const priceRange = Number(price) - Number(open_24h);
      const pricePercentDiff = (priceRange / Number(open_24h)) * 100;
      const currentSymbol = priceRange >= 0 ? "§a▲" : "§c▼";

      title.setText(`§l${product_id}`);

      lines[0].setText(
        `Price: ${getPriceChangeColor(Number(price), lastPrice)}$${addCommas(
          Number(price)
        )}`
      );
      lines[1].setText(`Open: $${addCommas(Number(open_24h))}`);
      lines[2].setText(`24h Volume: ${addCommas(Number(volume_24h))}`);
      lines[3].setText(`24h Low: $${addCommas(Number(low_24h))}`);
      lines[4].setText(`24h High: $${addCommas(Number(high_24h))}`);
      lines[5].setText(`30d Volume: ${addCommas(Number(volume_30d))}`);
      lines[6].setText(`Time: ${formatTime(time)}`);
      lines[7].setText(
        `Last Size: ${addCommas(Number(last_size))} ($${addCommas(
          Number(last_size) * Number(price)
        )})`
      );
      lines[8].setText(
        `24h Change: ${currentSymbol} ${priceRange >= 0 ? "+" : ""}${addCommas(
          priceRange,
          findDecimalPlaces(Number(price))
        )} (${pricePercentDiff >= 0 ? "+" : ""}${pricePercentDiff.toFixed(4)}%)`
      );

      lastPrice = Number(price);
    }
  },
  new URI("wss://ws-feed.pro.coinbase.com")
);

const setLines = (): void => {
  liveDisplayBackground.clearChildren();

  if (!subscribed && !liveGui.isOpen()) return;

  liveDisplayBackground.addChild(title);

  if (Settings.togglePrice) liveDisplayBackground.addChild(lines[0]);
  if (Settings.toggleOpen) liveDisplayBackground.addChild(lines[1]);
  if (Settings.toggleVolume24h) liveDisplayBackground.addChild(lines[2]);
  if (Settings.toggleLow24h) liveDisplayBackground.addChild(lines[3]);
  if (Settings.toggleHigh24h) liveDisplayBackground.addChild(lines[4]);
  if (Settings.toggleChange24h) liveDisplayBackground.addChild(lines[5]);
  if (Settings.toggleVolume30d) liveDisplayBackground.addChild(lines[6]);
  if (Settings.toggleTime) liveDisplayBackground.addChild(lines[7]);
  if (Settings.toggleLastSize) liveDisplayBackground.addChild(lines[8]);
};

register("step", () => {
  if (liveGui.isOpen()) {
    title.setText("§lExample-USD");

    lines[0].setText(`Price:`);
    lines[1].setText(`Open:`);
    lines[2].setText(`24h Volume:`);
    lines[3].setText(`24h Low:`);
    lines[4].setText(`24h High:`);
    lines[5].setText(`30d Volume:`);
    lines[6].setText(`Time:`);
    lines[7].setText(`Last Size:`);
    lines[8].setText(`24h Change:`);
  }

  if (Settings.startLiveHud) {
    displaySocket.send(
      JSON.stringify({
        type: "subscribe",
        channels: [
          {
            name: "ticker",
            product_ids: [`${entries[Settings.coinIndex][0]}-USD`]
          }
        ]
      })
    );
    Settings.startLiveHud = false;
    subscribed = true;
  }

  setLines();
}).setFps(20);

register("messageSent", (msg) => {
  if (msg.toLowerCase().startsWith("/btc")) {
    displaySocket.send(
      JSON.stringify({
        type: "unsubscribe",
        channels: ["ticker"]
      })
    );
    subscribed = false;
  }
});

register("renderOverlay", () => {
  if (liveDisplayBackground.children.length === 0) return;
  window.draw();
});

register("dragged", (dx, dy) => {
  if (!liveGui.isOpen()) return;

  data.x += dx;
  data.y += dy;

  liveDisplayContainer
    .setX(new PixelConstraint(data.x))
    .setY(new PixelConstraint(data.y));
});

displaySocket.connectBlocking();

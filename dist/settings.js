import {
  @ButtonProperty,
  @SelectorProperty,
  @SwitchProperty,
  @Vigilant
} from "../../Vigilance";
import { liveGui, Range } from "./constants";

@Vigilant("BitcoinGraph")
class Settings {
  @SelectorProperty({
    name: "Crypto Selector",
    description: "Select an option",
    category: "General",
    options: [
      "Bitcoin (BTC)",
      "Ethereum (ETH)",
      "Dogecoin (DOGE)",
      "Tether (USDT)",
      "Cardano (ADA)",
      "Stellar (XLM)",
      "Chainlink (LINK)",
      "Uniswap (UNI)",
      "Bitcoin Cash (BCH)",
      "Litecoin (LTC)",
      "The Graph (GRT)",
      "Filecoin (FIL)",
      "Aave (AAVE)",
      "EOS (EOS)",
      "Algorand (ALGO)",
      "Tezos (XTZ)",
      "Yearn Finance (YFI)",
      "NuCypher (NU)"
    ]
  })
  coinIndex = 0;

  @SelectorProperty({
    name: "Price Range",
    description: "Select a price range",
    category: "General",
    options: Object.keys(Range)
  })
  rangeIndex = Object.keys(Range).length - 1;

  clicked = false;

  @ButtonProperty({
    name: "Request Historical Data",
    description: "Click to request the historical prices",
    category: "General",
    placeholder: "Request"
  })
  toggleClicked() {
    this.clicked = true;
  }

  liveFeed = false;

  @ButtonProperty({
    name: "Start Live Data Feed",
    description: "Click to start receiving live price updates",
    category: "General",
    placeholder: "Request"
  })
  toggleFeedClicked() {
    this.liveFeed = true;
  }

  @SwitchProperty({
    name: "Toggle Live HUD",
    description: "Click to toggle the live HUD",
    category: "Live Display"
  })
  toggleliveHud = false;

  @SwitchProperty({
    name: "Show Price",
    description: "Click to show the price",
    category: "Live Display"
  })
  togglePrice = false;

  @SwitchProperty({
    name: "Show 24h Open",
    description: "Click to show the 24h open price",
    category: "Live Display"
  })
  toggleOpen = false;

  @SwitchProperty({
    name: "Show 24h Volume",
    description: "Click to show the 24h volume",
    category: "Live Display"
  })
  toggleVolume24h = false;

  @SwitchProperty({
    name: "Show 24h Low",
    description: "Click to show the 24h low price",
    category: "Live Display"
  })
  toggleLow24h = false;

  @SwitchProperty({
    name: "Show 24h High",
    description: "Click to show the 24h high price",
    category: "Live Display"
  })
  toggleHigh24h = false;

  @SwitchProperty({
    name: "Show 24h Change",
    description: "Click to show the 24h change",
    category: "Live Display"
  })
  toggleChange24h = false;

  @SwitchProperty({
    name: "Show 30d Volume",
    description: "Click to show the 30d volume",
    category: "Live Display"
  })
  toggleVolume30d = false;

  @SwitchProperty({
    name: "Show Time",
    description: "Click to show the time",
    category: "Live Display"
  })
  toggleTime = false;

  @SwitchProperty({
    name: "Show Last Size",
    description: "Click to show the last trade size",
    category: "Live Display"
  })
  toggleLastSize = false;

  startLiveHud = false;

  @ButtonProperty({
    name: "Start Live HUD",
    description: "Click to start the live HUD",
    category: "Live Display",
    placeholder: "Request"
  })
  toggleLiveHudFunc() {
    if (!this.toggleliveHud) return;
    Client.currentGui.close();
    this.startLiveHud = true;
  }

  @ButtonProperty({
    name: "Move Daily % Change Display",
    description: "Click to move the display",
    category: "Live Display"
  })
  openDraggableGui() {
    if (!this.toggleliveHud) return;
    liveGui.open();
  }

  constructor() {
    this.initialize(this);
    this.setCategoryDescription(
      "General",
      "Note: Some of these cryptocurrencies don't have much historical data on CoinBase Pro."
    );
    this.setCategoryDescription(
      "Live Display",
      "Options for the live display HUD."
    );
  }
}

export default new Settings();

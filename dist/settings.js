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
    name: "Toggle Daily % Change Display",
    description: "Click to toggle the daily info display",
    category: "Live Display",
  })
  toggleDailyDisplay = false;

  sendDisplayRequest = false;

  @ButtonProperty({
    name: "Start Daily % Change Display",
    description: "Click to start daily data display",
    category: "Live Display",
    placeholder: "Request"
  })
  toggleTheDisplay() {
    if (!this.toggleDailyDisplay) return;
    this.sendDisplayRequest = true;
  }

  @ButtonProperty({
    name: "Move Daily % Change Display",
    description: "Click to move the display",
    category: "Live Display"
  })
  openDraggableGui() {
    if (!this.toggleDailyDisplay) return;
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
      "Options for the live display HUD"
    )
  }
}

export default new Settings();

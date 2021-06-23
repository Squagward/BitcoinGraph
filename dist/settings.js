import {
  @ButtonProperty,
  @SelectorProperty,
  @Vigilant
} from "../../Vigilance";
import { Range } from "./utils";

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

  constructor() {
    this.initialize(this);
    this.setCategoryDescription(
      "General",
      "Note: Some of these cryptocurrencies don't have much historical data on CoinBase Pro."
    );
  }
}

export default new Settings();

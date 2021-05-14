import { @Vigilant, @SelectorProperty } from "../../Vigilance";

@Vigilant("Scatterplot")
class Settings {
  @SelectorProperty({
    name: "Commodity Data",
    description: "Select the market from which you would like to view data",
    category: "Appearance",
    options: [
      "CME (Chicago Mercantile Exchange)",
      "ICE (IntercontinentalExchange)",
      "ODA (Open Data for Africa)",
      "JM (Johnson Matthey)",
      "LBMA (London Bullion Markets Association)",
      "LME (London Metals Exchange)",
      "OPEC (Organization of the Petroleum Exporting Countries)",
      "WORLDBANK (World Bank)"
    ]
  })
  index = 0;

  constructor() {
    this.initialize(this);
    this.setCategoryDescription("General", "shows... cool stuff :)");
    this.setSubcategoryDescription("General", "Category", "Shows off some nifty property examples.");
  }
}

export default new Settings();
let Items: IItems = {};

Items["welcome_book"] = {
  name: "Welcome Book",
  type: "book",
  description: "A book that tells you how to start your adventure!",
  inShop: false,
  usable: true,
  image: "https://imgur.com/AOTEV81.png",
  onUse: (character) => {}
}

Items["fishing_rod"] = {
  name: "Fishing Rod",
  type: "util",
  description: "Lets fish!",
  inShop: false,
  usable: true,
  price: 100,
  image: "https://imgur.com/AOTEV81.png",
  onUse: (character) => {
    // Add some experience
  }
}

Items["bluefish"] = {
  name: "Bluefish",
  type: "misc",
  description: "A blue fish!",
  inShop: false,
  usable: false,
  price: 25,
  image: "https://imgur.com/qxsqYA9.png",
  onUse: (character) => {}
}

export default Items;

// effect: {
//   type: "add_item",
//   item: "wooden_sword",
//   amount: 1,
// },
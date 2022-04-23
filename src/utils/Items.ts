let Items: IItems = {};

Items["welcome_book"] = {
  name: "Welcome Book",
  type: "book",
  description: "A book that tells you how to start your adventure!",
  inShop: false,
  usable: true,
  onUse: (character: ICharacter) => {}
}

Items["test"] = {
  name: "testi testi",
  type: "misc",
  description: "testttttttttttttttttt",
  inShop: false,
  usable: true,
  onUse: (character: ICharacter) => {}
}

export default Items;

// effect: {
//   type: "add_item",
//   item: "wooden_sword",
//   amount: 1,
// },
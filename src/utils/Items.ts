let Items: IItems = {};

Items["welcome_book"] = {
  name: "Welcome Book",
  type: "book",
  description: "A book that tells you how to start your adventure!",
  inShop: false,
  usable: true,
  onUse: (character) => {}
}

export default Items;

// effect: {
//   type: "add_item",
//   item: "wooden_sword",
//   amount: 1,
// },
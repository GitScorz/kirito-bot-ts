let Items: IItem = {};

Items["welcome_book"] = {
  name: "Welcome Book",
  type: "book",
  description: "A book that tells you how to start your adventure!",
  price: 0,
  usable: true,
}

export default Items;

// effect: {
//   type: "add_item",
//   item: "wooden_sword",
//   amount: 1,
// },
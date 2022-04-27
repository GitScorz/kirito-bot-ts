const array = [];

export function add(id: string) {
  array.push(id);
}

export function remove(id: string) {
  array.splice(array.indexOf(id), 1);
}

export function is(id: string) {
  return array.includes(id);
}
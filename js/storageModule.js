export function storeData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function retrieveData(key) {
  return JSON.parse(localStorage.getItem(key));
}

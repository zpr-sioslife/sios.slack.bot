const LocalStorage = require('node-localstorage').LocalStorage;
const path = require('path');
const localStorage = new LocalStorage(path.join(process.cwd(), './.db'));

module.exports = {
  SetValue: (storageKey, value) => localStorage.setItem(storageKey, value),
  GetValue: (storageKey) => localStorage.getItem(storageKey)
}
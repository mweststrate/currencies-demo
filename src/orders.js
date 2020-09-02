import { uuidv4 } from "./utils"
import { observable, makeAutoObservable } from "mobx"

export function getInitialCurrencies() {
  return observable({
    eur: 1.12,
    usd: 1.33,
    rup: 97.45,
    aus: 1.75,
    can: 1.75
  })
}

export function createOrderStore(currencies) {
  const store = makeAutoObservable({
    currencies,
    orders: [],
    get orderTotal() {
      return store.orders.reduce((acc, order) => acc + order.priceInPound, 0)
    },
    addOrder(initialData) {
      store.orders.push(createOrder(store, initialData))
    },
    addRandomOrder() {
      createOrder(store, {
        id: uuidv4(),
        title: "Item " + Math.round(Math.random() * 1000),
        price: Math.round(Math.random() * 1000),
        currency: "usd"
      })
    }
  })

  ;[
    {
      id: uuidv4(),
      title: "The LEGO Movie 2: The Second Part",
      price: 8,
      currency: "usd"
    },
    {
      id: uuidv4(),
      title: "Kangaroo, 2yo 🦘",
      price: 750,
      currency: "aus"
    },
    {
      id: uuidv4(),
      title: "Old Amsterdam 🧀",
      price: 12.99,
      currency: "eur"
    },
    {
      id: uuidv4(),
      title: "Old Football boots Virgil van Dijk",
      price: 1200,
      currency: "eur"
    }
  ].forEach(store.addOrder)

  return store
}

export function createOrder(store, initialData) {
  return makeAutoObservable({
    id: initialData.id,
    title: initialData.title,
    price: initialData.price,
    currency: initialData.currency,
    get priceInPound() {
      return this.price * (1 / store.currencies[this.currency])
    },
    setPrice(newPrice) {
      this.price = newPrice
    },
    setCurrency(newCurrency) {
      this.currency = newCurrency
    }
  })
}

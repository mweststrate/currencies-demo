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

function getInitialOrders() {
  return [
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
  ]
}

export function createOrder({ id, title, price, currency }, currencies) {
  return makeAutoObservable({
    id,
    title,
    price,
    currency,
    get priceInPound() {
      return this.price * (1 / currencies[this.currency])
    },
    setPrice(newPrice) {
      this.price = newPrice
    },
    setCurrency(newCurrency) {
      this.currency = newCurrency
    }
  })
}

export function createOrderStore(currencies) {
  const store = makeAutoObservable({
    orders: [],
    get orderTotal() {
      return this.orders.reduce((acc, order) => acc + order.priceInPound, 0)
    },
    addOrder(data) {
      this.orders.push(createOrder(data, currencies))
    },
    addRandomOrder() {
      this.addOrder({
        id: uuidv4(),
        title: "Item " + Math.round(Math.random() * 1000),
        price: Math.round(Math.random() * 1000),
        currency: "usd"
      })
    }
  })

  getInitialOrders().forEach((o) => store.addOrder(o))
  return store
}

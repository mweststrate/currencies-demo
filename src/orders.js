import { uuidv4 } from "./utils"

export function getInitialCurrencies() {
  return {
    eur: 0.85,
    usd: 0.87
  }
}

export function getInitialOrders() {
  return [
    {
      id: uuidv4(),
      title: "coffee",
      price: 11,
      currency: "usd"
    },
    {
      id: uuidv4(),
      title: "tea",
      price: 7,
      currency: "eur"
    }
  ]
}

export function getOrderPrice(order, currencies) {
  return order.price * currencies[order.currency]
}

export function setOrderPrice(order, newPrice) {
  order.price = newPrice
}

export function setOrderCurrency(order, currency) {
  order.currency = currency
}

export function getOrderTotal(orders, currencies) {
  return orders.reduce(
    (acc, order) => acc + getOrderPrice(order, currencies),
    0
  )
}

export function addOrder(orders) {
  orders.push({
    id: uuidv4(),
    title: "Item " + Math.round(Math.random() * 1000),
    price: Math.random() * 100,
    currency: "usd"
  })
}

export function setCurrencyRate(currencies, currency, price) {
  currencies[currency] = price
}

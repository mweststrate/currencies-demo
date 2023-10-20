import { uuidv4 } from "./utils"
import { observable, makeAutoObservable, action, computed } from "mobx"

type Currencies = { [key: string]: number }

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
class Order {
  readonly id: string
  @observable accessor title: string = "";
  @observable accessor price: number = 0;
  @observable accessor currency: string;
  readonly currencies: Currencies;

  constructor(id: string,
    title: string,
    price: number,
    currency: string,
    currencies: Currencies) {
    this.id = id
    this.title = title;
    this.price = price;
    this.currency = currency;
    this.currencies = currencies;
  }

  @computed
  get priceInPound() {
    return this.price * (1 / this.currencies[this.currency])
  }

  @action
  setPrice(newPrice) {
    this.price = newPrice
  }

  @action
  setCurrency(newCurrency) {
    this.currency = newCurrency
  }
}

export function createOrderStore(currencies) {
  const store = makeAutoObservable({
    orders: [],
    get orderTotal() {
      return this.orders.reduce((acc, order) => acc + order.priceInPound, 0)
    },
    addOrder({ id, title, price, currency }) {
      this.orders.push(new Order(
        id,
        title,
        price,
        currency,
        currencies
      ));
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

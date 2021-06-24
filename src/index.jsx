import * as React from "react"
import { useState, createContext, useContext } from "react"
import { observer } from "mobx-react-lite"
// @ts-ignore
import { createRoot } from "react-dom"
import { createOrderStore, getInitialCurrencies } from "./orders"
import { Table, formatPrice, formatCurrency, NumberInput } from "./utils"
import { action } from "mobx"

import "./styles.css"

const CurrencyContext = createContext()

const App = () => {
  const [currencies] = useState(getInitialCurrencies)
  const [store] = useState(() => createOrderStore(currencies))

  return (
    <React.StrictMode>
      <CurrencyContext.Provider value={currencies}>
        <div className="App">
          <h1>Orders</h1>
          <Orders orders={store.orders} />
          <div className="actions">
            <button onClick={store.addRandomOrder}>Add</button>
            <OrderTotal store={store} />
          </div>
          <h1>Exchange rates</h1>
          <Currencies currencies={currencies} />
        </div>
      </CurrencyContext.Provider>
    </React.StrictMode>
  )
}

const Orders = observer(({ orders }) => {
  return (
    <Table columns={["Article", "Price", "Currency", "Price"]}>
      {orders.map((order) => (
        <Orderline key={order.id} order={order} />
      ))}
    </Table>
  )
})

const Orderline = observer(({ order }) => {
  return (
    <tr>
      <td>{order.title}</td>
      <td>
        <NumberInput
          value={order.price}
          onChange={(value) => {
            order.setPrice(value)
          }}
        />
      </td>
      <td>
        <Currency
          value={order.currency}
          onChange={(e) => {
            order.setCurrency(e.target.value)
          }}
        />
      </td>
      <td>{formatPrice(order.priceInPound)} £</td>
    </tr>
  )
})

const OrderTotal = observer(({ store }) => {
  return <div className="total">{formatPrice(store.orderTotal)} £</div>
})

const Currencies = observer(({ currencies, onChangeCurrency }) => {
  return (
    <Table columns={["Currency", "Exchange rate"]}>
      {Object.entries(currencies).map(([currency, rate]) => (
        <tr key={currency}>
          <td>{formatCurrency(currency)}</td>
          <td>
            <NumberInput
              value={rate}
              onChange={action((value) => {
                currencies[currency] = value
              })}
            />
          </td>
        </tr>
      ))}
    </Table>
  )
})

export function Currency({ value, onChange }) {
  const currencies = useContext(CurrencyContext)
  return (
    <select onChange={onChange} value={value}>
      {Object.keys(currencies).map((c) => (
        <option key={c} value={c}>
          {formatCurrency(c)}
        </option>
      ))}
    </select>
  )
}

const rootElement = document.getElementById("app")
createRoot(rootElement).render(<App />)

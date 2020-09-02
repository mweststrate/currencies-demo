import * as React from "react"
import {
  useState,
  useCallback,
  memo,
  useEffect,
  createContext,
  useRef,
  useContext
} from "react"
import { render } from "react-dom"
import {
  getInitialOrders,
  getInitialCurrencies,
  getOrderPrice,
  setOrderPrice,
  getOrderTotal,
  setOrderCurrency,
  setCurrencyRate,
  addOrder
} from "./orders"
import {
  Table,
  useForceUpdate,
  formatPrice,
  useForceUpdateRoot,
  formatCurrency,
  NumberInput
} from "./utils"

import "./styles.css"

const CurrencyContext = createContext()

const App = () => {
  useForceUpdateRoot()
  const update = useForceUpdate()
  const currencies = useRef(getInitialCurrencies()).current
  const orders = useRef(getInitialOrders()).current
  return (
    <CurrencyContext.Provider value={currencies}>
      <div className="App">
        <h1>Orders</h1>
        <button
          onClick={() => {
            addOrder(orders)
            update()
          }}
        >
          🆕
        </button>
        <Orders orders={orders} />
        <OrderTotal orders={orders} />
        <h1>Currencies</h1>
        <Currencies currencies={currencies} />
      </div>
    </CurrencyContext.Provider>
  )
}

const Orders = ({ orders }) => {
  return (
    <Table columns={["Article", "Price", "Currency", "Price £"]}>
      {orders.map((order) => (
        <Orderline key={order.id} order={order} />
      ))}
    </Table>
  )
}

const Orderline = ({ order }) => {
  const update = useForceUpdate()
  const currencies = useContext(CurrencyContext)
  return (
    <tr>
      <td>{order.title}</td>
      <td>
        <NumberInput
          value={order.price}
          onChange={(value) => {
            setOrderPrice(order, value)
            update()
          }}
        />
      </td>
      <td>
        <Currency
          value={order.currency}
          onChange={(e) => {
            setOrderCurrency(order, e.target.value)
            update()
          }}
        />
      </td>
      <td>{formatPrice(getOrderPrice(order, currencies))}</td>
    </tr>
  )
}

const OrderTotal = ({ orders }) => {
  const currencies = useContext(CurrencyContext)
  return <div>Total: £ {formatPrice(getOrderTotal(orders, currencies))}</div>
}

const Currencies = ({ currencies }) => {
  const update = useForceUpdate()

  return (
    <Table columns={["Currency", "Exchange rate"]}>
      {Object.entries(currencies).map(([currency, rate]) => (
        <tr key={currency}>
          <td>{formatCurrency(currency)}</td>
          <td>
            <NumberInput
              value={rate}
              onChange={(value) => {
                setCurrencyRate(currencies, currency, value)
                update()
              }}
            />
          </td>
        </tr>
      ))}
    </Table>
  )
}

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
render(<App />, rootElement)

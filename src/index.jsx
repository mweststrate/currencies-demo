import * as React from "react"
import {
  useState,
  useCallback,
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
  const [currencies, setCurrencies] = useState(getInitialCurrencies)
  const [orders, setOrders] = useState(getInitialOrders)
  return (
    <CurrencyContext.Provider value={currencies}>
      <div className="App">
        <h1>Orders</h1>
        <Orders
          orders={orders}
          onChangePrice={(orderId, newPrice) => {
            setOrders((orders) => setOrderPrice(orders, orderId, newPrice))
          }}
          onChangeCurrency={(orderId, newCurrency) => {
            setOrders((orders) =>
              setOrderCurrency(orders, orderId, newCurrency)
            )
          }}
        />
        <div className="actions">
          <button
            onClick={() => {
              setOrders(addOrder(orders))
            }}
          >
            Add
          </button>
          <OrderTotal orders={orders} />
        </div>
        <h1>Exchange rates</h1>
        <Currencies
          currencies={currencies}
          onChangeCurrency={(currency, newRate) => {
            setCurrencies((currencies) =>
              setCurrencyRate(currencies, currency, newRate)
            )
          }}
        />
      </div>
    </CurrencyContext.Provider>
  )
}

const Orders = ({ orders, onChangePrice, onChangeCurrency }) => {
  return (
    <Table columns={["Article", "Price", "Currency", "Price"]}>
      {orders.map((order) => (
        <Orderline
          key={order.id}
          order={order}
          onChangeCurrency={onChangeCurrency}
          onChangePrice={onChangePrice}
        />
      ))}
    </Table>
  )
}

const Orderline = ({ order, onChangePrice, onChangeCurrency }) => {
  const currencies = useContext(CurrencyContext)
  return (
    <tr>
      <td>{order.title}</td>
      <td>
        <NumberInput
          value={order.price}
          onChange={(value) => {
            onChangePrice(order.id, value)
          }}
        />
      </td>
      <td>
        <Currency
          value={order.currency}
          onChange={(e) => {
            onChangeCurrency(order.id, e.target.value)
          }}
        />
      </td>
      <td>{formatPrice(getOrderPrice(order, currencies))} £</td>
    </tr>
  )
}

const OrderTotal = ({ orders }) => {
  const currencies = useContext(CurrencyContext)
  return (
    <div className="total">
      {formatPrice(getOrderTotal(orders, currencies))} £
    </div>
  )
}

const Currencies = ({ currencies, onChangeCurrency }) => {
  return (
    <Table columns={["Currency", "Exchange rate"]}>
      {Object.entries(currencies).map(([currency, rate]) => (
        <tr key={currency}>
          <td>{formatCurrency(currency)}</td>
          <td>
            <NumberInput
              value={rate}
              onChange={(value) => {
                onChangeCurrency(currency, value)
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

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
import { observer, useLocalObservable } from "mobx-react-lite"
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
  const currencies = useLocalObservable(getInitialCurrencies)
  const orders = useLocalObservable(getInitialOrders)

  const handleAdd = () => {
    addOrder(orders)
  }
  const handleChangePrice = (order, newPrice) => {
    setOrderPrice(order, newPrice)
  }
  const handleChangeCurrency = (order, newCurrency) => {
    setOrderCurrency(order, newCurrency)
  }

  const handleChangeCurrencyRate = (currency, newRate) => {
    setCurrencyRate(currencies, currency, newRate)
  }

  return (
    <CurrencyContext.Provider value={currencies}>
      <div className="App">
        <h1>Orders</h1>
        <Orders
          orders={orders}
          onChangePrice={handleChangePrice}
          onChangeCurrency={handleChangeCurrency}
        />
        <div className="actions">
          <button onClick={handleAdd}>Add</button>
          <OrderTotal orders={orders} />
        </div>
        <h1>Exchange rates</h1>
        <Currencies
          currencies={currencies}
          onChangeCurrency={handleChangeCurrencyRate}
        />
      </div>
    </CurrencyContext.Provider>
  )
}

const Orders = observer(({ orders, onChangePrice, onChangeCurrency }) => {
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
})

const Orderline = observer(({ order, onChangePrice, onChangeCurrency }) => {
  const currencies = useContext(CurrencyContext)
  return (
    <tr>
      <td>{order.title}</td>
      <td>
        <NumberInput
          value={order.price}
          onChange={(value) => {
            onChangePrice(order, value)
          }}
        />
      </td>
      <td>
        <Currency
          value={order.currency}
          onChange={(e) => {
            onChangeCurrency(order, e.target.value)
          }}
        />
      </td>
      <td>{formatPrice(getOrderPrice(order, currencies))} £</td>
    </tr>
  )
})

const OrderTotal = observer(({ orders }) => {
  const currencies = useContext(CurrencyContext)
  return (
    <div className="total">
      {formatPrice(getOrderTotal(orders, currencies))} £
    </div>
  )
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
              onChange={(value) => {
                onChangeCurrency(currency, value)
              }}
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
render(<App />, rootElement)

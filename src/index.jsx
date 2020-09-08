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
  const [currencies, setCurrencies] = useState(getInitialCurrencies)
  const [orders, setOrders] = useState(getInitialOrders)

  const handleAdd = useCallback(() => {
    setOrders((orders) => addOrder(orders))
  }, [])
  const handleChangePrice = useCallback((orderId, newPrice) => {
    setOrders((orders) => setOrderPrice(orders, orderId, newPrice))
  }, [])
  const handleChangeCurrency = useCallback((orderId, newCurrency) => {
    setOrders((orders) => setOrderCurrency(orders, orderId, newCurrency))
  }, [])

  const handleChangeCurrencyRate = useCallback((currency, newRate) => {
    setCurrencies((currencies) =>
      setCurrencyRate(currencies, currency, newRate)
    )
  }, [])

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

const Orders = memo(({ orders, onChangePrice, onChangeCurrency }) => {
  const currencies = useContext(CurrencyContext)
  return (
    <Table columns={["Article", "Price", "Currency", "Price"]}>
      {orders.map((order) => (
        <Orderline
          key={order.id}
          order={order}
          currencies={currencies}
          onChangeCurrency={onChangeCurrency}
          onChangePrice={onChangePrice}
        />
      ))}
    </Table>
  )
})

const Orderline = memo(
  ({ order, onChangePrice, onChangeCurrency, currencies }) => {
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
  },
  (prev, next) =>
    prev.order === next.order &&
    (prev.currencies === next.currencies ||
      prev.currencies[prev.order.currency] ===
        next.currencies[next.order.currency])
)

const OrderTotal = memo(({ orders }) => {
  const currencies = useContext(CurrencyContext)
  return (
    <div className="total">
      {formatPrice(getOrderTotal(orders, currencies))} £
    </div>
  )
})

const Currencies = memo(({ currencies, onChangeCurrency }) => {
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

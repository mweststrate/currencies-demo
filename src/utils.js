import * as React from "react"
import {
  useState,
  useCallback,
  useMemo,
  createContext,
  useContext
} from "react"

export function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

let updater

export function useForceUpdate() {
  return updater
}

export function useForceUpdateRoot() {
  const [count, setCount] = useState(0)
  updater = useCallback(() => setCount((count) => count + 1), [])
}

export function Table({ children, columns }) {
  const columnNames = useMemo(() => {
    return columns.map((column, idx) => <th key={idx}>{column}</th>)
  }, columns)

  return (
    <table>
      <thead>
        <tr>{columnNames}</tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  )
}

export function formatPrice(price) {
  return Number(price).toFixed(2)
}

const flags = {
  eur: "🇪🇺",
  usd: "🇺🇸",
  rup: "🇮🇳",
  aus: "🇦🇺",
  can: "🇨🇦"
}

export function formatCurrency(currency) {
  return flags[currency] || currency
}

export function NumberInput({ value, onChange }) {
  return (
    <input
      value={value}
      type="number"
      step={0.1}
      min={0}
      max={1000}
      onChange={(e) => {
        onChange(e.target.value)
      }}
    />
  )
}

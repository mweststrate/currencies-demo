import * as React from "react"
import { useState, useCallback, memo, useEffect } from "react"
import { DraggableCore } from "react-draggable"
import { render } from "react-dom"
import { getInitialState } from "./circles"
import { uuidv4 } from "./utils"

import "./styles.css"

const App = () => {
  const [state, setState] = useState(() => getInitialState())

  const onHandleDrag = useCallback(({ id, deltaX, deltaY }) => {
    setState(state => {
      const base = state.circles[id]
      return {
        ...state,
        circles: {
          ...state.circles,
          [id]: {
            ...base,
            x: base.x + deltaX,
            y: base.y + deltaY
          }
        }
      }
    })
  }, [])

  const onDoubleClick = useCallback(e => {
    const x = e.clientX - 50;
    const y = e.clientY - 50;
    setState(state => {
      const id = uuidv4()
      const from = Object.keys(state.circles)[
        Object.keys(state.circles).length - 1
      ]
      return {
        ...state,
        circles: {
          ...state.circles,
          [id]: { 
            id, x, y
          }
        },
        lines: {
          ...state.lines,
          [uuidv4()]: { from, to: id }
        }
      }
    })
  }, [])

  useEffect(() => {
    for(let i = 0; i < 10000; i++) {
      onDoubleClick({
        clientX: Math.random() * 1000,
        clientY: Math.random() * 1000
      })
    }
  }, [])

  return (
    <div className="App" onDoubleClick={onDoubleClick}>
      <Lines lines={state.lines} circles={state.circles} />
      <Circles circles={state.circles} onHandleDrag={onHandleDrag} />
    </div>
  )
}

const Lines = memo(function Lines ({ lines, circles }) { return (
  <svg>
    {Object.keys(lines).map(key => (
      <Line key={key} line={lines[key]} circles={circles} />
    ))}
  </svg>
)})

const Line = memo(
  function Line ({ line, circles }) {
    const from = circles[line.from]
    const to = circles[line.to]
    const [x1, y1, x2, y2] = [from.x + 50, from.y + 50, to.x + 50, to.y + 50]
    return <path className="line" d={`M${x1} ${y1} L${x2} ${y2}`} />
  })

const Circles = memo(function Circles({ circles, onHandleDrag, onDragEnd, onDoubleClick }) {
  return (
    <div className="circles" onDoubleClick={onDoubleClick}>
      {Object.keys(circles).map(key => (
        <Circle
          key={key}
          circle={circles[key]}
          onHandleDrag={onHandleDrag}
          onDragEnd={onDragEnd}
        />
      ))}
    </div>
  )
})

const Circle = memo(function Circle({ circle: { x, y, id }, onHandleDrag, onDragEnd }) {
  const handleDrag = useCallback((_, { deltaX, deltaY }) => {
    onHandleDrag({ id, deltaX, deltaY })
  }, [])

  return (
    <DraggableCore onDrag={handleDrag} onStop={onDragEnd}>
      <div className="circle" style={{ left: x, top: y }} />
    </DraggableCore>
  )
})

const rootElement = document.getElementById("app")
render(<App />, rootElement)

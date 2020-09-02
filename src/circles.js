import { uuidv4 } from "./utils"

export function getInitialState() {
  const id1 = uuidv4()
  const id2 = uuidv4()

  return {
    circles: {
      [id1]: {
        id: id1,
        x: 10,
        y: 10
      },
      [id2]: {
        id: id2,
        x: 100,
        y: 100
      }
    },
    lines: {
      [uuidv4()]: {
        from: id1,
        to: id2
      }
    }
  }
}

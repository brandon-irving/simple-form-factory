export const rowArray = (amount = 1) => {
  const rows = []
  for (let i = 1; i <= amount; i++) {
    rows.push(i)
  }
  return rows
}

export const colArray = (cols = {}) => {
  const amount = Object.keys(cols).length
  const newCols = []
  for (let i = 1; i <= amount; i++) {
    newCols.push(cols[i])
  }
  return newCols
}

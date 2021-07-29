import React from 'react'
import { FormFactoryInternal } from './FormFactory'
function mapColGenerator(id, mapConfigCols) {
  return Object.keys(mapConfigCols).reduce((acc, colIndex) => {
    const addId = (text) => `${id}${text}`
    const mapCol = Object.keys(mapConfigCols[colIndex]).reduce((acc, key) => {
      return {
        ...acc,
        [key]:
          key === 'id'
            ? addId(mapConfigCols[colIndex][key])
            : mapConfigCols[colIndex][key]
      }
    }, {})

    return { ...acc, [colIndex]: mapCol }
  }, {})
}
const FormFactoryMapper = ({
  componentList,
  config: {
    topRows,
    mapConfig: { rowIds, cols: mapConfigCols, rowStyle, rowTitle }
  }
}) => {
  return (
    <div>
      {topRows.map((row, i) => {
        const blueprint = {
          rows: 1,
          cols: [row],
          rowStyle
        }
        return (
          <FormFactoryInternal
            key={i}
            rowId='topRow'
            blueprint={blueprint}
            componentList={componentList}
            rowTitle={rowTitle}
          />
        )
      })}
      {rowIds.map((rowId, i) => {
        const blueprint = {
          rowIds: 1,
          cols: [mapColGenerator(rowId, mapConfigCols)],
          rowStyle
        }
        return (
          <FormFactoryInternal
            key={i}
            rowId={rowId}
            blueprint={blueprint}
            componentList={componentList}
            rowTitle={rowTitle}
          />
        )
      })}
    </div>
  )
}

export default FormFactoryMapper

import React from 'react'
import { useFormSetup } from '../context'

const InputLibrary = (coreProps) => {
  const {
    componentList: { Input, Select },
    errors,
    submitCount
  } = useFormSetup()
  const [stateHeldProps, setstateHeldProps] = React.useState(coreProps)

  const noneInputFields = ['hideColumn', 'hideInput']
  const allProps = { ...stateHeldProps, submitcount: submitCount }
  const inputProps = Object.keys(allProps).reduce((acc, propKey) => {
    if (noneInputFields.includes(propKey)) return acc
    return { ...acc, [propKey]: allProps[propKey] }
  }, {})

  inputProps.errors = errors || {}

  const TextInput = Input || ((props) => <input {...props} />)

  React.useEffect(() => {
    setstateHeldProps(coreProps)
  }, [coreProps])
  const SelectInput = Select
    ? (props) => <Select {...props} />
    : (props) => (
        <select {...props}>
          {props.options.map((option, i) => (
            <option key={i}>{option.label}</option>
          ))}
        </select>
      )

  return inputProps.type === 'select' ? (
    <SelectInput {...inputProps} />
  ) : (
    <TextInput {...inputProps} />
  )
}
export function InputHandler(props) {
  const { formValues, setFormValues, inputProps, rowId } = props
  const { id, onChange } = inputProps
  const baseId = id.replace(rowId, '')
  const value = () => {
    let desiredValue = !rowId
      ? formValues[id]
      : formValues[rowId] && formValues[rowId][baseId]
    if (rowId === 'topRow') {
      desiredValue = formValues[Object.keys(formValues)[0]][id]
    }
    return desiredValue
  }

  async function updateForm(updates = {}) {
    const newValues = { ...formValues, ...updates }
    setFormValues(newValues)
  }

  async function handleChange(e) {
    const value =
      e.target.type !== 'checkbox' ? e.target.value : e.target.checked

    const currentFormValues = () => {
      let desiredCurrentFormValues = !rowId
        ? { ...formValues, [id]: value }
        : {
            ...formValues,
            [rowId]: { ...formValues[rowId], [baseId]: value }
          }
      if (rowId === 'topRow') {
        desiredCurrentFormValues = Object.keys(desiredCurrentFormValues).reduce(
          (acc, rowId) => {
            const row = { ...desiredCurrentFormValues[rowId], [id]: value }
            return { ...acc, [rowId]: row }
          },
          {}
        )
      }

      return desiredCurrentFormValues
    }

    setFormValues(currentFormValues())

    onChange &&
      (await onChange({
        id,
        value,
        formValues: currentFormValues(),
        updateForm: (newValues) =>
          updateForm({ ...currentFormValues(), ...newValues }),
        rowId,
        baseId
      }))
  }
  // console.log('log: inputProps', {inputProps})

  return (
    <InputLibrary
      {...props.inputProps}
      baseid={baseId}
      rowid={rowId}
      value={value()}
      onChange={handleChange}
    />
  )
}

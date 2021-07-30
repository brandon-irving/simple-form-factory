/* eslint-disable no-undef */
import React from 'react'
import Select from 'react-select'
import { useFormSetup } from '../context'

const AsyncSelect = (props) => {
  const { loadOptions, onChange, value, updateInputProps, defaultOptions } =
    props
  const selectedOption = defaultOptions.find((option) => option.value === value)

  async function onMenuOpen() {
    const options = await loadOptions(props)
    updateInputProps({ options })
  }

  async function onInputChange(props) {
    const event = { target: { value: props.value } }
    await onChange(event)
  }

  return (
    <Select
      {...props}
      defaultOptions={defaultOptions}
      value={selectedOption}
      onChange={onInputChange}
      cacheOptions
      onMenuOpen={onMenuOpen}
    />
  )
}
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

  const SelectInput = Select
    ? (props) => <Select {...props} />
    : (props) => (
        <select {...props}>
          {props.options.map((option, i) => (
            <option key={i}>{option.label}</option>
          ))}
        </select>
      )
  function updateInputProps(updates = {}) {
    setstateHeldProps({ ...stateHeldProps, ...updates })
  }

  React.useEffect(() => {
    setstateHeldProps(coreProps)
  }, [coreProps])
  if (inputProps.type === 'select') {
    return <SelectInput {...inputProps} updateInputProps={updateInputProps} />
  }
  if (inputProps.type === 'asyncSelect') {
    return <AsyncSelect {...inputProps} updateInputProps={updateInputProps} />
  }
  return <TextInput {...inputProps} updateInputProps={updateInputProps} />
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

  async function handleChange(e, manualValue) {
    let value = ''
    if (manualValue) value = manualValue
    else
      value = e.target.type !== 'checkbox' ? e.target.value : e.target.checked

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

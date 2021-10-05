/* eslint-disable no-undef */
import React from 'react'
import Select from 'react-select'
import { useFormSetup } from '../context'
const style = {
  textAlign: 'left',
  width: '100%',
  marginTop: '0.25rem',
  fontSize: '80%',
  color: '#dc3545'
}
const labelStyle = {
  fontWeight: '700!important',
  display: 'inline-block',
  marginBottom: '.5rem'
}
const ErrorMessage = ({ message }) => {
  return <div style={style}>{message}</div>
}
const AsyncSelect = (props) => {
  const {
    loadOptions,
    onChange,
    value,
    updateInputProps,
    defaultOptions,
    CustomErrorMessage,
    submitcount,
    title = '',
    label = null,
    error = null,
    afterLoadOptions = () => null
  } = props
  const [isLoading, setisLoading] = React.useState(false)
  const [options, setoptions] = React.useState(defaultOptions)
  const selectedOption = defaultOptions.find((option) => option.value === value)

  async function onMenuOpen() {
    setisLoading(true)
    const options = await loadOptions(props)
    updateInputProps({ options })
    setoptions(options)
    setisLoading(false)
  }

  async function onInputChange(props) {
    const event = { target: { value: props.value } }
    await onChange(event)
  }

  React.useEffect(() => {
    afterLoadOptions({ ...props, options })
  }, [isLoading])
  console.log('log: options', { options, defaultOptions })

  return (
    <React.Fragment>
      {label || <label style={labelStyle}>{title}</label>}

      <Select
        {...props}
        placeholder={isLoading ? 'Loading' : 'Select'}
        defaultOptions={options}
        value={selectedOption}
        onChange={onInputChange}
        cacheOptions
        onMenuOpen={onMenuOpen}
      />
      {!!submitcount && !CustomErrorMessage && error && (
        <ErrorMessage message={error} />
      )}
      {!!submitcount && CustomErrorMessage && error && (
        <CustomErrorMessage error={error} />
      )}
    </React.Fragment>
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
    const { errors, rowid, baseid } = inputProps
    return (
      <AsyncSelect
        {...inputProps}
        error={!!errors[rowid] && errors[rowid][baseid]}
        updateInputProps={updateInputProps}
      />
    )
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

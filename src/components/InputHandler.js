import React from 'react'
import { useFormSetup } from '../context'

const InputLibrary = (coreProps) => {
  const noneInputFields = ['hideColumn', 'hideInput']
  const inputProps = Object.keys(coreProps).reduce((acc, propKey) => {
    if (noneInputFields.includes(propKey)) return acc
    return { ...acc, [propKey]: coreProps[propKey] }
  }, {})
  const {
    componentList: { Input, Select },
    errors
  } = useFormSetup()
  inputProps.errors = errors
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
  const inputs = {
    select: <SelectInput {...inputProps} />,
    text: <TextInput {...inputProps} />,
    checkbox: <TextInput {...inputProps} />,
    color: <TextInput {...inputProps} />,
    date: <TextInput {...inputProps} />,
    email: <TextInput {...inputProps} />,
    file: <TextInput {...inputProps} />,
    image: <TextInput {...inputProps} />,
    number: <TextInput {...inputProps} />,
    radio: <TextInput {...inputProps} />,
    reset: <TextInput {...inputProps} />,
    search: <TextInput {...inputProps} />,
    submit: <TextInput {...inputProps} />,
    tel: <TextInput {...inputProps} />,
    time: <TextInput {...inputProps} />,
    url: <TextInput {...inputProps} />,
    week: <TextInput {...inputProps} />
  }

  return inputs[inputProps.type]
}
export function InputHandler(props) {
  const { formValues, setFormValues, inputProps } = props
  const { id, onChange } = inputProps
  const value = formValues[id]

  async function updateForm(updates = {}) {
    const newValues = { ...formValues, ...updates }
    setFormValues(newValues)
  }

  async function handleChange(e) {
    const value = e.target.value
    setFormValues({ ...formValues, [id]: value })
    onChange &&
      (await onChange({
        value,
        updateForm: (newValues) => updateForm({ ...newValues, [id]: value })
      }))
  }

  return (
    <InputLibrary {...props.inputProps} value={value} onChange={handleChange} />
  )
}

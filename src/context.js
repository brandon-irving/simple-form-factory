import * as React from 'react'

const FormSetupContext = React.createContext()

export function FormSetupProvider({
  children,
  componentList,
  sessionKey,
  initialValues,
  fieldMapper,
  validation,
  updateLocalState,
  //
  rowValidationConfig,
  updateLocalErrors,
  submitCount
  //
}) {
  const initialState =
    sessionKey && window.sessionStorage[`${sessionKey}`]
      ? JSON.parse(window.sessionStorage[`${sessionKey}`]) || initialValues
      : initialValues
  const [formValues, setformValues] = React.useState(initialState)
  const [dirty, setDirty] = React.useState(false)
  const [errors, setErrors] = React.useState({})

  function setFormValues(value) {
    sessionKey &&
      window.sessionStorage.setItem(sessionKey, JSON.stringify(value))
    setformValues(value)
  }

  function checkIfDirty() {
    if (fieldMapper) return
    let currentState = false
    Object.keys(formValues).forEach((valueKey) => {
      if (formValues[valueKey] !== initialValues[valueKey]) currentState = true
    })
    if (currentState !== dirty) setDirty(currentState)
    return dirty
  }

  function handleFieldMapperValidation(rows) {
    const errorMap = Object.keys(rows).reduce((acc, rowId) => {
      const values = rows[rowId]
      const errors = Object.keys(values).reduce((acc, key) => {
        const value = values[key]
        const error = rowValidationConfig[key]
          ? rowValidationConfig[key]({ value, values, rowId, rows })
          : null
        return { ...acc, [key]: error }
      }, {})
      return { ...acc, [rowId]: errors }
    }, {})

    return errorMap
  }
  function handleValidation(formValues) {
    const errors = fieldMapper
      ? handleFieldMapperValidation(formValues)
      : validation(formValues)
    setErrors(errors)
    updateLocalErrors(errors)
  }
  React.useEffect(() => {
    checkIfDirty()
    handleValidation(formValues)
    updateLocalState(formValues)
  }, [formValues])

  return (
    <FormSetupContext.Provider
      value={{
        initialValues: initialValues,
        componentList: componentList,
        formValues,
        setFormValues,
        dirty,
        setDirty,
        errors,
        setErrors,
        submitCount
      }}
      children={children}
    />
  )
}

export const useFormSetup = () => React.useContext(FormSetupContext)

import * as React from 'react'

const FormSetupContext = React.createContext()

export function FormSetupProvider(props) {
  const initialState =
    props.sessionKey && window.sessionStorage[`${props.sessionKey}`]
      ? JSON.parse(window.sessionStorage[`${props.sessionKey}`]) ||
        props.initialValues
      : props.initialValues
  const [formValues, setformValues] = React.useState(initialState)
  const [dirty, setDirty] = React.useState(false)
  const [errors, setErrors] = React.useState({})

  function setFormValues(value) {
    props.sessionKey &&
      window.sessionStorage.setItem(props.sessionKey, JSON.stringify(value))
    setformValues(value)
  }

  function checkIfDirty() {
    let currentState = false
    Object.keys(formValues).forEach((valueKey) => {
      if (formValues[valueKey] !== props.initialValues[valueKey])
        currentState = true
    })
    if (currentState !== dirty) setDirty(currentState)
    return dirty
  }

  React.useEffect(() => {
    checkIfDirty()
    setErrors(props.validation(formValues))
  }, [formValues])
  return (
    <FormSetupContext.Provider
      value={{
        initialValues: props.initialValues,
        componentList: props.componentList,
        formValues,
        setFormValues,
        dirty,
        setDirty,
        errors,
        setErrors
      }}
      {...props}
    />
  )
}

export const useFormSetup = () => React.useContext(FormSetupContext)

import * as React from 'react'

const FormSetupContext = React.createContext()

export function FormSetupProvider(props) {
  const [formValues, setFormValues] = React.useState(props.initialValues)
  const [dirty, setDirty] = React.useState(false)
  const [errors, setErrors] = React.useState({})
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

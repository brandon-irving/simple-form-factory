import React from 'react'
import { blueprint } from './blueprint'
import { FormFactory } from 'simple-form-factory'
import 'simple-form-factory/dist/index.css'

const componentList = {
  Input: (props) => {        
  return <>
  <p>title example</p>
  <input {...props} />
  {!!props.errors[props.id] && <div>{props.errors[props.id]}</div>}
  </>
},
  Select: (props) => {
    return <select {...props}></select>
  }
}

const SubmitButton = (props)=>{
  function handleSubmit(e){
    e.preventDefault()
    props.setInitialValues(props.formValues)
    props.setDirty(false)
  }
return <button disabled={!props.dirty} type="submit" onClick={handleSubmit}>Submit</button>
}

const CancelButton = ()=><button>Delete</button>

const App = () => {
  const [initialValues, setInitialValues] = React.useState({
    name: 'Brandon',
    middleName: 'Jamal',
    lastName: 'irving'
  })
  function validation(values){
    const errors = {}
    if(!values.name.length) errors.name = 'Error'
    return errors
  }
  return (
    <FormFactory
      initialValues={initialValues}
      validation={validation}
      componentList={componentList}
      blueprint={blueprint}
      SubmitButton={(props)=>SubmitButton({...props, setInitialValues})}
      CancelButton={CancelButton}
    />
  )
}

export default App

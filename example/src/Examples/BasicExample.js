import React from 'react'
import { blueprint } from './basicBlueprint'
import { FormFactory } from 'simple-form-factory'
import 'simple-form-factory/dist/index.css'

const componentList = {
  Input: (props) => {
    return (
      <>
        <p>{props.id}</p>
        <input {...props} />
        {!!props.errors[props.id] && <div>{props.errors[props.id]}</div>}
      </>
    )
  },
  Select: (props) => {
    return <select {...props}>{
      props.options.map(({value, label}, i)=><option value={value} key={i}>{label}</option>)
    }
    </select>
  }
}

const BasicExample = () => {
  const [initialValues, setInitialValues] = React.useState({
    name: 'Brandon',
    middleName: 'Jamal',
    lastName: 'irving'
  })
  function validation(values) {
    const errors = {}
    if (!values.name.length) errors.name = 'Error'
    return errors
  }
  const CancelButton = () => <button>Delete</button>
  const SubmitButton = (props) => {
    function handleSubmit(e) {
      e.preventDefault()
      props.setInitialValues(props.formValues)
      props.setDirty(false)
    }
    return (
      <button disabled={!props.dirty} type='submit' onClick={handleSubmit}>
        Submit
      </button>
    )
  }

  return (
    <FormFactory
      sessionKey='example'
      initialValues={initialValues}
      validation={validation}
      componentList={componentList}
      blueprint={{ ...blueprint, rowStyle: { margin: '20px' } }}
      SubmitButton={(props) => SubmitButton({ ...props, setInitialValues })}
      CancelButton={CancelButton}
    />
  )
}
export default BasicExample
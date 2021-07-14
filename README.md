# simple-form-factory

> Create forms using whatever form components you want

[![NPM](https://img.shields.io/npm/v/simple-form-factory.svg)](https://www.npmjs.com/package/simple-form-factory) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save simple-form-factory
```

## Usage

```bash
import { FormFactory } from 'simple-form-factory'

    <FormFactory
      sessionKey='example'
      initialValues={initialValues}
      validation={validation}
      componentList={componentList}
      blueprint={blueprint}
      SubmitButton={(props)=>SubmitButton({...props, setInitialValues})}
      CancelButton={CancelButton}
    />
```

## Props
```jsx
sessionKey?: string // caches the state object in session memory
initialValues?: object // The initial form values, for the factory to manage
validation?: () => ErrorObject 
componentList?: ComponentsObject 
blueprint: BluePrintObject // 
SubmitButton?: (props)=>React.Component
CancelButton?: (props)=>React.Component

Object Definitions
inputObject = {...HTML.InputProps, hideColumn: (props)=>boolean, hideInput: (props)=>boolean } // id && type are required
ErrorObject = {[field]: 'Error', [field2]: undefined} // field: 'error message'
ComponentsObject =  { Input: (props)=>React.Component, Select: (props)=>React.Component} // props has all the input props, errors and value
BluePrintObject = { rows: int, cols: [{ 1. inputObject }]}
```
## Useful Examples
```jsx
// 3 rows, 1st row : 3 cols, 2nd row : 1 cols, 3rd row : 4 cols, 
const blueprint = { rows: 3, cols: [
{ 1: {...inputProps}, 2: {...inputProps}, 3: {...inputProps} },
{ 1: {...inputProps} },
{ 1: {...inputProps}, 2: {...inputProps}, 3: {...inputProps}, 4: {...inputProps} },
]}

```
## Advanced Full Example
```jsx
import React from 'react'
import { blueprint } from './blueprint'
import { FormFactory } from 'simple-form-factory'

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

const Example = () => {
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


```

## License

MIT © [brandon-irving](https://github.com/brandon-irving)

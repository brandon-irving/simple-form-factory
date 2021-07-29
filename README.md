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
blueprint: BluePrintObject
SubmitButton?: (props)=>React.Component
CancelButton?: (props)=>React.Component
fieldMapper?: bool // enables field mapper mode
fieldMapperConfig?: FieldMapperObj // required for field mapper mode
updateLocalState?: (props)=>props // Call back function that returns current form values
updateLocalErrors?: (props)=>props // Call back function that returns current form errors
submitCount?: int // you can track your own submitCount, accessible in your componentsList 

Object Definitions
inputObject = {...HTML.InputProps, hideColumn: (props)=>boolean, hideInput: (props)=>boolean } // id && type are required
col = { 1: inputObject, 2: inputObject, ...rest }
ErrorObject = {[field]: 'Error', [field2]: undefined} // field: 'error message'
ComponentsObject =  { Input: (props)=>React.Component, Select: (props)=>React.Component} // props has all the input props, errors and value
BluePrintObject = { rows: int, cols: col[]}

FieldMapperObj = { 
  topRows: col[], 
  mapConfig: {
    rowIds: string[],
    rowStyle?: JSX.StyleObject,
    rowTitle?: ({ rowid }) => React.Component | any, cols: col
}}
```
## Useful Examples
```jsx
// 3 rows, 1st row : 3 cols, 2nd row : 1 cols, 3rd row : 4 cols, 
const basicBlueprint = { rows: 3, cols: [
{ 1: {...inputProps}, 2: {...inputProps}, 3: {...inputProps} },
{ 1: {...inputProps} },
{ 1: {...inputProps}, 2: {...inputProps}, 3: {...inputProps}, 4: {...inputProps} },
]}

// 2 top level inputs, 3 field mapped rows, 3 columns in each row
const fieldMapperBlueprint = {
  topRows: [{ 1: {...inputProps}, 2: {...inputProps}],
  mapConfig: {
    rowIds: ['Example', 'Example 2', 'Example 3'],
    rowStyle: { alignItems: 'center' },
    rowTitle: ({ rowid }) => rowid !== 'topRow' && <h4>{rowid}</h4>,
    cols: { 
      1: { id: 'firstName', type: 'text', title: 'First Name', onChange: (props)=>null },
      2: { id: 'middleName', type: 'text', title: 'Middle Name', onChange: (props)=>null },
      3: { id: 'lastName', type: 'text', title: 'Last Name', onChange: (props)=>null },
      }
  }
}


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

## Advanced Field Mapper Example
```jsx
import React from 'react'
import { FormFactory } from 'simple-form-factory'

const fieldMapperBlueprint = {
  topRows: [{ 1: { id: 'selectAll', type: 'checkbox', title: 'Select All' }}],
  mapConfig: {
    rowIds: ['Example', 'Example 2', 'Example 3'],
    rowStyle: { alignItems: 'center' },
    rowTitle: ({ rowid }) => rowid !== 'topRow' && <h4>{rowid}</h4>,
    cols: { 
      1: { id: 'firstName', type: 'text', title: 'First Name', onChange: (props)=>null },
      2: { id: 'middleName', type: 'text', title: 'Middle Name', onChange: (props)=>null,
      3: { id: 'lastName', type: 'text', title: 'Last Name', onChange: (props)=>null },
      }
  }
}

const componentList = {
  Input: ({
    id,
    errors,
    rowid,
    value,
    type,
    title,
    onChange,
    baseid,
    submitcount
  }) => {
    const rowErrors =
      (submitcount && !!errors[rowid] && errors[rowid][baseid]) || ''

    return (
      <>
        <p>{title}</p>
        {type === 'checkbox' ? (
          <input
            checked={value}
            id={id}
            type={type}
            value={value}
            onChange={onChange}
          />
        ) : (
          <input id={id} type={type} value={value} onChange={onChange} />
        )}

        {!!rowErrors.length && <div>{rowErrors}</div>}
      </>
    )
  },
  Select: ({
    id,
    errors,
    rowid,
    value,
    type,
    title,
    onChange,
    baseid,
    options,
    submitcount
  }) => {
    const rowErrors =
      (submitcount && !!errors[rowid] && errors[rowid][baseid]) || ''
    return (
      <>
        <h3>{title}</h3>
        <select id={id} type={type} value={value} onChange={onChange}>
          {options.map(({ value, label }, i) => (
            <option value={value} key={i}>
              {label}
            </option>
          ))}
        </select>
        {!!rowErrors.length && <div>{rowErrors}</div>}
      </>
    )
  }
}

export const initialFielValuedMapper = (defaultName) => ({
  selectAll: true,
  firstName: defaultName,
  middleName: '',
  lastName: ''
})

const ExampleMapper = () => {
    const [exampleFields, setexampleFields] = React.useState({})
    const [errors, seterrors] = React.useState({})
    const [submitCount, setsubmitCount] = React.useState(0)
    const hasErrors = () =>{
      let isErrors = false
      Object.keys(errors).forEach(row=>{
        const rowErrors = errors[row]
        Object.keys(rowErrors).forEach(field=>{
          if(rowErrors[field]) isErrors = true
        })
      })
      return isErrors
    }
  
    const rowValidationConfig = {
      firstName: (props)=>{
        let error = null
        if(props.value.length < 3){
          error= 'Enter more'
        }
        return error
      },
    }
  
    function handleSubmit() {
      console.log('log: handleSubmit', {hasErrors: hasErrors(), errors, submitCount, exampleFields})
      setsubmitCount(prevCount => prevCount+=1)
    }
  
    const initialValues = {
      'Example': initialFielValuedMapper('Brandon'),
      'Example 2': initialFielValuedMapper('Levi'),
      'Example 3': initialFielValuedMapper('Tyler'),
    }
  
    return (
      <React.Fragment>
      <FormFactory
        rowValidationConfig={rowValidationConfig}
        fieldMapper
        fieldMapperConfig={config}
        componentList={mapComponentList}
        updateLocalState={setexampleFields}
        updateLocalErrors={seterrors}
        submitCount={submitCount}
        initialValues={initialValues}
      />
      <button onClick={handleSubmit}>Submit</button>
      </React.Fragment>
    )
  }

```
## License

MIT © [brandon-irving](https://github.com/brandon-irving)

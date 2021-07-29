import React from 'react'
import { config, initialFielValuedMapper, mapComponentList } from './config'
import { FormFactory } from 'simple-form-factory'
import 'simple-form-factory/dist/index.css'


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
          error= 'enter mo letters fam'
        }
        return error
      },
    }
  
    function handleSubmit(){
      console.log('log: handleSubmit', {hasErrors: hasErrors(), errors, submitCount, exampleFields})
      setsubmitCount(prevCount => prevCount+=1)
    }
  
    const initialValues = {
      'Brandon': initialFielValuedMapper('Brandon'),
      'Levi': initialFielValuedMapper('Levi'),
      'Tyler': initialFielValuedMapper('Tyler'),
      'Kerry': initialFielValuedMapper('Kerry'),
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
  export default ExampleMapper
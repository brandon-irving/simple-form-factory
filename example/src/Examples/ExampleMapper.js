import React from 'react'
import { initialFielValuedMapper, mapComponentList } from './config'
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


    function onChange(props) {
      const { formValues, rowId, updateForm, baseId } = props
      const updatedFormValues = { ...formValues }
      const updateByRowId = (rowid, updates = {}) => {
        const updatedRow = { ...formValues[rowid], ...updates }
        return updatedRow
      }
      console.log('log: props', {
        rowId, baseId,
        props, condition: rowId === 'Brandon' && baseId === "pokemon"
      })

      if (rowId === 'Brandon' && baseId === "pokemon") {
        updatedFormValues['Levi'] = updateByRowId('Levi', {
          firstName: 'squirtle'
        })
      }
      
      updateForm(updatedFormValues)
    }
    const config = {
      topRows: [
        {
          1: {
            id: 'numberField',
            type: 'number',
            title: 'Number Field'
          },
          2: { id: 'loveFood', type: 'checkbox', title: 'Love Food?' }
        }
      ],
      mapConfig: {
        rowIds: ['Brandon', 'Levi', 'Tyler', 'Kerry'],
        rowStyle: { alignItems: 'center' },
        rowTitle: ({ rowid }) => rowid !== 'topRow' && <h4>{rowid}</h4>,
        cols: {
          1: {
            id: 'pokemon',
            type: 'asyncSelect',
            title: 'pokemon',
            defaultOptions: [{ label: 'None', value: null }],
            loadOptions,
            onChange
          },
          2: {
            veryMuch: true,
            id: 'firstName',
            type: 'text',
            title: 'First Name',
            onChange
          },
          3: { id: 'middleName', type: 'text', title: 'Middle Name', onChange },
          4: { id: 'lastName', type: 'text', title: 'Last Name', onChange }
        }
      }
    }
    async function loadOptions(){
        const data = await fetch('https://pokeapi.co/api/v2/pokemon')
        const {results} = await data.json()
        const pokemonOptions = results.map(res=>({value: res.name, label: res.name}))
        return pokemonOptions
    
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
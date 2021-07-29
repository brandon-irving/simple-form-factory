import React from 'react'

export const mapComponentList = {
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
  numberField: 50,
  loveFood: true,
  sex: defaultName === 'Kerry' ? 'Female' : 'Male',
  firstName: defaultName,
  middleName: '',
  lastName: ''
})

function onChange({ formValues, id, rowid, updateForm, value }) {
  const updatedFormValues = { ...formValues }
  const updateByRowId = (rowid, updates = {}) => {
    const updatedRow = { ...formValues[rowid], ...updates }
    return updatedRow
  }

  if (rowid === 'Brandon' && value === formValues['Levi'].firstName) {
    updatedFormValues['Levi'] = updateByRowId('Levi', {
      firstName: 'Dont Copy Me!'
    })
  }
  updateForm(updatedFormValues)
}

export const config = {
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
        id: 'sex',
        type: 'select',
        title: 'Sex',
        options: [
          { label: 'NA', value: null },
          { label: 'Male', value: 'Male' },
          { label: 'Female', value: 'Female' }
        ]
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

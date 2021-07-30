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
  pokemon: '',
  firstName: defaultName,
  middleName: '',
  lastName: ''
})



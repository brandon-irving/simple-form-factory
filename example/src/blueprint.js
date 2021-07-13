const inputProps = (id) => ({
    // ...inputProps (id, name, type, onChange, onBlur, onFocus)
    id,
    type: 'text',
    onChange: ({ value, updateForm }) => {
      if (id === 'name' && !value.length) {
        updateForm({ lastName: 'Error', middleName: 'Error' })
      }
    },
    size: { lg: 3 },
    onBlur: (props) => console.log('log: onBlur', props),
    hideColumn: (props) => false,
    hideInput: (props) => false
  })
  
 export const blueprint = {
    rows: 2,
    cols: [
      { 1: inputProps('name'), 2: inputProps('middleName') }, // Row 1
      { 1: inputProps('lastName') } // Row 2
    ],
    inputProps
  }
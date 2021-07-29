import React from 'react'
import ExampleMapper from './Examples/ExampleMapper'
import BasicExample from './Examples/BasicExample'
const App = () => {
  const titleStyle = { textAlign: 'center' }
  const sectionStyle = { margin: '15px', padding: '15px', border: '1px solid' }
  return (
    <React.Fragment>
      <div style={sectionStyle}>
        <h2 style={titleStyle}>Basic Example</h2>
        <BasicExample />
      </div>
      <div style={sectionStyle}>
      <h2 style={titleStyle}>Field Mapper Example</h2>
        <ExampleMapper />
      </div>
    </React.Fragment>
  )
}

export default App

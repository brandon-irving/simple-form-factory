import React from 'react'
import { FormSetupProvider, useFormSetup } from '../context'
import { colArray, rowArray } from './helpers'
import { Container, Row, Col } from 'react-grid-system'
import { InputHandler } from './InputHandler'

function ColGenerator(props) {
  const { cols, rowIndex } = props
  const { formValues, setFormValues } = useFormSetup()
  return colArray(cols[rowIndex]).map((inputProps, index) => {
    const { size = {} } = cols[rowIndex]
    if (
      inputProps.hideColumn &&
      inputProps.hideColumn({
        ...inputProps,
        formValues
      })
    )
      return null
    if (
      inputProps.hideInput &&
      inputProps.hideInput({
        ...inputProps,
        formValues
      })
    )
      return <Col> {null} </Col>
    return (
      <Col {...size} key={index}>
        <InputHandler
          formValues={formValues}
          setFormValues={setFormValues}
          inputProps={inputProps}
        />
      </Col>
    )
  })
}

function RowGenerator(props) {
  const { rows, cols, rowStyle } = props
  console.log('log: row style', rowStyle )
  return (
    <React.Fragment>
      {rowArray(rows).map((_, index) => {
        return (
          <Row
            key={index}
            style={rowStyle}
          >
            <ColGenerator cols={cols} rowIndex={index} />
          </Row>
        )
      })}
    </React.Fragment>
  )
}

const FormFactoryInternal = ({
  blueprint,
  onSubmit,
  onCancel,
  SubmitButton,
  CancelButton
}) => {
  const [submitCount, setSubmitCount] = React.useState(0)
  const { formValues, dirty, setDirty } = useFormSetup()
  const { rows, cols, rowStyle={} } = blueprint

  const buttonContainerStle = {
    margin: '20px',
    paddingLeft: '15px',
    paddingRight: '15px',
    justifyContent: 'flex-end'
  }
  const submitButtonProps = {
    style: {
      marginRight: '10px'
    },
    onClick: handleSubmit,
    disabled: !dirty
  }
  const cancelButtonProps = {
    onClick: handleCancel,
    disabled: !dirty
  }

  const buttonProps = {
    ...useFormSetup(),
    submitCount,
    setSubmitCount
  }

  async function handleSubmit() {
    onSubmit && (await onSubmit(formValues))
    setSubmitCount(submitCount + 1)
    setDirty(false)
  }

  function handleCancel() {
    onCancel &&
      onCancel({
        ...useFormSetup()
      })
  }
  return (
    <Container>
      <RowGenerator rows={rows} cols={cols} rowStyle={rowStyle} />
      <Row style={buttonContainerStle}>
        {SubmitButton ? (
          <SubmitButton {...buttonProps} />
        ) : (
          <button {...submitButtonProps}> Submit </button>
        )}
        {CancelButton ? (
          <CancelButton {...buttonProps} />
        ) : (
          <button {...cancelButtonProps}> Cancel </button>
        )}
      </Row>
    </Container>
  )
}

const FormFactory = ({
  componentList = {},
  blueprint,
  initialValues = {},
  SubmitButton,
  CancelButton,
  validation = () => {},
  sessionKey = null
}) => {
  return (
    <FormSetupProvider
      sessionKey={sessionKey}
      componentList={componentList}
      initialValues={initialValues}
      validation={validation}
    >
      <FormFactoryInternal
        CancelButton={CancelButton}
        SubmitButton={SubmitButton}
        blueprint={blueprint}
      />
    </FormSetupProvider>
  )
}

export default FormFactory

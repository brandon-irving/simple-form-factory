import React from 'react'
import { FormSetupProvider, useFormSetup } from '../context'
import { colArray, rowArray } from './helpers'
import { Container, Row, Col } from 'react-grid-system'
import { InputHandler } from './InputHandler'
import FormFactoryMapper from './FormFactoryMapper'

function ColGenerator(props) {
  const { cols, rowIndex, rowId } = props
  const { formValues, setFormValues } = useFormSetup()

  return colArray(cols[rowIndex]).map((inputProps, index) => {
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
      return <Col key={index}> {null} </Col>
    return (
      <Col {...inputProps.size} key={index}>
        <InputHandler
          formValues={formValues}
          setFormValues={setFormValues}
          inputProps={inputProps}
          rowId={rowId}
        />
      </Col>
    )
  })
}

function RowGenerator(props) {
  const { rows, cols, rowStyle, rowId, rowTitle } = props
  return (
    <React.Fragment>
      {rowArray(rows).map((_, index) => {
        const titleStyle = { width: '7vw', textOverflow: 'ellipsis' }
        return (
          <Row key={index} style={rowStyle}>
            {!!rowTitle && <div style={titleStyle}>{rowTitle(props)}</div>}
            <ColGenerator cols={cols} rowId={rowId} rowIndex={index} />
          </Row>
        )
      })}
    </React.Fragment>
  )
}

export const FormFactoryInternal = ({
  blueprint,
  onSubmit,
  onCancel,
  SubmitButton,
  CancelButton,
  rowId,
  rowTitle
}) => {
  const [submitCount, setSubmitCount] = React.useState(0)
  const { formValues, dirty, setDirty } = useFormSetup()
  const { rows, cols, rowStyle = {}, buttonContainerStyle = {} } = blueprint

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
      <RowGenerator
        rowTitle={rowTitle}
        rowId={rowId}
        rows={rows}
        cols={cols}
        rowStyle={rowStyle}
      />
      {!rowId && (
        <Row style={buttonContainerStyle}>
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
      )}
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
  sessionKey = null,
  updateLocalState = () => {},
  fieldMapper,
  fieldMapperConfig = {},
  rowValidationConfig = {},
  updateLocalErrors = () => {},
  submitCount
}) => {
  return (
    <FormSetupProvider
      //
      submitCount={submitCount}
      updateLocalErrors={updateLocalErrors}
      rowValidationConfig={rowValidationConfig}
      //
      fieldMapper={fieldMapper}
      sessionKey={sessionKey}
      componentList={componentList}
      initialValues={initialValues}
      validation={validation}
      updateLocalState={updateLocalState}
    >
      {!fieldMapper ? (
        <FormFactoryInternal
          CancelButton={CancelButton}
          SubmitButton={SubmitButton}
          blueprint={blueprint}
        />
      ) : (
        <FormFactoryMapper
          componentList={componentList}
          config={fieldMapperConfig}
        />
      )}
    </FormSetupProvider>
  )
}

export default FormFactory

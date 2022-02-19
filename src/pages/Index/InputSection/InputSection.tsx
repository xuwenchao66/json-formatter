import React, { useState } from 'react'
import styled from 'styled-components'
import { Input } from 'antd'
import { useDebounceFn } from 'ahooks'
import { Wrapper } from './style'
import { parse, Key } from './parse'
import { parseJson } from '../../../utils'

const { TextArea } = Input
const StyledTextArea = styled(TextArea)`
  resize: none;
  &.ant-input {
    height: 100%;
  }
`

export type InputSectionProps = {
  onChange: (error: any, data: any[], keys: Key[]) => void
}

const InputSection: React.FC<InputSectionProps> = ({ onChange }) => {
  const [json, setValue] = useState('')

  const handleParse = (value: string) => {
    const [data, keys] = parse(parseJson(value))
    onChange(null, data, keys)
  }

  const { run: debounceHandleParse } = useDebounceFn(handleParse, { wait: 200 })

  const handelClear = (error: any, value: string) => {
    setValue(value)
    onChange(error, [], [])
  }

  const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    const { value } = e.target
    if (!value) return handelClear(null, value)

    try {
      setValue(JSON.stringify(parseJson(value), null, 2))
      debounceHandleParse(value)
    } catch (error: any) {
      handelClear(error, value)
    }
  }

  return (
    <Wrapper>
      <StyledTextArea
        value={json}
        placeholder="please input your JSON..."
        onChange={handleChange}
      />
    </Wrapper>
  )
}

export default InputSection

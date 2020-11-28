import React, { useState, useEffect } from 'react'
import { monaco, ControlledEditor } from '@monaco-editor/react'
import theme from './themes/Oceanic Next.json'
import ButtonAppBar from './components/NavBar'
import { js as beautify } from 'js-beautify'
import { makeStyles } from '@material-ui/core/styles'
import axios from 'axios'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  terminal: {
    width: '40vw',
    backgroundColor: 'black',
    color: 'white',
    height: 'calc(90vh - 40px)',
    fontSize: 13,
    whiteSpace: 'pre-wrap',
    padding: 20,
    fontFamily: 'Fira Code'
  }
}))

function App() {
  const classes = useStyles()
  const [code, setCode] = useState('')
  const [output, setOutput] = useState('')

  useEffect(() => {
    monaco
      .init()
      .then(monaco => {
        monaco.editor.defineTheme('theme', theme)
        monaco.editor.getModel().updateOptions({ tabSize: 4 })
      })
      .catch(console.error)

    axios
      .get('/code')
      .then(({ data }) => {
        setOutput(data)
      })
      .catch(console.error)
  }, [])

  const handleChange = (_, value) => {
    setCode(value)
    return value
  }

  const handleBeautifyCode = () => {
    const formatted = beautify(code, {
      indent_size: 2,
      space_in_empty_paren: true,
      brace_style: 'collapse,preserve-inline'
    })
    setCode(formatted)
  }

  return (
    <>
      <ButtonAppBar onBeautiyCode={handleBeautifyCode} />
      <div className={classes.root}>
        <ControlledEditor
          height='90vh'
          width='60vw'
          language='javascript'
          theme='theme'
          value={code}
          onChange={handleChange}
        />
        <div className={classes.terminal}>{output}</div>
      </div>
    </>
  )
}

export default App

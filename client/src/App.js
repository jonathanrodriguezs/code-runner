import React, { useState, useEffect } from 'react'
import { monaco, ControlledEditor } from '@monaco-editor/react'
import theme from './themes/Oceanic Next.json'
import ButtonAppBar from './components/NavBar'
import { js as beautify } from 'js-beautify'
import { makeStyles } from '@material-ui/core/styles'
import axios from 'axios'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import 'xterm/css/xterm.css'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  terminal: {
    width: '40vw',
    backgroundColor: 'black',
    color: 'white',
    height: '100vh',
    padding: 20
  },
  '.terminal > *': {
    whiteSpace: 'pre-wrap'
  }
}))

function App() {
  const classes = useStyles()
  const [code, setCode] = useState('')
  const [output, setOutput] = useState('')
  const [terminal, setTerminal] = useState(
    new Terminal({
      cursorBlink: true,
      fontFamily: 'Fira Code',
      fontSize: 13.5
      // tabStopWidth: 2
    })
  )

  function initializeTerminal() {
    const fitAddon = new FitAddon()
    terminal.loadAddon(fitAddon)
    terminal.open(document.getElementById('terminal'))
    fitAddon.fit()
    terminal.write('Running on Node.js \x1B[1;3;31m15.3.0-alpine\x1B[0m\r\n')
    setTerminal(terminal)
  }

  useEffect(() => {
    monaco
      .init()
      .then(monaco => {
        monaco.editor.defineTheme('theme', theme)
        initializeTerminal()
      })
      .catch(error => {
        console.error('[Error intializing Monaco Editor]: ' + error)
      })
  }, [])

  useEffect(() => {
    if (output) {
      terminal.writeln(output)
    }
  }, [output])

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

  const handleExecute = event => {
    event.preventDefault()
    terminal.clear()
    setOutput('$ node index.js')
    axios
      .post('/code', { code })
      .then(({ data }) => {
        setOutput(data)
      })
      .catch(error => {
        console.log('[Error executing code]: ' + error)
      })
  }

  return (
    <>
      <ButtonAppBar onBeautiyCode={handleBeautifyCode} onExecute={handleExecute} />
      <div className={classes.root}>
        <ControlledEditor
          height='100vh'
          width='60vw'
          theme='theme'
          value={code}
          language='javascript'
          onChange={handleChange}
        />
        <div className={classes.terminal}>
          <div id='terminal'></div>
        </div>
      </div>
    </>
  )
}

export default App

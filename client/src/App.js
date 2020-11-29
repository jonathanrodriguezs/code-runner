/* eslint-disable react-hooks/exhaustive-deps */
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
    height: '90vh',
    padding: '10px 20px'
  }
}))

function App() {
  const classes = useStyles()
  const [code, setCode] = useState('')
  const [output, setOutput] = useState('')
  // eslint-disable-next-line
  const [_, setHistory] = useState('')
  const [terminal, setTerminal] = useState(
    new Terminal({
      cursorBlink: true,
      fontFamily: `'Fira Code', monospace`,
      fontSize: 14,
      theme: {
        background: 'black'
      }
    })
  )

  useEffect(() => {
    function initializeTerminal() {
      const fitAddon = new FitAddon()
      terminal.loadAddon(fitAddon)
      terminal.open(document.getElementById('terminal'))
      fitAddon.fit()
      terminal.write('Running Node.js \x1B[1;3;31m15.3.0 on alpine (linux based)\x1B[0m\r\n')
      setTerminal(terminal)
    }

    monaco
      .init()
      .then(monaco => {
        monaco.editor.defineTheme('theme', theme)
        initializeTerminal()
        axios
          .get('/code')
          .then(({ data }) => {
            setCode(data)
          })
          .catch(error => {
            console.error('[Error retrieving source code] ' + error)
          })
      })
      .catch(error => {
        console.error('[Error initializing Monaco Editor]: ' + error)
      })
  }, [])

  useEffect(() => {
    if (output) {
      terminal.writeln(output.toString())
      setHistory(history => history + '\r\n' + output)
    }
  }, [output])

  const handleChange = (_, value) => {
    setCode(value)
    return value
  }

  const handleBeautifyCode = event => {
    event.preventDefault()
    const formatted = beautify(code, {
      indent_size: 4,
      space_in_empty_paren: true,
      brace_style: 'collapse,preserve-inline'
    })
    setCode(formatted)
    setOutput('$ js-beautify index.js\r\n> The code has been succesfully formated')
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
          height='90vh'
          width='60vw'
          theme='theme'
          value={code}
          language='javascript'
          onChange={handleChange}
        />
        <div className={classes.terminal}>
          <div id='terminal' style={{ height: '90vh' }}></div>
        </div>
      </div>
    </>
  )
}

export default App

import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  appBar: {
    backgroundColor: '#173F5F'
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1,
    fontSize: 16
  },
  secondary: {
    color: 'whitesmoke'
  }
}))

function ButtonAppBar({ onBeautiyCode, onExecute }) {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <AppBar position='static' className={classes.appBar}>
        <Toolbar classes={classes.toolbar}>
          <IconButton
            edge='start'
            className={classes.menuButton}
            color='inherit'
            aria-label='menu'>
            <MenuIcon />
          </IconButton>
          <Typography variant='h6' className={classes.title}>
            {/* <span>Code Buster</span> */}
            <i
              className='devicon-nodejs-plain'
              style={{ marginRight: '7px', color: 'whitesmoke' }}
            />
            <span style={{ color: 'whitesmoke' }}>Node.js v15.3.0</span>
          </Typography>
          <Button onClick={onBeautiyCode} className={classes.secondary}>
            Prettify
          </Button>
          <Button onClick={onExecute} color='inherit'>
            Execute
            <PlayArrowIcon />
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default ButtonAppBar

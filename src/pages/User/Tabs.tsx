import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { Link, useLocation } from 'react-router-dom'
import getCachedMode from '../../utils/getCachedMode'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
  },
}))

interface TabObject {
  label: string
  to: () => string
  match: RegExp
  tab: string
}

const tabs: TabObject[] = [
  {
    label: 'Профиль',
    to: () => `/${getCachedMode()}/p/1`,
    match: /\/(all|top\/day|top\/week|top\/month)\/p\/([0-9]+)\/?$/,
    tab: 'profile',
  },
  {
    label: 'Публикации',
    to: () => '/news/p/1',
    tab: 'news',
    match: /\/news\/p\/([0-9]+)\/?$/,
  },
  {
    label: 'Комментарии',
    to: () => '/hubs/p/1',
    match: /\/hubs\/p\/([0-9]+)\/?$/,
    tab: 'hubs',
  },
  {
    label: 'Закладки',
    to: () => '/hubs/p/1',
    match: /\/hubs\/p\/([0-9]+)\/?$/,
    tab: 'hubs',
  },
]

/*const findPath = (path: string): TabObject => {
  return tabs.find((e) => path.match(e.match))
}*/
const findPathValue = (path: string): number => {
  const res = tabs.findIndex((e) => path.match(e.match))
  return res < 0 ? 0 : res
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function LinkTab(props: any) {
  return <Tab component={Link} {...props} />
}
const LinkTabMemoized = React.memo(LinkTab)

const TabsComponent = () => {
  const location = useLocation()
  const classes = useStyles()
  const [value, setValue] = useState<number>()
  const handleChange = (_event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue)
  }

  useEffect(() => {
    setValue(findPathValue(location.pathname))
  }, [location.pathname])
  
  return (
    <Paper elevation={0} className={classes.root}>
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
      >
        {tabs.map(({ to, label }, i) => (
          <LinkTabMemoized to={to()} label={label} key={i} />
        ))}
      </Tabs>
    </Paper>
  )
}

export default React.memo(TabsComponent)

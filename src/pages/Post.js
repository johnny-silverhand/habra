import React, { useState, useEffect } from 'react'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Avatar from '@material-ui/core/Avatar'
import Divider from '@material-ui/core/Divider'
import { makeStyles } from '@material-ui/core/styles'
import { useParams } from 'react-router'
import { get } from 'request-promise-native'
import { Link } from 'react-router-dom'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { monokai as style } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import parse, { domToReact } from 'html-react-parser'
import PostViewSkeleton from '../components/skeletons/PostView'
import Scrollbar from '../components/Scrollbar'
import moment from 'moment'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: '100%',
    maxWidth: '100vw',
    background: theme.palette.background.paper,
  },
  hubs: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    wordBreak: 'break-word',
    width: '100%',
    background: theme.palette.background.default,
  },
  hubLink: {
    color: theme.palette.primary.main,
    fontWeight: 500,
    textDecoration: 'none',
  },
  container: {
    overflow: 'auto',
    width: '100%',
    height: '100%',
  },
  authorBar: { marginTop: theme.spacing(2.5) },
  avatar: {
    width: theme.spacing(2.5),
    height: theme.spacing(2.5),
    marginRight: theme.spacing(1),
    borderRadius: 2,
  },
  author: {
    color:
      theme.palette.type === 'light'
        ? theme.palette.primary.light
        : theme.palette.primary.dark,
    marginRight: theme.spacing(1),
    fontWeight: 500,
    fontSize: 14,
  },
  ts: {
    color: theme.palette.text.hint,
    fontWeight: 500,
    fontSize: 14,
  },
  title: {
    fontWeight: '800',
    fontFamily: 'Google Sans',
    fontSize: 28,
    lineHeight: '34px',
    wordBreak: 'break-word',
    hyphens: 'auto',
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(2),
  },
  text: {
    color: theme.palette.type === 'dark' ? '#eee' : theme.palette.text.primary,
    '& img': {
      maxWidth: '100%',
    },
    '& a': {
      color: theme.palette.primary.main,
      textDecoration: 'none',
    },
    '& a:hover': {
      color: theme.palette.primary.dark,
      textDecoration: 'underline',
    },
    '& p': { margin: 0 },
    '& em': { color: theme.palette.text.hint },
    '& code': {
      background: theme.palette.background.default,
      padding: theme.spacing(0.25),
      borderRadius: theme.shape.borderRadius,
    },
    '& table': {
      margin: '1.5em 0',
      width: '100%',
      border: '1px solid ' + theme.palette.text.hint,
      borderCollapse: 'collapse',
    },
    '& table td': {
      padding: '6px 12px 9px',
      border: '1px solid ' + theme.palette.text.hint,
      verticalAlign: 'top',
      lineHeight: '1.5',
    }
  },
  syntaxHighlighter: {
    margin: 0,
    display: 'block',
    tabSize: 4,
    overflow: 'auto',
    border: '1px solid ' + theme.palette.divider,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2) + 'px !important',
    background: theme.palette.background.default + ' !important',
    color: theme.palette.text.primary + ' !important',
  },
}))

const getPost = id =>
  get(`https://m.habr.com/kek/v1/articles/${id}/?fl=ru&hl=ru`, { json: true })

const Post = props => {
  const [post, setPost] = useState()
  const classes = useStyles()
  const { id } = useParams()

  useEffect(() => {
    const get = async () => setPost((await getPost(id)).data)
    get()
  }, [])

  if (post) document.title = post.article.title

  const options = {
    replace: ({ name, children }) => {
      if (name === 'pre') {
        const language = children[0].attribs.class || null
        const data = children[0].children[0].data || ''
        
        return (
          <SyntaxHighlighter
            style={style}
            language={language}
            className={classes.syntaxHighlighter}
          >
            {data}
          </SyntaxHighlighter>
        )
      }
    }
  }

  return post ? (
    <div className={classes.root + ' ' + classes.container}>
      <Scrollbar>
        <Container className={classes.hubs}>
          {post.article.hubs.map((hub, i) => (
            <Typography key={i} variant="caption">
              <Link className={classes.hubLink} to={'/hub/' + hub.alias}>
                {hub.title}
              </Link>
              {post.article.hubs.length - 1 !== i && ', '}
            </Typography>
          ))}
        </Container>
        <Divider />
        <Container>
          <Grid
            className={classes.authorBar}
            container
            direction="row"
            alignItems="center"
          >
            <Avatar
              src={post.article.author.avatar}
              className={classes.avatar}
            />
            <Typography className={classes.author}>
              {post.article.author.login}
            </Typography>
            <Typography className={classes.ts}>
              {moment(post.article.time_published).fromNow()}
            </Typography>
          </Grid>
          <Typography className={classes.title}>
            {post.article.title}
          </Typography>
          <div className={classes.text}>
            {parse(post.article.text_html, options)}
          </div>
        </Container>
      </Scrollbar>
    </div>
  ) : (
    <PostViewSkeleton />
  )
}

export default Post

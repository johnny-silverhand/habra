import * as React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import * as serviceWorker from './serviceWorker'
import { Provider } from 'react-redux'
import store from './store'
import swConfig from './serviceWorkerConfig'
import dayjs from 'dayjs'
import relativeTimePlugin from 'dayjs/plugin/relativeTime'
import calendarPlugin from 'dayjs/plugin/calendar'
import updateLocalePlugin from 'dayjs/plugin/updateLocale'
import 'react-lazy-load-image-component/src/effects/opacity.css'
import 'dayjs/locale/ru'
import { BrowserRouter as Router } from 'react-router-dom'
import 'react-photoswipe/dist/photoswipe.css'
import { MatomoProvider, createInstance } from '@datapunt/matomo-tracker-react'

const instance = createInstance({
  urlBase: 'https://matomo.jarvis394-backend.ml/',
  siteId: 1,
  linkTracking: false,
})

dayjs.locale('ru')
dayjs.extend(relativeTimePlugin)
dayjs.extend(calendarPlugin)
dayjs.extend(updateLocalePlugin)

dayjs.updateLocale('ru', {
  calendar: {
    lastWeek: 'D MMMM, в hh:mm',
    sameDay: 'Сегодня, в hh:mm',
    lastDay: 'Вчера, в hh:mm',
    sameElse: 'DD.MM.YYYY',
  },
})

ReactDOM.render(
  <MatomoProvider value={instance}>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </MatomoProvider>,
  document.getElementById('root')
)
serviceWorker.register(swConfig)

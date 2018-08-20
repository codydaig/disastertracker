import React, {Component} from 'react'
import axios from 'axios'
import Typography from '@material-ui/core/Typography'
import WatchListCardAlertInfo from './WatchListCardAlertInfo.jsx'

export default class LocationCardAlerts extends Component {
  constructor (props) {
    super(props)
    this.state = {
      alerts: []
    }
    this.parseAlerts = this.parseAlerts.bind(this)
    this.getLocationAlerts = this.getLocationAlerts.bind(this)
  }

  componentDidMount () {
    this.getLocationAlerts(this.parseAlerts)
    this.locationAlertInterval = setInterval(this.getLocationAlerts, 10 * 60 * 1000)
  }
  componentWillUnmount () {
    clearInterval(this.locationAlertInterval)
  }
  getLocationAlerts (callback) {
    let params = {
      active: 1,
      severity: 'severe',
      point: `${this.props.location.latitude},${this.props.location.longitude}`
    }
    axios.get('https://api.weather.gov/alerts', {params})
      .then(results => callback(null, results.data))
      .catch(err => callback(err, null))
  }

  parseAlerts (err, alerts) {
    if (err) { }
    var alertArray
    if (!alerts.features) {
      return this.state.alerts.length !== 0 && this.setState({alerts: []})
    }
    alertArray = alerts.features.map(alert => alert.properties)
    alertArray = alertArray.filter(alert => alert.status !== 'Test' && alert.status !== 'Cancel')
    // need to add alert filter to remove expired alerts
    this.setState({alerts: alertArray})
  }

  render () {
    let {alerts} = this.state
    console.log(alerts)
    if (alerts.length === 0) { return (<Typography>No active alerts at this time</Typography>) }
    return alerts.map(alert => (<WatchListCardAlertInfo alert={alert} key={alert.id}/>))
  }
}
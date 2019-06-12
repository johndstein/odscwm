#!/usr/bin/env node

'use strict'
const AWS = require('aws-sdk')
if (process.env.AWS_PROFILE) { // eslint-disable-line
  const credentials = new AWS.SharedIniFileCredentials({
    profile: process.env.AWS_PROFILE // eslint-disable-line
  })
  AWS.config.credentials = credentials
  AWS.config.logger = console
}
/* beautify preserve:start */
const cloudwatch = new AWS.CloudWatch({ apiVersion: '2010-08-01' })
/* beautify preserve:end */
class Stats {
  // options.dimensionName
  // options.dimensionValue
  // options.namespace
  // options.metrics
  //    [
  //      { metricName: { unit: 'Count' } },
  //      { metricName: { unit: 'Seconds' } },
  //    ]
  constructor(options) {
    this.options = options
    this.MetricData = {}
  }
  // Return a new instance of stats with same options as this one.
  newInstance() {
    return new Stats(this.options)
  }
  addMetric(name, value) {
    if (this.options.metrics[name]) {
      if (!this.MetricData[name]) {
        this.MetricData[name] = {
          MetricName: name,
          Dimensions: [{
            Name: this.options.dimensionName,
            Value: this.options.dimensionValue
          }],
          Timestamp: new Date(),
          Unit: this.options.metrics[name],
          Counts: [],
          Values: [],
        }
      }
      this.MetricData[name].Counts.push(1)
      this.MetricData[name].Values.push(value)
    }
  }
  buildParams() {
    this.putMetricDataParams = {
      MetricData: [],
      Namespace: this.options.namespace
    }
    for (const key of Object.keys(this.MetricData)) {
      this.putMetricDataParams.MetricData.push(this.MetricData[key])
    }
  }
  putMetricData() {
    this.buildParams()
    return cloudwatch.putMetricData(this.putMetricDataParams).promise()
  }
  toString(indent) {
    return JSON.stringify(this, null, indent)
  }
}
exports = module.exports = Stats
if (require.main === module) {
  /* beautify preserve:start */
  const options = {
    dimensionName: 'LambdaFunction',
    dimensionValue: 'raw-lambda',
    namespace: 'HELIX/RawBatches',
    metrics: {
      LambdaInits: 'Count',
      BadConfigs: 'Count',
      BadEvents: 'Count',
      AllRecords: 'Count',
      BadRecords: 'Count',
      AllS3Keys: 'Count',
      BadS3Keys: 'Count',
      LagTime: 'Seconds',
    }
  }
  /* beautify preserve:end */
  const s = new Stats(options)
  s.addMetric('JUNK', 37)
  s.addMetric('AllS3Keys', 1)
  s.addMetric('LagTime', 3)
  s.addMetric('AllS3Keys', 1)
  s.addMetric('LagTime', 0)
  s.addMetric('BadS3Keys', 1)
  s.addMetric('AllS3Keys', 1)
  s.addMetric('LagTime', 7)
  s.addMetric('BadS3Keys', 1)
  console.log(s.toString(3))
  s.buildParams()
  console.log(s.toString(3))
  s.putMetricData()
    .then((r) => {
      console.log('DONE', r)
    })
    .catch((e) => {
      console.log('ERROR', e)
    })
}

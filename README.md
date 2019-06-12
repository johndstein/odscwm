# odscwm

One dimension simple Cloudwatch metrics

```bash
./index.js

read -r -d "" rawQ <<EOF
[{
  "Id": "a$(echo $(uuidgen) | cut -d'-' -f 1)",
  "MetricStat": {
    "Metric": {
      "Namespace": "HELIX/RawBatches",
      "MetricName": "AllS3Keys",
      "Dimensions": [{
        "Name": "LambdaFunction",
        "Value": "raw-lambda"
      }]
    },
    "Period": 60,
    "Stat": "Sum",
    "Unit": "Count"
  },
  "ReturnData": true
},{
  "Id": "a$(echo $(uuidgen) | cut -d'-' -f 1)",
  "MetricStat": {
    "Metric": {
      "Namespace": "HELIX/RawBatches",
      "MetricName": "LagTime",
      "Dimensions": [{
        "Name": "LambdaFunction",
        "Value": "raw-lambda"
      }]
    },
    "Period": 60,
    "Stat": "Average",
    "Unit": "Seconds"
  },
  "ReturnData": true
},{
  "Id": "a$(echo $(uuidgen) | cut -d'-' -f 1)",
  "MetricStat": {
    "Metric": {
      "Namespace": "HELIX/RawBatches",
      "MetricName": "BadS3Keys",
      "Dimensions": [{
        "Name": "LambdaFunction",
        "Value": "raw-lambda"
      }]
    },
    "Period": 60,
    "Stat": "Sum",
    "Unit": "Count"
  },
  "ReturnData": true
}]
EOF

aws cloudwatch get-metric-data \
  --region us-west-2 \
  --metric-data-queries "${rawQ}" \
  --start-time $(date --date '-60 min' -u +"%Y-%m-%dT%H:%M:%SZ") \
  --end-time $(date -u +"%Y-%m-%dT%H:%M:%SZ")

```

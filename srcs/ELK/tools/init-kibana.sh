#!/bin/bash

echo "Waiting for Elasticsearch to be ready..."
while true; do
    if curl -s elasticsearch:9200 >/dev/null; then
        break
    fi
    sleep 5
done

echo "Setting up the policy..."

curl -X PUT -u elastic:${ELASTIC_PASSWORD} -H "Content-Type: application/json" "${ELASTICSEARCH_HOSTS}/_ilm/policy/my_policy" -d '
{
  "policy": {
    "phases": {
      "hot": {
        "min_age": "0ms",
        "actions": {
          "rollover": {
            "max_age": "1d",
            "max_primary_shard_size": "5gb"
          }
        }
      },
      "cold": {
        "min_age": "3d",
        "actions": {
          "readonly": {}
        }
      },
      "delete": {
        "min_age": "5d",
        "actions": {
          "delete": {
            "delete_searchable_snapshot": true
          }
        }
      }
    }
  }
}
'

echo "Policy created"

curl -X PUT -u elastic:${ELASTIC_PASSWORD} -H "Content-Type: application/json" "${ELASTICSEARCH_HOSTS}/_index_template/my_template" -d '
{
  "index_patterns": ["*-logs-*"],
  "template": { 
    "settings": {
      "index.lifecycle.name": "my_policy"
    }
  },
  "priority": 1
}
'

echo "Setting up kibana_system user..."

curl -X POST -u elastic:${ELASTIC_PASSWORD} "elasticsearch:9200/_security/user/kibana_system/_password" -H "Content-Type: application/json" -d"
{
  \"password\": \"${KIBANA_PASSWORD}\"
}"

echo "Deleting the setup container ..."
# curl --unix-socket /var/run/docker.sock -X DELETE "http://localhost/containers/setup_kibana?force=true" 

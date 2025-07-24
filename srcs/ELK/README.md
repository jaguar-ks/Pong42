# ELK Stack

## Overview

This directory contains the configuration files and resources for the ELK stack, which is a powerful set of tools for log management, data analysis, and visualization. The ELK stack consists of three main components:

1. **Elasticsearch**: A distributed search and analytics engine.
2. **Logstash**: A data processing pipeline that ingests, transforms, and sends data to Elasticsearch.
3. **Kibana**: A visualization tool for exploring and analyzing data stored in Elasticsearch.

## Technologies

### Elasticsearch

Elasticsearch is a distributed, RESTful search and analytics engine built on Apache Lucene. It is designed to store, search, and analyze large volumes of data quickly and in near real-time.

Key features:
- Full-text search
- Distributed architecture
- Scalability and high availability
- RESTful API

### Logstash

Logstash is a server-side data processing pipeline that ingests data from multiple sources, transforms it, and sends it to a "stash" like Elasticsearch.

Key features:
- Data ingestion from various sources (logs, metrics, etc.)
- Data transformation using filters
- Output to multiple destinations

### Kibana

Kibana is a data visualization and exploration tool for Elasticsearch. It provides a user-friendly interface for creating dashboards, visualizations, and managing Elasticsearch indices.

Key features:
- Interactive dashboards
- Data exploration and visualization
- Management of Elasticsearch indices

## Directory Structure

```
/srcs/ELK/
├── elasticsearch/      # Elasticsearch configuration
│   ├── dockerfile      # Docker configuration for Elasticsearch
│   └── config/         # Elasticsearch configuration files
├── logstash/           # Logstash configuration
│   ├── dockerfile      # Docker configuration for Logstash
│   ├── config/         # Logstash configuration files
│   └── pipeline/       # Logstash pipeline definitions
├── kibana/             # Kibana configuration
│   ├── dockerfile      # Docker configuration for Kibana
│   ├── config/         # Kibana configuration files
│   └── tools/          # Utility scripts for Kibana
└── tools/              # General tools for the ELK stack
```

## How It Works

1. **Data Ingestion**: Logstash collects data from various sources and processes it using filters.
2. **Data Storage**: Processed data is sent to Elasticsearch, where it is indexed and stored.
3. **Data Visualization**: Kibana connects to Elasticsearch to visualize and analyze the stored data.

## Common Operations

### Elasticsearch
```bash
# Check Elasticsearch status
curl -X GET http://localhost:9200/_cluster/health
```

### Logstash
```bash
# Test Logstash configuration
logstash -f /path/to/config-file.conf --config.test_and_exit
```

### Kibana
```bash
# Access Kibana in a browser
http://localhost:5601
```

## Integration

The ELK stack is integrated with other components of the Pong42 project to:
- Collect and analyze logs from NGINX, Vault, and other services.
- Provide insights into application performance and user behavior.
- Monitor system health and detect anomalies.

For more information, refer to the official documentation:
- [Elasticsearch Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html)
- [Logstash Documentation](https://www.elastic.co/guide/en/logstash/current/index.html)
- [Kibana Documentation](https://www.elastic.co/guide/en/kibana/current/index.html)

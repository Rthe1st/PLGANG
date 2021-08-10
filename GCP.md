# GCP Config

We use GCP to store the audio files

## Setup

Install the [GCP SDK](https://cloud.google.com/sdk/docs/quickstart#deb)
It requires python

Project ID is

```bash
export PROJECT_ID=plgang
gcloud auth login
gcloud config set project $PROJECT_ID
gcloud auth application-default login
# beware https://github.com/googleapis/nodejs-storage/issues/116
```

## Bucket setup

```bash
export BUCKET_NAME="mixes-plgang.prangten.com"
# make bucket
gsutil mb -b on -l europe-west2 gs://$BUCKET_NAME
# show buckets
gsutil ls
```

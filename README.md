# PLGANG

A place to host metadata about the monthly recordings we're doing.

## Use

You need to have node installed, a local copy of the recordings folder from dropbox and access to the [gcp storage space](./GCP.md).

```bash
npm install .
# this generates the site's html
node ./generate.js
```

## Architecture

A static site hosted with [github pages](https://pages.github.com/), the site content is under `PLS/*`.

We assume that for each mix there is a audio file recording and a [cue](https://en.wikipedia.org/wiki/Cue_sheet_(computing)#Essential_commands) file listing the tracks used.

The project is tested against audio and cue files generated by [mixxx](https://mixxx.org/download/).

The cue files are parsed and used to generate HTML for showing track lists.

The audio files are kept in google cloud storage.

The links are encrypted before being included in the static site and javascript used to ask for a password and decrypt.

### TODO

* remove hardcoded machine specific file paths
* setup custom domain name
* use signed links instead of public ones so we can expire them
* Auto generate folder per-night (PL01, PL02, PL03, etc)
* styling, make it all pretty
  * including better cue file display
* do the crypto better
  * find a deliberately expensive decrypt operation
* check is wav files work in all browser
  * and if we should convert to something else/multiple formats

### Future thoughts

* telegram group?
* some google analytics alternative for stats
* More fancy player using [howler.js](https://github.com/goldfire/howler.js)
* Example https://github.com/goldfire/howler.js/tree/master/examples/player
* Cue file parser https://github.com/artur-shaik/CueParser

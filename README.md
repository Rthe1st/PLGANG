# PLGANG

A place to host metadata about the monthly recordings we're doing.

## Architecture

A static site hosted with [github pages](https://pages.github.com/).

We assume that for each mix there is a audio file recording and a [cue](https://en.wikipedia.org/wiki/Cue_sheet_(computing)#Essential_commands) file listing the tracks used.

The project is tested against audio and cue files generated by [mixxx](https://mixxx.org/download/).

The cue files are parsed and used to generate HTML for showing track lists.

The audio files are kept in a dropbox account and made available using dropbox public links.

The links are encrypted before being included in the static site and javascript used to ask for a password and decrypt.

Dropbox itself provides the audio player for playing them at the link location.

### TODO

* Autogenerate (and revoke) links
  * there is an API to do this
  * https://www.dropbox.com/developers/documentation/http/documentation#sharing-get_shared_link_file
  * https://www.dropbox.com/developers/documentation/http/documentation#sharing-revoke_shared_link
* Auto generate folder per-night (PL01, PL02, PL03, etc)
* styling, make it all pretty
  * including better cue file display
* do the crypto better
  * find a deliberately expensive decrypt operation

### Future thoughts

* Rotating the password every meetup might be fun
* telegram group?
* Without dropbox professional we can't get metrics for the recording links
  * Could we use a intermediate link-shortener as a stop gap?
* Self-hosting the recordings
  * Benefits:
    * Could have a integrated player on the site, letting us show the cue info more clearly
    * Much better control of access - could have access control directly on the recordings instead of relying on obfuscated links
  * Problems to solve
    * The files are 300MB+ each, cost of downloads need to be low
    * For such large audio files we probably want to stream them
      * We don't want to download the whole file each page load

More fancy player using [howler.js](https://github.com/goldfire/howler.js)
Example https://github.com/goldfire/howler.js/tree/master/examples/player

Cue file parser https://github.com/artur-shaik/CueParser

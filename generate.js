var AES = require("crypto-js/aes");
const fs = require('fs')
const parser = require('cue-parser');

function parseCue(file){
    file = file.replace(".wav", ".cue")
    const cuesheet = parser.parse(`/home/mehow/Dropbox/music/recordings/${file}`);
    let trackList = "<ol>";
    for(let track of cuesheet.files[0].tracks){
        title = track["title"]
        performer = ""
        if(track["performer"] != null && track["performer"] != ""){
            performer = " by " + track["performer"]
        }
        time = track.indexes[0]["time"]
        min = String(time["min"]).padStart(2, '0')
        sec = String(time["sec"]).padStart(2, '0')
        track_time = `${min}:${sec}`;
        trackList += `<li>${title}${performer} - ${track_time}</li>`;
    }
    trackList += "</ol>";
    return trackList;
}

var files = fs.readdirSync('/home/mehow/Dropbox/music/recordings');

const fileLinks = JSON.parse(fs.readFileSync('./plaintext_links.json'));

for(file of files){
    if(fileLinks[file] != null){
        console.log(file)
        let plainTextLink = fileLinks[file]
        var encrypted = AES.encrypt(plainTextLink, "sunstroke").toString();
        
        let data = fs.readFileSync('./template.html', 'utf8')
        data = data
            .replace("$encryptedLink", encrypted)
            .replace("$name", file.replace(".wav", ""))
            .replace("$trackList", parseCue(file))
        fs.writeFileSync(`./PLS/PL2/${file.replace(".wav", ".html")}`, data)

    }
}

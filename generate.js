var AES = require("crypto-js/aes");
const fs = require('fs')
const parser = require('cue-parser');
var upload = require("./upload.js")

const recordingFolder = "/home/mehow/Dropbox/music/recordings/"

function parseCue(file){
    file = file.replace(".wav", ".cue")
    const cuesheet = parser.parse(recordingFolder + file);
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

async function generate(){
    var files = fs.readdirSync(recordingFolder);
    for(file of files){
        // recording must look like pl{number}{name}.wav
        // the cue file like pl{number}{name}.cue
        // and will be put in ./PLS/PLXX/pl{number}_{name}.html
        if(file.startsWith("pl") && file.endsWith(".wav")){
            console.log(file)
            let folder = "./PLS/" + file.substring(0,4).toUpperCase()
            if(!fs.existsSync(folder)){
                fs.mkdirSync(folder)
            }
            // todo: use https://cloud.google.com/storage/docs/access-control/signed-urls
            let publicUrl = await upload.upload(recordingFolder, file)
            const password = fs.readFileSync('./password.txt', 'utf8')
            //todo: right these somewhere so we can reuse them
            var encrypted = AES.encrypt(publicUrl, password).toString();
            
            let data = fs.readFileSync('./template.html', 'utf8')
            let name = "00" + file.replace(".wav", "").slice(2).replace("_", " - ").toUpperCase()
            data = data
                .replace("$encryptedLink", encrypted)
                .replace("$name", name)
                .replace("$trackList", parseCue(file))
                .replace(/\$month/g, file.substring(0,4).toUpperCase())
            fs.writeFileSync(`${folder}/${file.replace(".wav", ".html")}`, data)
        }
        // the file pl{number}_{name}.spotify must contain a  spotify link for embedding playlists
        if(file.startsWith("pl") && file.endsWith(".spotify")){
            console.log(file)
            let folder = "./PLS/" + file.substring(0,4).toUpperCase()
            if(!fs.existsSync(folder)){
                fs.mkdirSync(folder)
            }
            let spotifyLink = fs.readFileSync(recordingFolder + file, 'utf8')
            let data = fs.readFileSync('./spotify_template.html', 'utf8')
            let name = "00" + file.replace(".spotify", "").slice(2).replace("_", " - ").toUpperCase()
            data = data
                .replace("$spotifyLink", spotifyLink)
                .replace("$name", name)
                .replace(/\$month/g, file.substring(0,4).toUpperCase())
            fs.writeFileSync(`${folder}/${file.replace(".spotify", ".html")}`, data)
        }
    }
}

function folderIndexes(){
    var monthlyFolders = fs.readdirSync("PLS");
    for(folder of monthlyFolders){
        var pages = fs.readdirSync("./PLS/"+folder);
        let links = []
        for(page of pages){
            if(page == "index.html"){
                continue
            }
            let name = page.slice(5, -5).toUpperCase()
            links.push(`<li><a href="./${page}">${name}</a></li>`)
        }
        let data = fs.readFileSync('./monthly_index_template.html', 'utf8')
        data = data.replace("$links", links.join(""))
            .replace(/\$month_number/g, "00" + folder.slice(2))
            .replace(/\$month/g, folder)
        fs.writeFileSync(`./PLS/${folder}/index.html`, data)
    }
}

let rootFolder = "./PLS"
if(!fs.existsSync(rootFolder)){
    fs.mkdirSync(rootFolder)
}
generate().then(()=>{
    folderIndexes()
})

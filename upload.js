const bucketName = 'mixes-plgang.prangten.com';

const {Storage} = require('@google-cloud/storage');

exports.upload = async function(folder, fileName){

    const storage = new Storage();

    let bucket = storage.bucket(bucketName)

    const file = bucket.file(fileName);

    return file.exists().then(function(data) {
        const exists = data[0];
        if(!exists){
            console.log("did not already exist")
            return bucket.upload(folder + fileName)
        }
        console.log("Already existed")
        return [file]
    }).then(function() {
        return file.makePublic()
        
    }).then(function(){
        return file.publicUrl()
    });
}

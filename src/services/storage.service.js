const ImageKit = require("imagekit");

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

async function uploadFile(file) {

    try {

        const result = await imagekit.upload({
            file: file,
            fileName: `music_${Date.now()}.mp3`,
            folder: "/spotify_music",
            useUniqueFileName: true
        });

        return result;

    } catch (err) {

        console.log("IMAGEKIT ERROR:", err);
        throw err;
    }
}

module.exports = {
    uploadFile
};
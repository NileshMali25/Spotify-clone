const musicModel = require('../models/music.model');
const jwt = require('jsonwebtoken');
const { uploadFile } = require('../services/storage.service');
const cloudinary = require('cloudinary').v2;
const albumModel = require('../models/album.model');

async function createMusic(req, res) {

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    let decoded; // FIX

    try {

        decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        if (decoded.role !== "artist") {
            return res.status(403).json({
                message: "You don't have access to create music"
            });
        }

    } catch (err) {

        console.log(err);

        return res.status(401).json({
            message: "Unauthorized"
        });

    }

    try {
        const { title } = req.body;
        const files = req.files;

        if (!files || !files.music) {
            return res.status(400).json({
                message: "Music file is required"
            });
        }

        const musicResult = await uploadFile(files.music[0].buffer);
        let imageUrl = '';
        
        if (files.image) {
            const imageResult = await uploadFile(files.image[0].buffer);
            imageUrl = imageResult.secure_url;
        }

        const music = await musicModel.create({
            uri: musicResult.secure_url,
            image: imageUrl,
            title,
            artist: decoded.id,
        });

        res.status(201).json({
            message: "Music created successfully",
            music: {
                id: music._id,
                uri: music.uri,
                image: music.image,
                title: music.title,
                artist: music.artist
            }
        });

    } catch (err) {

        console.log(err);

        return res.status(500).json({
            message: "Server Error",
            error: err
        });


    }

}

async function createAlbum(req, res) {

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        if (decoded.role !== "artist") {
            return res.status(403).json({
                message: "You don't have access to create albums"
            });
        }

        let { title, musics } = req.body;

        if (typeof musics === 'string') {
            try {
                musics = JSON.parse(musics);
            } catch(e) {
                musics = musics.split(',').map(s => s.trim());
            }
        }

        if (!title) {
            return res.status(400).json({
                message: "Title is required"
            });
        }

        if (!musics || !Array.isArray(musics)) {
            return res.status(400).json({
                message: "Musics must be an array"
            });
        }

        let imageUrl = '';
        if (req.file) {
            const imageResult = await uploadFile(req.file.buffer);
            imageUrl = imageResult.secure_url;
        }

        const album = await albumModel.create({
            title,
            image: imageUrl,
            artist: decoded.id,
            musics
        });

        return res.status(201).json({
            message: "Album created successfully",
            album: {
                id: album._id,
                title: album.title,
                image: album.image,
                artist: album.artist,
                musics: album.musics
            }
        });

    } catch (err) {

        console.log(err);

        return res.status(500).json({
            message: "Server Error",
            error: err.message
        });
    }
}

async function getAllMusics(req, res) {
    const musics = await musicModel.find().sort({_id: -1}).limit(20).populate('artist', 'username email');

    res.status(200).json({
        message: "Musics fetched successfully",
        musics: musics,
    });
}



async function getAllAlbums(req, res) {
    const albums = await albumModel.find().select("title artist image").populate('artist', 'username email');

    res.status(200).json({
        message: "Albums fetched successfully",
        albums: albums,
    });
}

async function getAlbumById(req, res) {
    const albumId = req.params.albumId;

    const album = await albumModel.findById(albumId).populate('artist', 'username email').populate('musics');

    return res.status(200).json({
        message: "Album fetched successfully",
        album: album,
    });

}


module.exports = {
    createMusic,
    createAlbum,
    getAllMusics,
    getAllAlbums,
    getAlbumById
};

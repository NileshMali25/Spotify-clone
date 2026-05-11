const express=require('express');
const musicController=require('../controllers/music.controller');
const multer=require('multer');
const authMiddleware=require('../middleware/auth.middleware');
const upload=multer({
    storage:multer.memoryStorage(),
})
const router=express.Router();


router.post(
    '/upload',
    upload.single('music'),
    musicController.createMusic
);

router.post('/album', upload.single('album'), musicController.createAlbum);

router.get('/', authMiddleware.authUser, musicController.getAllMusics);

router.get('/album', authMiddleware.authUser, musicController.getAllAlbums);

router.get('/album/:albumId', authMiddleware.authUser,musicController.getAlbumById); 
module.exports=router;
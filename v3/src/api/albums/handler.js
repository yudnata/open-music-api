const fs = require('fs');
const path = require('path');
const InvariantError = require('../../utils/InvariantError');
const PayloadTooLargeError = require('../../utils/PayloadTooLargeError');

class AlbumsHandler {
  constructor(service, albumLikesService, storageService, validator, uploadsValidator) {
    this._service = service;
    this._albumLikesService = albumLikesService;
    this._storageService = storageService;
    this._validator = validator;
    this._uploadsValidator = uploadsValidator;

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
    this.postAlbumCoverHandler = this.postAlbumCoverHandler.bind(this);
    this.postAlbumLikeHandler = this.postAlbumLikeHandler.bind(this);
    this.deleteAlbumLikeHandler = this.deleteAlbumLikeHandler.bind(this);
    this.getAlbumLikesHandler = this.getAlbumLikesHandler.bind(this);
  }

  async postAlbumHandler(req, res, next) {
    try {
      this._validator.validateAlbumPayload(req.body);
      const { name, year } = req.body;
      const albumId = await this._service.addAlbum({ name, year });

      return res.status(201).send({
        status: 'success',
        data: {
          albumId,
        },
      });
    } catch (error) {
      return next(error);
    }
  }

  async getAlbumByIdHandler(req, res, next) {
    try {
      const { id } = req.params;
      const album = await this._service.getAlbumById(id);

      return res.status(200).send({
        status: 'success',
        data: {
          album,
        },
      });
    } catch (error) {
      return next(error);
    }
  }

  async putAlbumByIdHandler(req, res, next) {
    try {
      this._validator.validateAlbumPayload(req.body);
      const { id } = req.params;
      await this._service.editAlbumById(id, req.body);

      return res.status(200).send({
        status: 'success',
        message: 'Album berhasil diperbarui',
      });
    } catch (error) {
      return next(error);
    }
  }

  async deleteAlbumByIdHandler(req, res, next) {
    try {
      const { id } = req.params;
      await this._service.deleteAlbumById(id);

      return res.status(200).send({
        status: 'success',
        message: 'Album berhasil dihapus',
      });
    } catch (error) {
      return next(error);
    }
  }

  async postAlbumCoverHandler(req, res, next) {
    try {
      const { id } = req.params;

      if (!req.file) {
        throw new InvariantError('Cover harus disertakan');
      }

      const cover = req.file;

      if (cover.size > 512000) {
        throw new PayloadTooLargeError('Ukuran file melebihi 512KB');
      }

      this._uploadsValidator.validateImageHeaders({ 'content-type': cover.mimetype });

      await this._service.getAlbumById(id);

      const oldCover = await this._service.getAlbumCover(id);

      const filename = `${Date.now()}-${cover.originalname}`;
      const uploadPath = path.resolve(__dirname, '../../../uploads/images', filename);

      fs.writeFileSync(uploadPath, cover.buffer);

      const coverUrl = `http://${process.env.HOST}:${process.env.PORT}/uploads/images/${filename}`;

      await this._service.updateAlbumCover(id, coverUrl);

      if (oldCover) {
        const oldFilename = oldCover.split('/').pop();
        const oldPath = path.resolve(__dirname, '../../../uploads/images', oldFilename);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      return res.status(201).send({
        status: 'success',
        message: 'Sampul berhasil diunggah',
      });
    } catch (error) {
      return next(error);
    }
  }

  async postAlbumLikeHandler(req, res, next) {
    try {
      const { id: albumId } = req.params;
      const { id: userId } = req.user;

      await this._albumLikesService.likeAlbum(userId, albumId);

      return res.status(201).send({
        status: 'success',
        message: 'Berhasil menyukai album',
      });
    } catch (error) {
      return next(error);
    }
  }

  async deleteAlbumLikeHandler(req, res, next) {
    try {
      const { id: albumId } = req.params;
      const { id: userId } = req.user;

      await this._albumLikesService.unlikeAlbum(userId, albumId);

      return res.status(200).send({
        status: 'success',
        message: 'Berhasil batal menyukai album',
      });
    } catch (error) {
      return next(error);
    }
  }

  async getAlbumLikesHandler(req, res, next) {
    try {
      const { id: albumId } = req.params;

      const { likes, source } = await this._albumLikesService.getAlbumLikesCount(albumId);

      const response = res.status(200);

      if (source === 'cache') {
        response.set('X-Data-Source', 'cache');
      }

      return response.send({
        status: 'success',
        data: {
          likes,
        },
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = AlbumsHandler;

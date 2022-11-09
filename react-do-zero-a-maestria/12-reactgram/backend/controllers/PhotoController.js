const Photo = require("../models/Photo");

const User = require("../models/User");

const mongoose = require("mongoose");

// Insert a photo, with an user related to it

const insertPhoto = async (req, res) => {
  const { title } = req.body;
  const image = req.file.filename;

  const reqUser = req.user;

  const user = await User.findById(reqUser._id);

  // create a photo

  const newPhoto = await Photo.create({
    image,
    title,
    userId: user._id,
    userName: user.name,
  });

  // If photo was created successfully, return data

  if (!newPhoto) {
    res.status(422).json({
      errors: ["Houve um problema, por favor tente novamente mais tarde."],
    });
    return;
  }

  res.status(201).json(newPhoto);
};

// Remove a photo from DB
const deletePhoto = async (req, res) => {
  const { id } = req.params;

  const reqUser = req.user;

  try {
    const photo = await Photo.findById(mongoose.Types.ObjectId(id));

    // check if photo exists

    if (!photo) {
      return res.status(422).json({ errors: ["Foto não encontrada!"] });
    }

    // check if photo belongs to user

    if (!photo.userId.equals(reqUser._id)) {
      return res.status(422).json({
        errors: ["Ocorreu um erro, por favor tente novamente mais tarde."],
      });
    }

    await Photo.findByIdAndDelete(photo._id);

    return res
      .status(200)
      .json({ id: photo._id, message: "Foto excluída com sucesso." });
  } catch (error) {
    return res.status(404).json({
      errors: ["Foto não encontrada!"],
    });
  }
};

// Get all photos
const getAllPhotos = async (req, res) => {
  const photos = await Photo.find({})
    .sort([["createdAt", -1]])
    .exec();

  return res.status(200).json(photos);
};

// get user photos
const getUserPhotos = async (req, res) => {
  const { id } = req.params;

  const photos = await Photo.find({ userId: id }).sort([["createdAt", -1]]).exec();

  return res.status(200).json(photos);
};

//get photo by id

const getPhotoById = async (req, res) => {
    const { id } = req.params;

    const photo = await Photo.findById(mongoose.Types.ObjectId(id))

    //check if photo exists
    if(!photo) {
        return res.status(404).json({
            errors: ["Foto não encontrada!"],
          });
    }

    return res.status(200).json(photo);
}

// update photo

const updatePhoto = async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    const reqUser = req.user;
    const photo = await Photo.findById(id);

    //check if photo exists
    if(!photo){
        return res.status(404).json({errors: ["Foto não encontrada!"]})
    }

    //check if photo belongs to user
    if(!photo.userId.equals(reqUser._id)) {
        return res.status(422).json({errors: ["Ocorreu um erro, por favor tente novamente mais tarde."]});
    }

    if(title) {
        photo.title = title;
    }

    await photo.save();

    return res.status(200).json({
        photo,
        message: "Foto atualizada com sucesso!"
    })
};

module.exports = {
  insertPhoto,
  deletePhoto,
  getAllPhotos,
  getUserPhotos,
  getPhotoById,
  updatePhoto
};

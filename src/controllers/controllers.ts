import deleteAudioController from "./audios/deleteAudioController";
import updateAudioController from "./audios/updateAudioController";
import uploadAudioController from "./audios/uploadAudioController";
import loginController from "./auths/loginController";
import registerController from "./auths/registerController";
import deleteProfileController from "./profiles/deleteProfileController";
import getProfileController from "./profiles/getProfileController";
import updateProfileController from "./profiles/updateProfileController";
import streamAudioController from "./audios/streamAudioController";
import getAudioDataController from "./audios/getAudioDataController";
import listAudioController from "./audios/listAudioController";

const controllers = {
  deleteAudioController,
  updateAudioController,
  uploadAudioController,
  loginController,
  registerController,
  deleteProfileController,
  getProfileController,
  updateProfileController,
  streamAudioController,
  getAudioDataController,
  listAudioController,
};

export default controllers;

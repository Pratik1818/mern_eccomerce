import express from "express";
import { getUserDetails, registerUser, requestPasswordReset, resetPassword, updatePassword, updateProfile, userLogin, userLogout } from "../controller/userController.js";
import { verifyUserAuth } from "../middleware/userAuth.js";
const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(userLogin);
router.route('/logout').post(userLogout);
router.route('/forgot/password').post(requestPasswordReset);
router.route('/reset/:token').post(resetPassword);
router.route('/profile').post(verifyUserAuth,getUserDetails);
router.route('/password/update').post(verifyUserAuth,updatePassword);
router.route('/profile/update').post(verifyUserAuth,updateProfile);


export default router;


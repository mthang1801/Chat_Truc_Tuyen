import getLoginRegister from "./authController";
import getHome from "./homeController" ;
import userController from "./userController";
import contactController from "./contactController";
import notificationController from "./notificationController";
import messageController from "./messageController" ;
import groupChatController from "./groupChatController" ;
export const home = getHome ;
export const auth = getLoginRegister ;
export const user = userController;
export const contact = contactController;
export const notification = notificationController;
export const message = messageController;
export const groupChat = groupChatController;
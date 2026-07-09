import { Router } from "express";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { contactController } from "./contacts.controller";

const contactRoutes = Router();

contactRoutes.post(
  "/new",
  auth([Role.ADMIN, Role.USER]),
  contactController.createContactIntoDb,
);

contactRoutes.get(
  "/all",
  auth([Role.ADMIN, Role.USER]),
  contactController.getUserAllcontacts,
);

contactRoutes.get(
  "/stats",
  auth([Role.ADMIN, Role.USER]),
  contactController.getStats,
);

contactRoutes.get("/favorites", contactController.getFavoritesContact);

contactRoutes.get("/", contactController.getAllContact);

contactRoutes.post("/:id/favorite", contactController.markAsFavorite);

contactRoutes.patch("/:id/favorite", contactController.toggleFavorite);

contactRoutes.delete("/:id/favorite", contactController.deleteFavorite);

contactRoutes.put("/:id/note", contactController.addNote);

contactRoutes.get("/:id", contactController.getSingleContact);

export default contactRoutes;

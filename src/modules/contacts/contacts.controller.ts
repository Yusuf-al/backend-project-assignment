import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { contactService } from "./contacts.service";
import { sendRespone } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { IQuery } from "./contacts.interface";
import { JwtPayload } from "jsonwebtoken";

const createContactIntoDb = catchAsync(async (req: Request, res: Response) => {
  const userData = req.user;

  if (!userData) throw new Error("User is not logged in, Pleasa login first");

  const payload = req.body;

  if (!payload) throw new Error("No data is provided");

  const newContact = await contactService.createContact(payload, userData);

  sendRespone(res, {
    message: "New Contact added to the list",
    success: true,
    statusCode: httpStatus.CREATED,
    data: newContact,
  });
});

const getUserAllcontacts = catchAsync(
  async (req: Request<{}, {}, {}, JwtPayload>, res: Response) => {
    const user = req.user;
    if (!user) throw new Error("User is not logged in, Pleasa login first");

    const contactList = await contactService.userContacts(user);

    sendRespone(res, {
      success: true,
      message: "Contact List",
      statusCode: httpStatus.OK,
      data: contactList,
    });
  },
);

const getSingleContact = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const contact = await contactService.singleContact(id as string);

  sendRespone(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Contact retrived Successfully",
    data: contact,
  });
});

const getFavoritesContact = catchAsync(async (req: Request, res: Response) => {
  const favoritesContacts = await contactService.favoritesContacts();

  //   let data;
  //   if (favoritesContacts.length < 0) {
  //     data = "No favorites contacts are added";
  //   }

  let data = favoritesContacts;

  sendRespone(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Favorites contact list",
    data: data,
  });
});

const markAsFavorite = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const addedAsFav = await contactService.markAsFavotireContact(id as string);
  sendRespone(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Contact marked as favorites",
    data: addedAsFav,
  });
});

const deleteFavorite = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const deletedContact = await contactService.deleteFavotireContact(
    id as string,
  );
  sendRespone(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "favorites contect removed",
    data: deletedContact,
  });
});

const addNote = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const { note } = req.body;

  const updateNotes = await contactService.updateContactNote(
    id as string,
    note as string,
  );
  sendRespone(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Note updated",
    data: updateNotes,
  });
});

const toggleFavorite = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const toggledContact = await contactService.toggleFavoriteContact(
    id as string,
  );

  sendRespone(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "favorites contact status changes successfully",
    data: toggledContact,
  });
});

const getAllContact = catchAsync(
  async (req: Request<{}, {}, {}, IQuery>, res: Response) => {
    const allContacts = await contactService.allContacts(req.query);

    sendRespone(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All contact retrived successfully",
      data: allContacts,
    });
  },
);

const getStats = catchAsync(async (req: Request, res: Response) => {
  const id = req.user?.id;

  const stats = await contactService.statsData(id as string);
  sendRespone(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "contact statistics",
    data: stats,
  });
});

export const contactController = {
  createContactIntoDb,
  getUserAllcontacts,
  getSingleContact,
  getFavoritesContact,
  markAsFavorite,
  deleteFavorite,
  addNote,
  toggleFavorite,
  getAllContact,
  getStats,
};

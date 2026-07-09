import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../lib/prisma";
import { validateContactExists } from "../../utils/checkContact";
import { query } from "express-validator";
import { IContact, IQuery } from "./contacts.interface";
import { Prisma } from "../../../generated/prisma/client";

const createContact = async (payload: IContact, userData: JwtPayload) => {
  const { id, email } = userData as JwtPayload;

  const {
    firstName,
    lastName,
    email: contactEmail,
    phone,
    isFavorite,
    personalNote,
  } = payload;

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id,
      email,
    },
  });

  if (!user) throw new Error("user not found");

  const newContact = await prisma.contact.create({
    data: {
      firstName,
      lastName,
      email: contactEmail,
      phone,
      isFavorite,
      personalNote,
      userId: id,
    },
  });

  if (!newContact) throw new Error("user createtion failed");

  return newContact;
};

const userContacts = async (userData: JwtPayload) => {
  const { id } = userData;

  const contactList = await prisma.contact.findMany({
    where: {
      userId: id,
    },
  });

  if (contactList.length <= 0) throw new Error("User has no contact");

  return {
    "user contact": contactList,
  };
};

const singleContact = async (contactId: string) => {
  const contact = await prisma.contact.findUnique({
    where: {
      id: contactId,
    },
  });
  if (!contact) throw new Error("Contact is not present in the list");

  const formatedRespone = {
    first_Name: contact.firstName,
    last_Name: contact.lastName ?? " ",
    email: contact.email ?? "Email is not added",
    phone: contact.phone ?? "No phone number is added",
    favorite: contact.isFavorite ? "Yes" : "No",
    personalNote: contact.personalNote ?? "No notes added",
  };

  return formatedRespone;
};

export const favoritesContacts = async () => {
  const favContactList = await prisma.contact.findMany({
    where: {
      isFavorite: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return favContactList;
};

const markAsFavotireContact = async (id: string) => {
  await validateContactExists(id);

  const makeFavorite = await prisma.contact.update({
    where: {
      id: id,
    },
    data: {
      isFavorite: true,
    },
  });

  return makeFavorite;
};

const deleteFavotireContact = async (id: string) => {
  await validateContactExists(id);

  const deletedFavorite = await prisma.contact.delete({
    where: {
      id: id,
      isFavorite: true,
    },
  });

  return deletedFavorite;
};

const updateContactNote = async (id: string, note: string) => {
  await validateContactExists(id);

  const updatedContactNote = await prisma.contact.update({
    where: { id },
    data: {
      personalNote: note,
    },
  });

  return updatedContactNote;
};

const toggleFavoriteContact = async (id: string) => {
  const contact = await validateContactExists(id);

  const toggleContact = await prisma.contact.update({
    where: {
      id: id,
    },
    data: {
      isFavorite: !contact.isFavorite,
    },
  });

  return toggleContact;
};

const allContacts = async (query: IQuery) => {
  const {
    page = "1",
    limit = "10",
    sortBy = "createdAt",
    sortOrder = "desc",
    favorite,
    search,
  } = query;

  const skip = (Number(page) - 1) * Number(limit);

  const whereCondition: Prisma.ContactWhereInput = {
    ...(favorite === "1" && {
      isFavorite: true,
    }),

    ...(search && {
      OR: [
        {
          firstName: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          lastName: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          phone: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    }),
  };

  const [contacts, total] = await Promise.all([
    prisma.contact.findMany({
      where: whereCondition,
      skip,
      take: Number(limit),
      orderBy: {
        [sortBy]: sortOrder,
      },
    }),

    prisma.contact.count({
      where: whereCondition,
    }),
  ]);

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
    data: contacts,
  };
};

const statsData = async (userId: string) => {
  const [totalContacts, favoriteContacts, contactsWithNotes] =
    await Promise.all([
      prisma.contact.count({
        where: {
          userId,
        },
      }),

      prisma.contact.count({
        where: {
          userId,
          isFavorite: true,
        },
      }),

      prisma.contact.count({
        where: {
          userId,
          personalNote: {
            not: null,
          },
        },
      }),
    ]);

  return {
    total_contacts: totalContacts,
    favorite_contacts: favoriteContacts,
    contacts_with_notes: contactsWithNotes,
  };
};

export const contactService = {
  createContact,
  userContacts,
  singleContact,
  favoritesContacts,
  markAsFavotireContact,
  deleteFavotireContact,
  updateContactNote,
  toggleFavoriteContact,
  allContacts,
  statsData,
};

const { PrismaClient } = require("@prisma/client");
const ServiceError = require("../core/serviceError");
const handleDBError = require("./_handleDBError");
const WebSocket = require('ws');
const { getLogger } = require("../core/logging");

const prisma = new PrismaClient();
const wsClient = new Set();

const getAllByUserId = async (userId) => {
  const notifications = await prisma.notificatie.findMany({
    where: {
      USER_ID: userId,
    },
    include: {
      bestelling: {
        select: {
          ORDERID: true,
        },
      },
    },
  });

  if (!notifications) {
    throw ServiceError.notFound(
      `Er zijn geen notificaties voor deze gebruiker met id ${userId}`,
      { userId }
    );
  }

  return { items: notifications };
};

const getMostRecentByUserId = async (userId, amount = 5) => {
  const notifications = await prisma.notificatie.findMany({
    where: {
      USER_ID: userId,
    },
    orderBy: {
      DATUM: "desc",
    },
    take: amount,
  });

  if (notifications.length === 0) {
    throw ServiceError.notFound(
      `Er zijn geen notificaties voor deze gebruiker met id ${userId}`,
      { userId }
    );
  }

  return { items: notifications };
};

const create = async ({ ID, ...notificationData }) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        ID,
      },
      select: {
        DTYPE: true,
      },
    });

    if (!user) {
      throw ServiceError.notFound(`User with ID ${ID} not found`);
    }

    if (user.DTYPE === "Klant") {
      throw ServiceError.unauthorized("U kan als klant geen notificatie aanmaken");
    }

    const newNotification = await prisma.notificatie.create({
      data: {
        USER_ID: ID,
        ...notificationData,
      },
    });
    return newNotification;
  } catch (error) {
    throw handleDBError(error);
  }
};

const updateById = async (ID, { TEXT, STATUS }) => {
  const existingNotificatie = await prisma.notificatie.findUnique({
    where: {
      ID,
    },
  });

  if (!existingNotificatie) {
    throw ServiceError.notFound(`Er bestaat geen notificatie met id ${ID}`);
  }

  try {
    await prisma.notificatie.update({
      where: {
        ID,
      },
      data: {
        TEXT,
        STATUS,
      },
    });

    return await prisma.notificatie.findUnique({
      where: {
        ID,
      },
    });
  } catch (error) {
    throw handleDBError(error);
  }
};

const readNotificationById = async (ID, userId) => {
  const notification = await prisma.notificatie.findUnique({
    where: { ID },
  });

  if (notification.USER_ID !== userId) {
    throw ServiceError.unauthorized(
      "U bent niet gemachtigd om deze notificatie te lezen",
      { ID }
    );
  }

  if (!notification) {
    throw ServiceError.notFound(`Er bestaat geen notificatie met id ${ID}`, {
      ID,
    });
  }

  if (notification.STATUS === "NIEUW" || notification.STATUS === "ONGELEZEN") {
    await prisma.notificatie.update({
      where: { ID },
      data: {
        STATUS: "GELEZEN",
      },
    });
  }
};

module.exports = {
  getAllByUserId,
  getMostRecentByUserId,
  create,
  updateById,
  readNotificationById,
  wsClient
};

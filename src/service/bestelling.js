const { PrismaClient } = require("@prisma/client");

const ServiceError = require("../core/serviceError");

const handleDBError = require("./_handleDBError");
const { date, equal } = require("joi");

const prisma = new PrismaClient();

const getAll = async ({ ID, roles, standaard, leverstatus, betaald, paginaNummer, ordNr, aantal, datum }) => {
  let whereClause = {
    OR: [{ KLANT_ID: ID }, { LEVERANCIER_ID: ID }],
  };

  if (standaard === "true") {
    if (roles === "Klant") {
      whereClause = {
        ...whereClause,
        NOT: [{ ORDERSTATUS: 'GELEVERD', BETALINGSSTATUS: 'BETAALD' }]
      };
    } else if (roles === "Leverancier") {

      whereClause = {
        ...whereClause,
        OR: [
          { ORDERSTATUS: 'VERZONDEN' },
          {
            AND: [
              { ORDERSTATUS: 'GELEVERD' },
              { NOT: { BETALINGSSTATUS: 'BETAALD' } }
            ]
          }
        ]
      };
    }
  }
  if (ordNr && ordNr.trim() !== "") {
    whereClause = {
      ...whereClause,
      ORDERID: {
        contains: ordNr.trim(),
      },
    };
  }

  if (leverstatus && leverstatus !== "alle") {
    switch (leverstatus) {
      case "INBEHANDELING":
        whereClause.ORDERSTATUS = { equals: "INBEHANDELING" };
        break;
      case "VERZONDEN":
        whereClause.ORDERSTATUS = { equals: "VERZONDEN" };
        break;
      default:
        whereClause.ORDERSTATUS = { equals: "GELEVERD" };
    }
  } else if (leverstatus && leverstatus === "alle") {
    whereClause.ORDERSTATUS = { in: ["INBEHANDELING", "VERZONDEN", "GELEVERD"] }
  }

  if (betaald && betaald !== "alle") {
    switch (betaald) {
      case "BETAALD":
        whereClause.BETALINGSSTATUS = { equals: "BETAALD" };
        break;
      default:
        whereClause.BETALINGSSTATUS = { equals: "NIETBETAALD" };
    }
  } else if (betaald && betaald === "alle") {
    whereClause.BETALINGSSTATUS = { in: ["BETAALD", "NIETBETAALD"] }
  }

  if (datum) {
    const dat = new Date(datum).toISOString();
    whereClause.DATUMGEPLAATST = { equals: dat };
  }


  const bestellingen = await prisma.bestelling.findMany({
    skip: (paginaNummer - 1) * aantal,
    take: aantal,
    where: whereClause,
    include: {
      user_bestelling_KLANT_IDTouser: {
        select: {
          ID: true,
          DTYPE: true,
          USERNAME: true,
          BEDRIJF_ID: true,
          bedrijf_user_BEDRIJF_IDTobedrijf: {
            select: { NAAM: true }
          }
        }
      },
      user_bestelling_LEVERANCIER_IDTouser: {
        select: {
          ID: true,
          DTYPE: true,
          USERNAME: true,
          BEDRIJF_ID: true,
          bedrijf_user_BEDRIJF_IDTobedrijf: {
            select: { NAAM: true }
          }
        }
      }
    }
  });

  return { items: bestellingen };
};





const getById = async (ID, gebruikersId) => {
  const bestelling = await prisma.bestelling.findUnique({
    where: {
      ID,
    },
    include: {
      bestelling_product: {
        select: {
          AANTAL: true,
          price: true,
          product: {
            select: {
              NAAM: true,
              EENHEIDSPRIJS: true,
            },
          },
        },
      },
      user_bestelling_KLANT_IDTouser: {
        select: {
          USERNAME: true,
          bedrijf_user_BEDRIJF_IDTobedrijf: {
            select: { NAAM: true }
          }
        },
      },
      user_bestelling_LEVERANCIER_IDTouser: {
        select: {
          USERNAME: true,
          bedrijf_user_BEDRIJF_IDTobedrijf: {
            select: { NAAM: true }
          }
        },
      },
    },
  });

  if (!bestelling) {
    throw ServiceError.notFound(`Er bestaat geen bestelling met id ${ID}`, {
      ID,
    });
  }

  if (
    bestelling.KLANT_ID !== gebruikersId &&
    bestelling.LEVERANCIER_ID !== gebruikersId
  ) {
    throw ServiceError.unauthorized(`Gebruiker is niet gemachtigd om deze bestelling op te halen`, {
      gebruikersId,
    });
  }

  return bestelling;
};

const create = async ({
  BEDRAG,
  BETAALDAG,
  BETALINGSSTATUS,
  DATUMGEPLAATST,
  DATUMLAATSTEBETALINGSHERINNERING,
  HEEFTBETALINGSHERINNERING,
  LEVERADRES,
  ORDERID,
  ORDERSTATUS,
  KLANT_ID,
  LEVERANCIER_ID,
}) => {
  try {
    const newBestelling = await prisma.bestelling.create({
      data: {
        BEDRAG,
        BETAALDAG,
        BETALINGSSTATUS,
        DATUMGEPLAATST,
        DATUMLAATSTEBETALINGSHERINNERING,
        HEEFTBETALINGSHERINNERING,
        LEVERADRES,
        ORDERID,
        ORDERSTATUS,
        KLANT_ID,
        LEVERANCIER_ID,
        //producten 
      },
    });
    return getById(newBestelling.ID);
  } catch (error) {
    throw handleDBError(error);
  }
};

const deleteById = async (ID) => {
  try {
    const deleted = await prisma.bestelling.delete({
      where: {
        ID,
      },
    });
    if (!deleted) {
      throw ServiceError.notFound(`Er bestaat geen bestelling met id ${ID}`, {
        ID,
      });
    }
  } catch (error) {
    throw handleDBError(error);
  }
};




module.exports = {
  getAll,
  getById,
  create,
  deleteById
};

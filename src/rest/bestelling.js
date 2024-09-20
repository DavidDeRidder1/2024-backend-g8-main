const Router = require("@koa/router");
const Joi = require("joi");

const validate = require("../core/validation");
const bestellingService = require("../service/bestelling");
const { requireAuthentication } = require("../core/auth");

const getAllBestellingen = async (ctx) => {
  const { ID, roles } = ctx.state.session;
  const standaard = ctx.query.standaard
  const betaald = ctx.query.betaald;
  const leverstatus = ctx.query.leverstatus;
  const datum = ctx.query.datum;
  const paginaNummer = parseInt(ctx.query.paginaNummer);
  const ordNr = ctx.query.ordNr;
  const aantal = parseInt(ctx.query.aantal);
  ctx.body = await bestellingService.getAll({ ID, roles, standaard, betaald, leverstatus, paginaNummer, ordNr, aantal, datum });
};

getAllBestellingen.validationScheme = {
  query: {
    standaard: Joi.boolean(),
    leverstatus: Joi.string().allow("").allow(null),
    betaald: Joi.string().allow("").allow(null),
    aantal: Joi.number().integer().min(1),
    paginaNummer: Joi.number().integer().min(1),
    ordNr: Joi.string().allow("").allow(null),
    datum: Joi.string().allow("").allow(null)
  },
};

const createBestelling = async (ctx) => {
  const newBestelling = await bestellingService.create({
    ...ctx.request.body,
  });
  ctx.body = newBestelling;
  ctx.status = 201;
};

createBestelling.validationScheme = {
  body: {
    BEDRAG: Joi.number().positive().invalid(0).required(),
    BETAALDAG: Joi.date().iso().min("now").required(),
    BETALINGSSTATUS: Joi.string().required(),
    DATUMGEPLAATST: Joi.date().iso().required(),
    DATUMLAATSTEBETALINGSHERINNERING: Joi.date().iso(),
    HEEFTBETALINGSHERINNERING: Joi.boolean().required(),
    LEVERADRES: Joi.string().required(),
    ORDERID: Joi.string()
      .regex(/^ORD\d+/)
      .required(),
    ORDERSTATUS: Joi.number().integer().positive().required(),
    KLANT_ID: Joi.number().integer().positive().required(),
    LEVERANCIER_ID: Joi.number().integer().positive().required(),
    //producten 
  },
};

const getBestellingById = async (ctx) => {
  const { ID } = ctx.state.session;
  ctx.body = await bestellingService.getById(Number(ctx.params.id), ID);
};

getBestellingById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};




module.exports = (app) => {
  const router = new Router({
    prefix: "/bestellingen",
  });

  router.get(
    "/",
    requireAuthentication,
    validate(getAllBestellingen.validationScheme),
    getAllBestellingen
  );
  router.post(
    "/",
    requireAuthentication,
    validate(createBestelling.validationScheme),
    createBestelling
  );
  router.get(
    "/:id",
    requireAuthentication,
    validate(getBestellingById.validationScheme),
    getBestellingById
  );

  app.use(router.routes()).use(router.allowedMethods());
};

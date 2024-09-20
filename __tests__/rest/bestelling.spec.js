const { withServer, login, loginKlant } = require("../supertest.setup");
const { testAuthHeader } = require("../common/auth");

describe("Bestellingen", () => {
  let request;
  let authHeader;

  withServer(({ supertest }) => {
    request = supertest;
  });

  beforeAll(async () => {
    authHeader = await login(request);
    authHeaderKlant = await loginKlant(request);
  });

  const url = "/api/bestellingen";

  describe("GET /api/bestellingen", () => {
    it("zou 200 en standaard bestellingen van leverancier", async () => {
      const response = await request.get(`${url}?paginaNummer=1&ordNr=&standaard=true&aantal=20&leverstatus=&betaald=&datum=`).set("Authorization", authHeader);
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(2);

      expect(response.body.items[0]).toEqual({
        ID: 3,
        BEDRAG: 1200,
        BETAALDAG: "2024-05-22T00:00:00.000Z",
        BETALINGSSTATUS: "BETAALD",
        DATUMGEPLAATST: "2024-04-22T00:00:00.000Z",
        DATUMLAATSTEBETALINGSHERINNERING: null,
        HEEFTBETALINGSHERINNERING: false,
        LEVERADRES: "789 Maple St",
        ORDERID: "ORD124",
        ORDERSTATUS: "VERZONDEN",
        USER_ID: null,
        KLANT_ID: 4,
        LEVERANCIER_ID: 1,
        user_bestelling_KLANT_IDTouser: {
          ID: 4,
          DTYPE: "Klant",
          USERNAME: "klant2",
          BEDRIJF_ID: 2,
          bedrijf_user_BEDRIJF_IDTobedrijf: {
            NAAM: "Bedrijf2"
          }
        },
        user_bestelling_LEVERANCIER_IDTouser: {
          ID: 1,
          DTYPE: "Leverancier",
          USERNAME: "leverancier1",
          BEDRIJF_ID: 1,
          bedrijf_user_BEDRIJF_IDTobedrijf: {
            NAAM: "Bedrijf1"
          }
        }

      });
      expect(response.body.items[1]).toEqual({
        ID: 4,
        BEDRAG: 1200,
        BETAALDAG: "2024-05-03T00:00:00.000Z",
        BETALINGSSTATUS: "NIETBETAALD",
        DATUMGEPLAATST: "2024-04-03T00:00:00.000Z",
        DATUMLAATSTEBETALINGSHERINNERING: null,
        HEEFTBETALINGSHERINNERING: false,
        LEVERADRES: "321 Joske St",
        ORDERID: "ORD125",
        ORDERSTATUS: "GELEVERD",
        USER_ID: null,
        KLANT_ID: 4,
        LEVERANCIER_ID: 1,
        user_bestelling_KLANT_IDTouser: {
          ID: 4,
          DTYPE: "Klant",
          USERNAME: "klant2",
          BEDRIJF_ID: 2,
          bedrijf_user_BEDRIJF_IDTobedrijf: {
            NAAM: "Bedrijf2"
          }
        },
        user_bestelling_LEVERANCIER_IDTouser: {
          ID: 1,
          DTYPE: "Leverancier",
          USERNAME: "leverancier1",
          BEDRIJF_ID: 1,
          bedrijf_user_BEDRIJF_IDTobedrijf: {
            NAAM: "Bedrijf1"
          }
        }
      });

    });
    it("zou 200 en betaalde bestellingen van leverancier", async () => {
      const response = await request.get(`${url}?paginaNummer=1&ordNr=&standaard=false&aantal=20&leverstatus=&betaald=BETAALD&datum=`).set("Authorization", authHeader);
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(1);

      expect(response.body.items[0]).toEqual({
        ID: 3,
        BEDRAG: 1200,
        BETAALDAG: "2024-05-22T00:00:00.000Z",
        BETALINGSSTATUS: "BETAALD",
        DATUMGEPLAATST: "2024-04-22T00:00:00.000Z",
        DATUMLAATSTEBETALINGSHERINNERING: null,
        HEEFTBETALINGSHERINNERING: false,
        LEVERADRES: "789 Maple St",
        ORDERID: "ORD124",
        ORDERSTATUS: "VERZONDEN",
        USER_ID: null,
        KLANT_ID: 4,
        LEVERANCIER_ID: 1,
        user_bestelling_KLANT_IDTouser: {
          ID: 4,
          DTYPE: "Klant",
          USERNAME: "klant2",
          BEDRIJF_ID: 2,
          bedrijf_user_BEDRIJF_IDTobedrijf: {
            NAAM: "Bedrijf2"
          }
        },
        user_bestelling_LEVERANCIER_IDTouser: {
          ID: 1,
          DTYPE: "Leverancier",
          USERNAME: "leverancier1",
          BEDRIJF_ID: 1,
          bedrijf_user_BEDRIJF_IDTobedrijf: {
            NAAM: "Bedrijf1"
          }
        }

      });
    });

    it("zou 200 en niet betaalde bestellingen van leverancier", async () => {
      const response = await request.get(`${url}?paginaNummer=1&ordNr=&standaard=false&aantal=20&leverstatus=&betaald=NIETBETAALD&datum=`).set("Authorization", authHeader);
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(2);

      expect(response.body.items[0]).toEqual({
        ID: 1,
        BEDRAG: 4200,
        BETAALDAG: "2024-04-17T00:00:00.000Z",
        BETALINGSSTATUS: "NIETBETAALD",
        DATUMGEPLAATST: "2024-03-17T00:00:00.000Z",
        DATUMLAATSTEBETALINGSHERINNERING: "2024-04-17T00:00:00.000Z",
        HEEFTBETALINGSHERINNERING: true,
        LEVERADRES: "123 Elm St",
        ORDERID: "ORD123",
        ORDERSTATUS: "INBEHANDELING",
        USER_ID: null,
        KLANT_ID: 4,
        LEVERANCIER_ID: 1,
        user_bestelling_KLANT_IDTouser: {
          ID: 4,
          DTYPE: "Klant",
          USERNAME: "klant2",
          BEDRIJF_ID: 2,
          bedrijf_user_BEDRIJF_IDTobedrijf: {
            NAAM: "Bedrijf2"
          }
        },
        user_bestelling_LEVERANCIER_IDTouser: {
          ID: 1,
          DTYPE: "Leverancier",
          USERNAME: "leverancier1",
          BEDRIJF_ID: 1,
          bedrijf_user_BEDRIJF_IDTobedrijf: {
            NAAM: "Bedrijf1"
          }
        }
      });
      expect(response.body.items[1]).toEqual({
        ID: 4,
        BEDRAG: 1200,
        BETAALDAG: "2024-05-03T00:00:00.000Z",
        BETALINGSSTATUS: "NIETBETAALD",
        DATUMGEPLAATST: "2024-04-03T00:00:00.000Z",
        DATUMLAATSTEBETALINGSHERINNERING: null,
        HEEFTBETALINGSHERINNERING: false,
        LEVERADRES: "321 Joske St",
        ORDERID: "ORD125",
        ORDERSTATUS: "GELEVERD",
        USER_ID: null,
        KLANT_ID: 4,
        LEVERANCIER_ID: 1,
        user_bestelling_KLANT_IDTouser: {
          ID: 4,
          DTYPE: "Klant",
          USERNAME: "klant2",
          BEDRIJF_ID: 2,
          bedrijf_user_BEDRIJF_IDTobedrijf: {
            NAAM: "Bedrijf2"
          }
        },
        user_bestelling_LEVERANCIER_IDTouser: {
          ID: 1,
          DTYPE: "Leverancier",
          USERNAME: "leverancier1",
          BEDRIJF_ID: 1,
          bedrijf_user_BEDRIJF_IDTobedrijf: {
            NAAM: "Bedrijf1"
          }
        }
      });
    });

    it("zou 200 en alle bestellingen van leverancier", async () => {
      const response = await request.get(`${url}?paginaNummer=1&ordNr=&standaard=false&aantal=20&leverstatus=&betaald=alle&datum=`).set("Authorization", authHeader);
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(3);

      expect(response.body.items[0]).toEqual({
        ID: 1,
        BEDRAG: 4200,
        BETAALDAG: "2024-04-17T00:00:00.000Z",
        BETALINGSSTATUS: "NIETBETAALD",
        DATUMGEPLAATST: "2024-03-17T00:00:00.000Z",
        DATUMLAATSTEBETALINGSHERINNERING: "2024-04-17T00:00:00.000Z",
        HEEFTBETALINGSHERINNERING: true,
        LEVERADRES: "123 Elm St",
        ORDERID: "ORD123",
        ORDERSTATUS: "INBEHANDELING",
        USER_ID: null,
        KLANT_ID: 4,
        LEVERANCIER_ID: 1,
        user_bestelling_KLANT_IDTouser: {
          ID: 4,
          DTYPE: "Klant",
          USERNAME: "klant2",
          BEDRIJF_ID: 2,
          bedrijf_user_BEDRIJF_IDTobedrijf: {
            NAAM: "Bedrijf2"
          }
        },
        user_bestelling_LEVERANCIER_IDTouser: {
          ID: 1,
          DTYPE: "Leverancier",
          USERNAME: "leverancier1",
          BEDRIJF_ID: 1,
          bedrijf_user_BEDRIJF_IDTobedrijf: {
            NAAM: "Bedrijf1"
          }
        }
      });
      expect(response.body.items[1]).toEqual({
        ID: 3,
        BEDRAG: 1200,
        BETAALDAG: "2024-05-22T00:00:00.000Z",
        BETALINGSSTATUS: "BETAALD",
        DATUMGEPLAATST: "2024-04-22T00:00:00.000Z",
        DATUMLAATSTEBETALINGSHERINNERING: null,
        HEEFTBETALINGSHERINNERING: false,
        LEVERADRES: "789 Maple St",
        ORDERID: "ORD124",
        ORDERSTATUS: "VERZONDEN",
        USER_ID: null,
        KLANT_ID: 4,
        LEVERANCIER_ID: 1,
        user_bestelling_KLANT_IDTouser: {
          ID: 4,
          DTYPE: "Klant",
          USERNAME: "klant2",
          BEDRIJF_ID: 2,
          bedrijf_user_BEDRIJF_IDTobedrijf: {
            NAAM: "Bedrijf2"
          }
        },
        user_bestelling_LEVERANCIER_IDTouser: {
          ID: 1,
          DTYPE: "Leverancier",
          USERNAME: "leverancier1",
          BEDRIJF_ID: 1,
          bedrijf_user_BEDRIJF_IDTobedrijf: {
            NAAM: "Bedrijf1"
          }
        }
      });
      expect(response.body.items[2]).toEqual({
        ID: 4,
        BEDRAG: 1200,
        BETAALDAG: "2024-05-03T00:00:00.000Z",
        BETALINGSSTATUS: "NIETBETAALD",
        DATUMGEPLAATST: "2024-04-03T00:00:00.000Z",
        DATUMLAATSTEBETALINGSHERINNERING: null,
        HEEFTBETALINGSHERINNERING: false,
        LEVERADRES: "321 Joske St",
        ORDERID: "ORD125",
        ORDERSTATUS: "GELEVERD",
        USER_ID: null,
        KLANT_ID: 4,
        LEVERANCIER_ID: 1,
        user_bestelling_KLANT_IDTouser: {
          ID: 4,
          DTYPE: "Klant",
          USERNAME: "klant2",
          BEDRIJF_ID: 2,
          bedrijf_user_BEDRIJF_IDTobedrijf: {
            NAAM: "Bedrijf2"
          }
        },
        user_bestelling_LEVERANCIER_IDTouser: {
          ID: 1,
          DTYPE: "Leverancier",
          USERNAME: "leverancier1",
          BEDRIJF_ID: 1,
          bedrijf_user_BEDRIJF_IDTobedrijf: {
            NAAM: "Bedrijf1"
          }
        }
      });
    });

    it("zou 200 en alle bestellingen in behandeling van leverancier", async () => {
      const response = await request.get(`${url}?paginaNummer=1&ordNr=&standaard=false&aantal=20&leverstatus=INBEHANDELING&betaald=&datum=`).set("Authorization", authHeader);
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(1);

      expect(response.body.items[0]).toEqual({
        ID: 1,
        BEDRAG: 4200,
        BETAALDAG: "2024-04-17T00:00:00.000Z",
        BETALINGSSTATUS: "NIETBETAALD",
        DATUMGEPLAATST: "2024-03-17T00:00:00.000Z",
        DATUMLAATSTEBETALINGSHERINNERING: "2024-04-17T00:00:00.000Z",
        HEEFTBETALINGSHERINNERING: true,
        LEVERADRES: "123 Elm St",
        ORDERID: "ORD123",
        ORDERSTATUS: "INBEHANDELING",
        USER_ID: null,
        KLANT_ID: 4,
        LEVERANCIER_ID: 1,
        user_bestelling_KLANT_IDTouser: {
          ID: 4,
          DTYPE: "Klant",
          USERNAME: "klant2",
          BEDRIJF_ID: 2,
          bedrijf_user_BEDRIJF_IDTobedrijf: {
            NAAM: "Bedrijf2"
          }
        },
        user_bestelling_LEVERANCIER_IDTouser: {
          ID: 1,
          DTYPE: "Leverancier",
          USERNAME: "leverancier1",
          BEDRIJF_ID: 1,
          bedrijf_user_BEDRIJF_IDTobedrijf: {
            NAAM: "Bedrijf1"
          }
        }
      });
    });

    it("zou 200 en alle verzonden bestellingen van leverancier", async () => {
      const response = await request.get(`${url}?paginaNummer=1&ordNr=&standaard=false&aantal=20&leverstatus=VERZONDEN&betaald=&datum=`).set("Authorization", authHeader);
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(1);

      expect(response.body.items[0]).toEqual({
        ID: 3,
        BEDRAG: 1200,
        BETAALDAG: "2024-05-22T00:00:00.000Z",
        BETALINGSSTATUS: "BETAALD",
        DATUMGEPLAATST: "2024-04-22T00:00:00.000Z",
        DATUMLAATSTEBETALINGSHERINNERING: null,
        HEEFTBETALINGSHERINNERING: false,
        LEVERADRES: "789 Maple St",
        ORDERID: "ORD124",
        ORDERSTATUS: "VERZONDEN",
        USER_ID: null,
        KLANT_ID: 4,
        LEVERANCIER_ID: 1,
        user_bestelling_KLANT_IDTouser: {
          ID: 4,
          DTYPE: "Klant",
          USERNAME: "klant2",
          BEDRIJF_ID: 2,
          bedrijf_user_BEDRIJF_IDTobedrijf: {
            NAAM: "Bedrijf2"
          }
        },
        user_bestelling_LEVERANCIER_IDTouser: {
          ID: 1,
          DTYPE: "Leverancier",
          USERNAME: "leverancier1",
          BEDRIJF_ID: 1,
          bedrijf_user_BEDRIJF_IDTobedrijf: {
            NAAM: "Bedrijf1"
          }
        }
      });
    });

    it("zou 200 en alle geleverde bestellingen van leverancier", async () => {
      const response = await request.get(`${url}?paginaNummer=1&ordNr=&standaard=false&aantal=20&leverstatus=GELEVERD&betaald=&datum=`).set("Authorization", authHeader);
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(1);

      expect(response.body.items[0]).toEqual({
        ID: 4,
        BEDRAG: 1200,
        BETAALDAG: "2024-05-03T00:00:00.000Z",
        BETALINGSSTATUS: "NIETBETAALD",
        DATUMGEPLAATST: "2024-04-03T00:00:00.000Z",
        DATUMLAATSTEBETALINGSHERINNERING: null,
        HEEFTBETALINGSHERINNERING: false,
        LEVERADRES: "321 Joske St",
        ORDERID: "ORD125",
        ORDERSTATUS: "GELEVERD",
        USER_ID: null,
        KLANT_ID: 4,
        LEVERANCIER_ID: 1,
        user_bestelling_KLANT_IDTouser: {
          ID: 4,
          DTYPE: "Klant",
          USERNAME: "klant2",
          BEDRIJF_ID: 2,
          bedrijf_user_BEDRIJF_IDTobedrijf: {
            NAAM: "Bedrijf2"
          }
        },
        user_bestelling_LEVERANCIER_IDTouser: {
          ID: 1,
          DTYPE: "Leverancier",
          USERNAME: "leverancier1",
          BEDRIJF_ID: 1,
          bedrijf_user_BEDRIJF_IDTobedrijf: {
            NAAM: "Bedrijf1"
          }
        }
      });
    });

    it("zou 200 en bestellingen geplaatst op 3 april 2024 van leverancier", async () => {
      const response = await request.get(`${url}?paginaNummer=1&ordNr=&standaard=false&aantal=20&leverstatus=&betaald=&datum=2024-04-03`).set("Authorization", authHeader);
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(1);

      expect(response.body.items[0]).toEqual({
        ID: 4,
        BEDRAG: 1200,
        BETAALDAG: "2024-05-03T00:00:00.000Z",
        BETALINGSSTATUS: "NIETBETAALD",
        DATUMGEPLAATST: "2024-04-03T00:00:00.000Z",
        DATUMLAATSTEBETALINGSHERINNERING: null,
        HEEFTBETALINGSHERINNERING: false,
        LEVERADRES: "321 Joske St",
        ORDERID: "ORD125",
        ORDERSTATUS: "GELEVERD",
        USER_ID: null,
        KLANT_ID: 4,
        LEVERANCIER_ID: 1,
        user_bestelling_KLANT_IDTouser: {
          ID: 4,
          DTYPE: "Klant",
          USERNAME: "klant2",
          BEDRIJF_ID: 2,
          bedrijf_user_BEDRIJF_IDTobedrijf: {
            NAAM: "Bedrijf2"
          }
        },
        user_bestelling_LEVERANCIER_IDTouser: {
          ID: 1,
          DTYPE: "Leverancier",
          USERNAME: "leverancier1",
          BEDRIJF_ID: 1,
          bedrijf_user_BEDRIJF_IDTobedrijf: {
            NAAM: "Bedrijf1"
          }
        }
      });
    });

    it("zou 200 en bestelling met ordId 125 van leverancier", async () => {
      const response = await request.get(`${url}?paginaNummer=1&ordNr=125&standaard=false&aantal=20&leverstatus=&betaald=&datum=`).set("Authorization", authHeader);
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(1);

      expect(response.body.items[0]).toEqual({
        ID: 4,
        BEDRAG: 1200,
        BETAALDAG: "2024-05-03T00:00:00.000Z",
        BETALINGSSTATUS: "NIETBETAALD",
        DATUMGEPLAATST: "2024-04-03T00:00:00.000Z",
        DATUMLAATSTEBETALINGSHERINNERING: null,
        HEEFTBETALINGSHERINNERING: false,
        LEVERADRES: "321 Joske St",
        ORDERID: "ORD125",
        ORDERSTATUS: "GELEVERD",
        USER_ID: null,
        KLANT_ID: 4,
        LEVERANCIER_ID: 1,
        user_bestelling_KLANT_IDTouser: {
          ID: 4,
          DTYPE: "Klant",
          USERNAME: "klant2",
          BEDRIJF_ID: 2,
          bedrijf_user_BEDRIJF_IDTobedrijf: {
            NAAM: "Bedrijf2"
          }
        },
        user_bestelling_LEVERANCIER_IDTouser: {
          ID: 1,
          DTYPE: "Leverancier",
          USERNAME: "leverancier1",
          BEDRIJF_ID: 1,
          bedrijf_user_BEDRIJF_IDTobedrijf: {
            NAAM: "Bedrijf1"
          }
        }
      });
    });

    it("zou 200 en alle bestellingen die in behandeling en niet betaald van leverancier", async () => {
      const response = await request.get(`${url}?paginaNummer=1&ordNr=&standaard=false&aantal=20&leverstatus=INBEHANDELING&betaald=NIETBETAALD&datum=`).set("Authorization", authHeader);
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(1);

      expect(response.body.items[0]).toEqual({
        ID: 1,
        BEDRAG: 4200,
        BETAALDAG: "2024-04-17T00:00:00.000Z",
        BETALINGSSTATUS: "NIETBETAALD",
        DATUMGEPLAATST: "2024-03-17T00:00:00.000Z",
        DATUMLAATSTEBETALINGSHERINNERING: "2024-04-17T00:00:00.000Z",
        HEEFTBETALINGSHERINNERING: true,
        LEVERADRES: "123 Elm St",
        ORDERID: "ORD123",
        ORDERSTATUS: "INBEHANDELING",
        USER_ID: null,
        KLANT_ID: 4,
        LEVERANCIER_ID: 1,
        user_bestelling_KLANT_IDTouser: {
          ID: 4,
          DTYPE: "Klant",
          USERNAME: "klant2",
          BEDRIJF_ID: 2,
          bedrijf_user_BEDRIJF_IDTobedrijf: {
            NAAM: "Bedrijf2"
          }
        },
        user_bestelling_LEVERANCIER_IDTouser: {
          ID: 1,
          DTYPE: "Leverancier",
          USERNAME: "leverancier1",
          BEDRIJF_ID: 1,
          bedrijf_user_BEDRIJF_IDTobedrijf: {
            NAAM: "Bedrijf1"
          }
        }
      });
    });

    it("zou 200 en alle bestellingen die in behandeling en betaald van leverancier", async () => {
      const response = await request.get(`${url}?paginaNummer=1&ordNr=&standaard=false&aantal=20&leverstatus=INBEHANDELING&betaald=BETAALD&datum=`).set("Authorization", authHeader);
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(0);
    });

    it("zou 200 en verzonden bestellingen die niet betaald van leverancier", async () => {
      const response = await request.get(`${url}?paginaNummer=1&ordNr=&standaard=false&aantal=20&leverstatus=VERZONDEN&betaald=NIETBETAALD&datum=`).set("Authorization", authHeader);
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(0);
    });

    it("zou 200 en verzonden bestellingen en niet betaald van leverancier", async () => {
      const response = await request.get(`${url}?paginaNummer=1&ordNr=&standaard=false&aantal=20&leverstatus=VERZONDEN&betaald=BETAALD&datum=`).set("Authorization", authHeader);
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(1);

      expect(response.body.items[0]).toEqual({
        ID: 3,
        BEDRAG: 1200,
        BETAALDAG: "2024-05-22T00:00:00.000Z",
        BETALINGSSTATUS: "BETAALD",
        DATUMGEPLAATST: "2024-04-22T00:00:00.000Z",
        DATUMLAATSTEBETALINGSHERINNERING: null,
        HEEFTBETALINGSHERINNERING: false,
        LEVERADRES: "789 Maple St",
        ORDERID: "ORD124",
        ORDERSTATUS: "VERZONDEN",
        USER_ID: null,
        KLANT_ID: 4,
        LEVERANCIER_ID: 1,
        user_bestelling_KLANT_IDTouser: {
          ID: 4,
          DTYPE: "Klant",
          USERNAME: "klant2",
          BEDRIJF_ID: 2,
          bedrijf_user_BEDRIJF_IDTobedrijf: {
            NAAM: "Bedrijf2"
          }
        },
        user_bestelling_LEVERANCIER_IDTouser: {
          ID: 1,
          DTYPE: "Leverancier",
          USERNAME: "leverancier1",
          BEDRIJF_ID: 1,
          bedrijf_user_BEDRIJF_IDTobedrijf: {
            NAAM: "Bedrijf1"
          }
        }
      });
    });

    it("zou 200 en geleverde bestellingen die niet betaald van leverancier", async () => {
      const response = await request.get(`${url}?paginaNummer=1&ordNr=&standaard=false&aantal=20&leverstatus=GELEVERD&betaald=NIETBETAALD&datum=`).set("Authorization", authHeader);
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(1);

      expect(response.body.items[0]).toEqual({
        ID: 4,
        BEDRAG: 1200,
        BETAALDAG: "2024-05-03T00:00:00.000Z",
        BETALINGSSTATUS: "NIETBETAALD",
        DATUMGEPLAATST: "2024-04-03T00:00:00.000Z",
        DATUMLAATSTEBETALINGSHERINNERING: null,
        HEEFTBETALINGSHERINNERING: false,
        LEVERADRES: "321 Joske St",
        ORDERID: "ORD125",
        ORDERSTATUS: "GELEVERD",
        USER_ID: null,
        KLANT_ID: 4,
        LEVERANCIER_ID: 1,
        user_bestelling_KLANT_IDTouser: {
          ID: 4,
          DTYPE: "Klant",
          USERNAME: "klant2",
          BEDRIJF_ID: 2,
          bedrijf_user_BEDRIJF_IDTobedrijf: {
            NAAM: "Bedrijf2"
          }
        },
        user_bestelling_LEVERANCIER_IDTouser: {
          ID: 1,
          DTYPE: "Leverancier",
          USERNAME: "leverancier1",
          BEDRIJF_ID: 1,
          bedrijf_user_BEDRIJF_IDTobedrijf: {
            NAAM: "Bedrijf1"
          }
        }
      });
    });

    it("zou 200 en geleverde bestellingen en betaald van leverancier", async () => {
      const response = await request.get(`${url}?paginaNummer=1&ordNr=&standaard=false&aantal=20&leverstatus=GELEVERD&betaald=BETAALD&datum=`).set("Authorization", authHeader);
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(0);
    });

    it("zou 400 wanneer een verkeerd argument gegeven", async () => {
      const response = await request
        .get(`${url}?paginaNummer=1&ordNr=&standaard=true&aantal=20&leverstatus=&betaald=&datum=&invalid=true`)
        .set("Authorization", authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.query).toHaveProperty("invalid");
    });
  });

  testAuthHeader(() => request.get(url));

  describe("GET /api/bestellingen als klant", () => {
    it("zou 200 en standaard bestellingen van klant", async () => {
      const response = await request.get(`${url}?paginaNummer=1&ordNr=&standaard=true&aantal=20&leverstatus=&betaald=&datum=`).set("Authorization", authHeaderKlant);
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(1);

      expect(response.body.items[0]).toEqual({
        ID: 6,
        BEDRAG: 5600,
        BETAALDAG: "2024-04-16T00:00:00.000Z",
        BETALINGSSTATUS: "BETAALD",
        DATUMGEPLAATST: "2024-03-15T00:00:00.000Z",
        DATUMLAATSTEBETALINGSHERINNERING: "2024-04-16T00:00:00.000Z",
        HEEFTBETALINGSHERINNERING: true,
        LEVERADRES: "654 Xander St",
        ORDERID: "ORD14",
        ORDERSTATUS: "INBEHANDELING",
        USER_ID: null,
        KLANT_ID: 3,
        LEVERANCIER_ID: 2,
        user_bestelling_KLANT_IDTouser: {
          ID: 3,
          DTYPE: "Klant",
          USERNAME: "klant1",
          BEDRIJF_ID: 1,
          bedrijf_user_BEDRIJF_IDTobedrijf: {
            NAAM: "Bedrijf1"
          }
        },
        user_bestelling_LEVERANCIER_IDTouser: {
          ID: 2,
          DTYPE: "Leverancier",
          USERNAME: "leverancier2",
          BEDRIJF_ID: 2,
          bedrijf_user_BEDRIJF_IDTobedrijf: {
            NAAM: "Bedrijf2"
          }
        }

      });

    });
  });

  testAuthHeader(() => request.get(url));

  describe("GET /api/bestellingen/:id", () => {
    it("zou 200 en de bestelling", async () => {
      const response = await request
        .get(`${url}/1`)
        .set("Authorization", authHeader);

      expect(response.statusCode).toBe(200);

      expect(response.body).toEqual({
        ID: 1,
        BEDRAG: 4200,
        BETAALDAG: "2024-04-17T00:00:00.000Z",
        BETALINGSSTATUS: "NIETBETAALD",
        DATUMGEPLAATST: "2024-03-17T00:00:00.000Z",
        DATUMLAATSTEBETALINGSHERINNERING: "2024-04-17T00:00:00.000Z",
        HEEFTBETALINGSHERINNERING: true,
        LEVERADRES: "123 Elm St",
        ORDERID: "ORD123",
        ORDERSTATUS: "INBEHANDELING",
        USER_ID: null,
        KLANT_ID: 4,
        LEVERANCIER_ID: 1,
        bestelling_product: [
          {
            AANTAL: 3,
            price: 400,
            product: {
              EENHEIDSPRIJS: 400,
              NAAM: "Tablet",
            },
          },
          {
            AANTAL: 5,
            price: 600,
            product: {
              EENHEIDSPRIJS: 600,
              NAAM: "Smartphone",
            },
          },
        ],
        user_bestelling_KLANT_IDTouser: {
          USERNAME: "klant2",
          bedrijf_user_BEDRIJF_IDTobedrijf: { NAAM: "Bedrijf2" },
        },
        user_bestelling_LEVERANCIER_IDTouser: {
          USERNAME: "leverancier1",
          bedrijf_user_BEDRIJF_IDTobedrijf: { NAAM: "Bedrijf1" },
        },
      });
    });

    it("zou 404 bij aanvragen onbestaande bestelling", async () => {
      const response = await request
        .get(`${url}/24`)
        .set("Authorization", authHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: "NOT_FOUND",
        message: "Er bestaat geen bestelling met id 24",
        details: {
          ID: 24,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

    it("zou 400 met ongeldig bestelling id", async () => {
      const response = await request
        .get(`${url}/invalid`)
        .set("Authorization", authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.params).toHaveProperty("id");
    });
  });

  testAuthHeader(() => request.get(`${url}/1`));


});

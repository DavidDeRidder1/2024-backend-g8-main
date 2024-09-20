# Back-end Software Development Project || 

## b2b portaal voor Delaware
dit is het project van groep 8 voor het vak SDP2. Het gaat over een app waar bedrijven zich zowel als klant en leverancier kunnen inloggen en bestellingen kunnen plaatsen, verzenden en opvolgen.

Het backend heeft als taak client request te ontvangen en behandelen, de verbinding met de database te beheren, authenticatie en verificatie van de user, het verzenden van emails en splitsen van domeinlagen.


Het back-end word grotendeel gemaakt uit:
-  [Node.js/Koa](https://www.cypress.io/)
-  [Prisma](https://www.prisma.io/)
-  [Argon2](https://argon2.online/)
-  [jsonwebtoken](https://jwt.io/)
-  [nodemailer](https://nodemailer.com/)
-  [winston](https://github.com/winstonjs/winston)







## Table of Contents
- [Installation](#installation)
- [Contact](#contact)



## Installation
1. Clone de repository
2. `cd yourproject`
Hier is het belangrijk om enkel te werken via node package manager.
3. `npm install`
4. de .env en .env.test files correct te configureren.
5. u start het project via de commando: 
`npm start`
6. De testen uitvoeren:
Om de backend testen uit te voeren moet er eerst een test databank aangemaakt worden, waarvan de gegevens in een .env.test bestand ingevuld moeten worden. 
Migrations uitvoeren op test databank: `npx test:prisma:migrate`
Testen uitvoeren: `npm run test:with-seed` 
 

## Contact

Alexander Verbeke - alexander.verbeke@student.hogent.be
David deridder - david.deridder@student.hogent.be
Joris Yangsheng Xu - Joris.xu@student.hogent.be
Pushwant Sagoo - pushwant.sagoo@student.hogent.be
Sujan Sapkota - sujan.sapkota@student.hogent.be 







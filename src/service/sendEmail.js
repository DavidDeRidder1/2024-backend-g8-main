const nodemailer = require('nodemailer');




async function sendEmail(bestelling) {


    
    const transporter = nodemailer.createTransport({
        host: 'smtp.office365.com',
        port: 587,
        secure: false, 
        auth: {
          user: 'delawaregroupghent@outlook.com', 
          pass: 'testww123' 
        }
      });


    try {

        const email = `
            Subject: Invoice [${bestelling.ORDERID}] - Due [Due Date]

            Dear [${bestelling.user_bestelling_KLANT_IDTouser.bedrijf_user_BEDRIJF_IDTobedrijf.NAAM}],

            Beste u hebt een openstaande rekening.


            **Invoice Details:**
            - **factuur: :** 
            - **datum:** 
            - **totaal:** 
            - **te betalen tegen:** 

            Gelieve dit zo snel mogelijk in orde te brengen.

            **bankrekening**
            - **Belfius:** [be123456789]
            

            met vragen of klachten kunt u antwoorden op deze email. 

            

            Met vriendelijke groeten,
            ${bestelling.user_bestelling_LEVERANCIER_IDTouser}

            `;

        await transporter.sendMail({
            from: 'delawareGroupGhent@outlook.com', //later kunnen we ook aliassen toepassen ?
            to: "joris.xu@student.hogent.be", //moet email van klant worden
            subject: 'Betalingsherinnering OrderIDXYZ',  //string
            text:  email       
        });
        return 'email sent succesfully';
    } catch (error) {
        throw new Error('sendEmail Service folder yeaaaas');
    }
}

module.exports =  {
    sendEmail,
};


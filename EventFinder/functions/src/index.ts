// import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp(functions.config().firebase);

const stripe = require('stripe')(functions.config().stripe.testkey)

exports.stripeCharge = functions.database
  .ref('/payments/{userId}/userPayments/{paymentId}')
  .onCreate((event: any) => {
    console.log("Virker det?");

    const snapshot: any = admin.database().ref('/payments/{userId}/userPayments/{paymentId}').push({test: "Hej med dig"});
    console.log(snapshot);
  });

exports.testFunc = functions.database.ref('/payments/{userId}/userPayments/{paymentId}')
  .onWrite((snapshot:any, context:any) => {
    console.log('Hmm');
    const newValues = {test: "Functions er sjovt"};
    return snapshot.ref.set(newValues);
  });

  /*
  exports.stripeCharge = functions.database
  .ref('/payments/{userId}/userPayments/{paymentId}')
  .onCreate((event: any) => {
    console.log("Virker det?");
    const payment = event.data.val();
    const userId = event.params.userId;
    const paymentId = event.params.paymentId;

    if (!payment || payment.charge) return;

    return admin.database()
      .ref(`/users/${userId}`)
      .once('value')
      .then((snapshot: any) => {
        return snapshot.val();
      })
      .then((customer: any) => {
        const amount = payment.amount;
        const idempotency_key = paymentId;
        const source = payment.token.id;
        const currency = 'DDK';
        const charge = {amount, currency, source};

        return stripe.charges.create(charge, { idempotency_key });
      })
      .then((charge: any) => {
        admin.database()
          .ref(`/payments/${userId}/${paymentId}/charge`)
          .set(charge)
      })
  });
  */

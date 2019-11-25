const functions = require("firebase-functions");
const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");
const stripe = require("stripe")("sk_test_4eIsswkxkyrNLFdG62jHrkG400VbeMKRGP");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://eventfinder-8605f.firebaseio.com"
});

const db = admin.firestore();


exports.createStripeCharge = functions.region('europe-west2')
  .firestore.document('/payments/{userId}/userPayments/{paymentId}')
  .onCreate((change:any, context:any) => {
    // Get all the data for the payment from firestore.
    const payment = change.data();

    // Get userID and paymentID from the parameters of the function.
    const userId = context.params.userId;
    const paymentId = context.params.paymentId;

    // If no data exists in the document or if a charge object already exists, return.
    if (!payment || payment.stripeCharge) return null;

    // Idempotency key is used to ensure that no payment can be made with the same payment ID.
    const idempotency_key = paymentId;
    const amount = payment.amount;
    const source = payment.token.id;
    const currency = 'DKK';
    const receipt_email = payment.token.email;
    const charge = {amount, currency, source, receipt_email};

    // Creates the Stripe charge.
    return stripe.charges.create(charge, { idempotency_key })
      .then((chargeSnap: any) => {
        // When the charge has been completed, save the charge object in firestore.
        admin.firestore()
          .doc(`/payments/${userId}/userPayments/${paymentId}`)
          .set({stripeCharge: chargeSnap}, {merge: true});
      })
  });

exports.updatePreferences = functions
  .region("europe-west2")
  .firestore.document("/payments/{userId}/userPayments/{paymentId}")
  .onCreate((change: any, context: any) => {
    const payment = change.data();
    const userId = context.params.userId;
    const batch = db.batch();
    const recommenderRef = db.collection("recommender").doc(userId);

    return db
      .collection("events")
      .doc(payment.eventId)
      .get()
      .then((snapshot: any) => {
        const genre = snapshot.data().genre;
        const atmosphere = snapshot.data().atmosphere;
        const dresscode = snapshot.data().dresscode;
        const allElements = genre.concat(atmosphere);
        allElements.push(dresscode);

        allElements.forEach(function(element: any) {
          const name = element.toLowerCase();
          batch.update(
            recommenderRef,
            name,
            admin.firestore.FieldValue.increment(1)
          );
        });

        return batch.commit().then(function() {
          return null;
        });
      });
  });

exports.recommender = functions
  .region("europe-west2")
  .firestore.document("/recommender/{userId}")
  .onUpdate(async (change: any, context: any) => {
    const preferences = change.after.data();
    const userId = context.params.userId;
    const batch = db.batch();
    const userRef = db.collection("users/").doc(userId);
    let total = 0;

    for (const key in preferences) {
      const value = preferences[key];
      total += value;
    }
    const weightMap = new Map();
    // let mapString = '{weightMap: hello}';


    const store: Record<string, Number> = {};

    for (const key in preferences) {
      const weightValue = preferences[key] / total;
      store.key = weightValue
      // data['weights'][key] = weightValue;
      weightMap.set(key, weightValue)
      // mapString += `'${key}' : '${weightValue}', `
    }

    // mapString = mapString.substring(0, mapString.length - 2);
    // mapString += '}}'
    batch.set(userRef, store, {merge: true});

    let eventScoreMap: any = [];
    const eventsSnaphot = await db.collection(`events`).get();
    const events = eventsSnaphot.docs;
    events.forEach((doc: any) => {
      let score = 0;

      const event = doc.data();
      const genre = event.genre;
      const atmosphere = event.atmosphere;
      const dresscode = event.dresscode;
      const allElements = genre.concat(atmosphere);
      allElements.push(dresscode);

      // Caculates score for an event
      allElements.forEach(function(element: any) {
        const name = element.toLowerCase();
        if (weightMap.has(name)) {
          score += weightMap.get(name) / allElements.length;
        }
      });

      eventScoreMap.push([event.uid, score])
    });

    eventScoreMap = eventScoreMap.sort((a: any, b: any) => b[1] - a[1]);

    const recommenedEvents = [];
    for (let index = 0; index < 5; index++) {
      const element = eventScoreMap[index];
      recommenedEvents.push(element[0]);
    }

    batch.update(userRef, 'recommended', recommenedEvents);


    return batch.commit();
  });

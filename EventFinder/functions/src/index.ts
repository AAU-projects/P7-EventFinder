const functions = require('firebase-functions');
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');
const stripe = require('stripe')('sk_test_4eIsswkxkyrNLFdG62jHrkG400VbeMKRGP');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://eventfinder-8605f.firebaseio.com'
});

const db = admin.firestore();

exports.onFeedbackCreate = functions.region('europe-west2')
  .firestore.document('feedback/{id}').onCreate((change: any, context: any) => {
    const feedback = change.data();

    const organizationId = feedback.organizationuid;
    const rating = feedback.rating;

    return admin.firestore().runTransaction((t: any) => {
      return t.get(admin.firestore().doc(`/organizations/${organizationId}`))
        .then((doc: any) => {
          if (doc.exists) {
            const data = doc.data();

            const currentSum = data['sumOfRatings'] ? data['sumOfRatings'] : 0;
            const currentNum = data['numOfRatings'] ? data['numOfRatings'] : 0;
            const newSum = currentSum + rating;
            const newNum = currentNum + 1;
            const newRating = newSum / newNum;

            admin.firestore().doc(`/organizations/${organizationId}`).set({
              sumOfRatings: newSum,
              numOfRatings: newNum,
              rating: newRating
            }, { merge: true })
          }
        });
    });
  });

exports.onFeedbackUpdate = functions.region('europe-west2')
  .firestore.document('feedback/{id}').onUpdate((change: any, context: any) => {
    const feedbackBefore = change.before.data();
    const feedbackAfter = change.after.data();

    const organizationId = feedbackAfter.organizationuid;
    const ratingOld = feedbackBefore.rating;
    const ratingNew = feedbackAfter.rating;

    return admin.firestore().runTransaction((t: any) => {
      return t.get(admin.firestore().doc(`/organizations/${organizationId}`))
        .then((doc: any) => {
          if (doc.exists) {
            const data = doc.data();

            const currentSum = data['sumOfRatings'] ? data['sumOfRatings'] : 0;
            const currentNum = data['numOfRatings'] ? data['numOfRatings'] : 0;
            const newSum = (currentSum - ratingOld) + ratingNew;
            const newRating = newSum / currentNum;

            admin.firestore().doc(`/organizations/${organizationId}`).set({
              sumOfRatings: newSum,
              rating: newRating
            }, { merge: true })
          }
        });
    });
  });

exports.onFeedbackDelete = functions.region('europe-west2')
  .firestore.document('feedback/{id}').onDelete((change: any, context: any) => {
    const feedback = change.data();

    const organizationId = feedback.organizationuid;
    const rating = feedback.rating;

    return admin.firestore().runTransaction((t: any) => {
      return t.get(admin.firestore().doc(`/organizations/${organizationId}`))
        .then((doc: any) => {
          if (doc.exists) {
            const data = doc.data();

            const currentSum = data['sumOfRatings'] ? data['sumOfRatings'] : 0;
            const currentNum = data['numOfRatings'] ? data['numOfRatings'] : 0;
            const newSum = currentSum - rating;
            const newNum = currentNum - 1;
            const newRating = newSum / newNum;

            admin.firestore().doc(`/organizations/${organizationId}`).set({
              sumOfRatings: newSum,
              numOfRatings: newNum,
              rating: newRating
            }, { merge: true })
          }
        });
    });
  });

exports.createStripeCharge = functions
  .region('europe-west2')
  .firestore.document('/payments/{userId}/userPayments/{paymentId}')
  .onCreate((change: any, context: any) => {
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
    const charge = { amount, currency, source, receipt_email };

    // Creates the Stripe charge.
    return stripe.charges
      .create(charge, { idempotency_key })
      .then((chargeSnap: any) => {
        // When the charge has been completed, save the charge object in firestore.
        admin
          .firestore()
          .doc(`/payments/${userId}/userPayments/${paymentId}`)
          .set({ stripeCharge: chargeSnap }, { merge: true });
      });
  });

exports.updatePreferences = functions
  .region('europe-west2')
  .firestore.document('/payments/{userId}/userPayments/{paymentId}')
  .onCreate((change: any, context: any) => {
    const payment = change.data();
    const userId = context.params.userId;
    const batch = db.batch();
    const recommenderRef = db.collection('recommender').doc(userId);

    return db
      .collection('events')
      .doc(payment.eventId)
      .get()
      .then((snapshot: any) => {
        const genre = snapshot.data().genre;
        const atmosphere = snapshot.data().atmosphere;
        const dresscode = snapshot.data().dresscode;
        const allElements = genre.concat(atmosphere);
        allElements.push(dresscode);

        allElements.forEach(function (element: any) {
          const name = element.toLowerCase();
          batch.update(
            recommenderRef,
            name,
            admin.firestore.FieldValue.increment(1)
          );
        });

        return batch.commit().then(function () {
          return null;
        });
      });
  });

exports.onPaymentCreateTemp = functions.region('europe-west2')
.firestore.document('paymentsTemp/{paymentId}').onCreate((change: any, context: any) => {
  const paymentId = context.params.paymentId;

  return Promise.all([setTimeout(() => {
    const paymentRef = db.collection('paymentsTemp').doc(paymentId);
    return paymentRef.get().then((snapshot: any) => {
      if (snapshot.exists) {
        const eventRef = db.collection('events').doc(snapshot.data().eventId)

        eventRef.get().then((document: any) => {
          const ticketNotSold = document.data().ticketsSold - 1;
          eventRef.update({ticketsSold: ticketNotSold})
        });
        paymentRef.delete();
      }
    });
  }, 10000)]).then(() => {
    return true;
  }); // 30 seconds delay
});

exports.recommender = functions
  .region('europe-west2')
  .firestore.document('/recommender/{userId}')
  .onUpdate(async (change: any, context: any) => {
    return await updateRecommenderValues(change, context, true);
  });

exports.recommender = functions
  .region('europe-west2')
  .firestore.document('/recommender/{userId}')
  .onCreate(async (change: any, context: any) => {
    return await updateRecommenderValues(change, context, false);
  });


async function updateRecommenderValues(change: any, context: any, updated: boolean) {
  let preferences;
  if (updated) {
    preferences = change.after.data();
  } else {
    preferences = change.data();
  }
  const userId = context.params.userId;
  const batch = db.batch();
  const userRef = db.collection('users/').doc(userId);
  let total = 0;
  for (const key in preferences) {
    const value = preferences[key];
    total += value;
  }
  const weightMap: {
    [key: string]: Number;
  } = {};
  for (const key in preferences) {
    const weightValue = preferences[key] / total;
    weightMap[key] = weightValue;
  }
  batch.set(userRef, { recommendedWeights: weightMap }, { merge: true });
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
    allElements.forEach(function (element: any) {
      const name = element.toLowerCase();
      if (name in weightMap) {
        score += Number(weightMap[name]) / allElements.length;
      }
    });
    eventScoreMap.push([event.uid, score]);
  });
  eventScoreMap = eventScoreMap.sort((a: any, b: any) => b[1] - a[1]);
  const recommenedEvents = [];
  for (let index = 0; index < 5; index++) {
    const element = eventScoreMap[index];
    recommenedEvents.push(element[0]);
  }
  batch.update(userRef, 'recommended', recommenedEvents);
  return batch.commit();
}




const functions = require('firebase-functions');
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');
const stripe = require('stripe')('sk_test_4eIsswkxkyrNLFdG62jHrkG400VbeMKRGP')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://eventfinder-8605f.firebaseio.com'
});

exports.onFeedbackCreate = functions.region('europe-west2')
  .firestore.document('feedback/{id}').onCreate((change:any, context:any) => {
    const feedback = change.data();

    const organizationId = feedback.organizationuid;
    const rating = feedback.rating;

    return admin.firestore().doc(`/organizations/${organizationId}`).get().then((doc: any) => {
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
        }, {merge: true})
      }
    });
  });

exports.onFeedbackUpdate = functions.region('europe-west2')
  .firestore.document('feedback/{id}').onUpdate((change: any, context: any) => {
    const feedbackBefore = change.before.data();
    const feedbackAfter = change.after.data();

    const organizationId = feedbackAfter.organizationuid;
    const ratingOld = feedbackBefore.rating;
    const ratingNew = feedbackAfter.rating;

    return admin.firestore().doc(`/organizations/${organizationId}`).get().then((doc: any) => {
      if (doc.exists) {
        const data = doc.data();

        const currentSum = data['sumOfRatings'] ? data['sumOfRatings'] : 0;
        const currentNum = data['numOfRatings'] ? data['numOfRatings'] : 0;
        const newSum = (currentSum - ratingOld) + ratingNew;
        const newRating = newSum / currentNum;

        admin.firestore().doc(`/organizations/${organizationId}`).set({
          sumOfRatings: newSum,
          rating: newRating
        }, {merge: true})
      }
    });
  });

exports.onFeedbackDelete = functions.region('europe-west2')
  .firestore.document('feedback/{id}').onDelete((change: any, context: any) => {
    const feedback = change.data();

    const organizationId = feedback.organizationuid;
    const rating = feedback.rating;

    return admin.firestore().doc(`/organizations/${organizationId}`).get().then((doc: any) => {
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
        }, {merge: true})
      }
    });
  });

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

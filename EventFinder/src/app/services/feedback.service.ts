import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Feedback } from '../models/feedback.model';
import { reduce, map, tap, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private firestore: AngularFirestore) { }

  addFeedback(feedback: Feedback) {
    const id = this.firestore.createId();
    const feedbackRef = this.firestore.collection('feedback').doc<Feedback>(id);
    feedback.uid = id;
    feedbackRef.set(feedback);

    return id;
  }

  deleteFeedback(feedbackId: string) {
    this.firestore.collection('feedback').doc(feedbackId).delete();
  }

  updateFeedback(feedbackId: string, rating: number, review: string, time: Date) {
    this.firestore.collection('feedback').doc(feedbackId)
      .set({rating, review, edited: time.toISOString()}, {merge: true});
  }

  getFeedbackFromUser(userid: string, limit = 5, startafter?: string) {
    return this.getFeedback('useruid', userid, limit, startafter);
  }

  getFeedbackFromOrganization(organizationid: string, limit = 5, startafter?: string) {
    return this.getFeedback('organizationuid', organizationid, limit, startafter);
  }

  getFeedbackFromEvent(eventuid, limit = 5, startafter?: string) {
    return this.getFeedback('eventuid', eventuid, limit, startafter);
  }

  private getFeedback(field, value, limit = 5, startAt?: string) {
    if (limit === 0) {
      return this.firestore.collection<Feedback>('feedback', ref => ref.orderBy('created', 'desc').where(field, '==', value))
        .valueChanges();
    } else {
      return this.getFeedbackFromFirebase(field, value, limit, startAt);
    }
  }

  private getFeedbackFromFirebase(field, value, limit, startAt?: string) {
    if (startAt) {
      return this.firestore.collection<Feedback>('feedback', ref => ref.orderBy('created', 'desc')
        .where(field, '==', value)
        .startAt(startAt)
        .limit(limit))
        .valueChanges();
    } else {
      return this.firestore.collection<Feedback>('feedback', ref => ref.orderBy('created', 'desc')
        .where(field, '==', value)
        .limit(limit))
        .valueChanges();
    }
  }
}

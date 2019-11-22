import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Feedback } from '../models/feedback.model';

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

  getFeedbackFromUser(userid: string, limit = 5, startafter?: string) {
    return this.getFeedback('useruid', userid, limit, startafter);
  }

  getFeedbackFromOrganization(organizationid: string, limit = 5, startafter?: string) {
    return this.getFeedback('organizationuid', organizationid, limit, startafter);
  }

  getFeedbackFromEvent(eventuid, limit = 5, startafter?: string) {
    return this.getFeedback('eventuid', eventuid, limit, startafter);
  }

  private getFeedback(field, value, limit = 5, startAfter?: string) {
    if (startAfter) {
      return this.firestore.collection<Feedback>('feedback', ref => ref.orderBy('created', 'desc')
        .startAfter(startAfter)
        .where(field, '==', value)
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

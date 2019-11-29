import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class RecommenderService {

  constructor(private firestore: AngularFirestore) { }

  getRecommendedFromUserUid(uid) {
    return this.firestore.collection('recommender').doc(uid).valueChanges();
  }
}


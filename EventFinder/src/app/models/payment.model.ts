export interface Payment {
  eventId: string;
  stripeToken: string;
  userId: string;
  paymentDate: Date;
}

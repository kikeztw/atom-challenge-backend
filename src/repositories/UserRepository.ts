import { Firestore, FieldValue } from 'firebase-admin/firestore';
import { User } from '../types';

export class UserRepository {
  private db: Firestore;
  private collection = 'users';

  constructor(db: Firestore) {
    this.db = db;
  }

  async findByEmail(email: string): Promise<User | null> {
    const snapshot = await this.db
      .collection(this.collection)
      .where('email', '==', email.toLowerCase().trim())
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    const data = doc.data();
    
    return {
      id: doc.id,
      email: data.email,
      createdAt: data.createdAt.toDate(),
    };
  }

  async create(email: string): Promise<User> {
    const normalizedEmail = email.toLowerCase().trim();
    
    const docRef = await this.db.collection(this.collection).add({
      email: normalizedEmail,
      createdAt: FieldValue.serverTimestamp(),
    });

    const doc = await docRef.get();
    const data = doc.data();

    if (!data) {
      throw new Error('Failed to create user');
    }

    return {
      id: doc.id,
      email: data.email,
      createdAt: data.createdAt.toDate(),
    };
  }

  async findById(id: string): Promise<User | null> {
    const doc = await this.db.collection(this.collection).doc(id).get();

    if (!doc.exists) {
      return null;
    }

    const data = doc.data();
    if (!data) {
      return null;
    }

    return {
      id: doc.id,
      email: data.email,
      createdAt: data.createdAt.toDate(),
    };
  }
}

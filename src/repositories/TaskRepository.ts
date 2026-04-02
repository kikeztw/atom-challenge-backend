import { Firestore, FieldValue } from 'firebase-admin/firestore';
import { Task, CreateTaskDTO, UpdateTaskDTO } from '../types';

export class TaskRepository {
  private db: Firestore;
  private collection = 'tasks';

  constructor(db: Firestore) {
    this.db = db;
  }

  async findByUserId(userId: string): Promise<Task[]> {
    const snapshot = await this.db
      .collection(this.collection)
      .where('userId', '==', userId)
      .get();

    const tasks = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        title: data.title,
        description: data.description,
        completed: data.completed,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      };
    });

    return tasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async create(taskData: CreateTaskDTO): Promise<Task> {
    const docRef = await this.db.collection(this.collection).add({
      userId: taskData.userId,
      title: taskData.title,
      description: taskData.description || '',
      completed: false,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    const doc = await docRef.get();
    const data = doc.data();

    if (!data) {
      throw new Error('Failed to create task');
    }

    return {
      id: doc.id,
      userId: data.userId,
      title: data.title,
      description: data.description,
      completed: data.completed,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    };
  }

  async update(id: string, taskData: UpdateTaskDTO): Promise<Task | null> {
    const docRef = this.db.collection(this.collection).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return null;
    }

    const updateData: Record<string, unknown> = {
      ...taskData,
      updatedAt: FieldValue.serverTimestamp(),
    };

    await docRef.update(updateData);

    const updatedDoc = await docRef.get();
    const data = updatedDoc.data();

    if (!data) {
      return null;
    }

    return {
      id: updatedDoc.id,
      userId: data.userId,
      title: data.title,
      description: data.description,
      completed: data.completed,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    };
  }

  async delete(id: string): Promise<boolean> {
    const docRef = this.db.collection(this.collection).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return false;
    }

    await docRef.delete();
    return true;
  }

  async findById(id: string): Promise<Task | null> {
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
      userId: data.userId,
      title: data.title,
      description: data.description,
      completed: data.completed,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    };
  }
}

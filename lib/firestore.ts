import { getFirestore, collection } from 'firebase/firestore';
import { app } from './firebase';
import { heistConverter, COLLECTIONS } from '@/types/firestore';

export const db = getFirestore(app);

export const heistsCollection = collection(db, COLLECTIONS.HEISTS).withConverter(heistConverter);

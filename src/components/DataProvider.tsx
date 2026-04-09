import { createContext, useContext, useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Scraper, Lead } from '../types';
import { useAuth } from './AuthProvider';
import { useScraperEngine } from '../hooks/useScraperEngine';

interface DataContextType {
  scrapers: Scraper[];
  leads: Lead[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [scrapers, setScrapers] = useState<Scraper[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    if (!user) return;

    const scrapersQuery = query(collection(db, 'scrapers'), where('userId', '==', user.uid));
    const unsubscribeScrapers = onSnapshot(scrapersQuery, (snapshot) => {
      const data: Scraper[] = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as Scraper);
      });
      setScrapers(data);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'scrapers');
    });

    const leadsQuery = query(collection(db, 'leads'), where('userId', '==', user.uid));
    const unsubscribeLeads = onSnapshot(leadsQuery, (snapshot) => {
      const data: Lead[] = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as Lead);
      });
      data.sort((a, b) => {
        const timeA = a.createdAt?.toMillis?.() || 0;
        const timeB = b.createdAt?.toMillis?.() || 0;
        return timeB - timeA;
      });
      setLeads(data);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'leads');
    });

    return () => {
      unsubscribeScrapers();
      unsubscribeLeads();
    };
  }, [user]);

  // Run the engine globally so it doesn't stop when navigating
  useScraperEngine(scrapers);

  return (
    <DataContext.Provider value={{ scrapers, leads }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

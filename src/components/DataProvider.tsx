import React, { createContext, useContext, useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, limit, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Scraper, Lead, SystemLog } from '../types';
import { useAuth } from './AuthProvider';

interface DataContextType {
  scrapers: Scraper[];
  leads: Lead[];
  logs: SystemLog[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthorized } = useAuth();
  const [scrapers, setScrapers] = useState<Scraper[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [logs, setLogs] = useState<SystemLog[]>([]);

  useEffect(() => {
    if (!user || !isAuthorized) return;

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

    const leadsQuery = query(
      collection(db, 'leads'), 
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(250)
    );
    const unsubscribeLeads = onSnapshot(leadsQuery, (snapshot) => {
      const data: Lead[] = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as Lead);
      });
      // Sorting is still fine here, but now it's correctly fetching the latest 250 leads
      data.sort((a, b) => {
        const timeA = a.createdAt?.toMillis?.() || 0;
        const timeB = b.createdAt?.toMillis?.() || 0;
        return timeB - timeA;
      });
      setLeads(data);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'leads');
      console.warn("If you see an index error above, click the provided link to build the composite index.");
    });

    const logsQuery = query(
      collection(db, 'logs'), 
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(250)
    );
    const unsubscribeLogs = onSnapshot(logsQuery, (snapshot) => {
      const data: SystemLog[] = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as SystemLog);
      });
      data.sort((a, b) => {
        const timeA = a.createdAt?.toMillis?.() || 0;
        const timeB = b.createdAt?.toMillis?.() || 0;
        return timeB - timeA;
      });
      setLogs(data);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'logs');
      console.warn("If you see an index error above, click the provided link to build the composite index.");
    });

    return () => {
      unsubscribeScrapers();
      unsubscribeLeads();
      unsubscribeLogs();
    };
  }, [user]);

  return (
    <DataContext.Provider value={{ scrapers, leads, logs }}>
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

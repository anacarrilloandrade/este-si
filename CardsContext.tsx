import React, { createContext, useContext, useState, useCallback } from 'react';
import type { CreditCard, CardBrand } from '@/types';
import { 
  generateMultipleCards, 
  generateTestCards,
  validateLuhn,
  detectCardBrand 
} from '@/utils/luhn';

interface CardsContextType {
  cards: CreditCard[];
  isGenerating: boolean;
  generateCards: (count?: number, brand?: CardBrand, first12Digits?: string, expiryMonth?: string, expiryYear?: string) => CreditCard[];
  generateTestSet: () => CreditCard[];
  removeCard: (id: string) => void;
  clearCards: () => void;
  updateCard: (id: string, updates: Partial<CreditCard>) => void;
  validateCard: (cardNumber: string) => boolean;
  getCardBrand: (cardNumber: string) => CardBrand;
  getValidCards: () => CreditCard[];
  exportCards: () => string;
  selectedCards: Set<string>;
  setSelectedCards: React.Dispatch<React.SetStateAction<Set<string>>>;
  toggleCardSelection: (cardId: string) => void;
  selectAllCards: () => void;
  deselectAllCards: () => void;
}

const CardsContext = createContext<CardsContextType | undefined>(undefined);

export function CardsProvider({ children }: { children: React.ReactNode }) {
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());

  const generateCards = useCallback((
    count: number = 10,
    brand: CardBrand = 'visa',
    first12Digits?: string,
    expiryMonth?: string,
    expiryYear?: string
  ): CreditCard[] => {
    setIsGenerating(true);
    
    try {
      const newCards = generateMultipleCards(count, brand, first12Digits, expiryMonth, expiryYear);
      setCards(prev => [...prev, ...newCards]);
      // Auto-seleccionar las nuevas tarjetas
      setSelectedCards(prev => {
        const newSet = new Set(prev);
        newCards.forEach(card => newSet.add(card.id));
        return newSet;
      });
      return newCards;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const generateTestSet = useCallback((): CreditCard[] => {
    setIsGenerating(true);
    
    try {
      const testCards = generateTestCards();
      setCards(prev => [...prev, ...testCards]);
      // Auto-seleccionar las nuevas tarjetas
      setSelectedCards(prev => {
        const newSet = new Set(prev);
        testCards.forEach(card => newSet.add(card.id));
        return newSet;
      });
      return testCards;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const removeCard = useCallback((id: string) => {
    setCards(prev => prev.filter(card => card.id !== id));
    setSelectedCards(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  }, []);

  const clearCards = useCallback(() => {
    setCards([]);
    setSelectedCards(new Set());
  }, []);

  const updateCard = useCallback((id: string, updates: Partial<CreditCard>) => {
    setCards(prev => prev.map(card => 
      card.id === id ? { ...card, ...updates } : card
    ));
  }, []);

  const validateCard = useCallback((cardNumber: string): boolean => {
    return validateLuhn(cardNumber);
  }, []);

  const getCardBrand = useCallback((cardNumber: string): CardBrand => {
    return detectCardBrand(cardNumber);
  }, []);

  const getValidCards = useCallback((): CreditCard[] => {
    return cards.filter(card => validateLuhn(card.number));
  }, [cards]);

  const exportCards = useCallback((): string => {
    return JSON.stringify(cards, null, 2);
  }, [cards]);

  const toggleCardSelection = useCallback((cardId: string) => {
    setSelectedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  }, []);

  const selectAllCards = useCallback(() => {
    setSelectedCards(new Set(cards.map(c => c.id)));
  }, [cards]);

  const deselectAllCards = useCallback(() => {
    setSelectedCards(new Set());
  }, []);

  return (
    <CardsContext.Provider value={{
      cards,
      isGenerating,
      generateCards,
      generateTestSet,
      removeCard,
      clearCards,
      updateCard,
      validateCard,
      getCardBrand,
      getValidCards,
      exportCards,
      selectedCards,
      setSelectedCards,
      toggleCardSelection,
      selectAllCards,
      deselectAllCards
    }}>
      {children}
    </CardsContext.Provider>
  );
}

export function useCardsContext() {
  const context = useContext(CardsContext);
  if (context === undefined) {
    throw new Error('useCardsContext must be used within a CardsProvider');
  }
  return context;
}

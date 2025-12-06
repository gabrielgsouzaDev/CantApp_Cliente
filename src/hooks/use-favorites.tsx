
'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { type Product } from '@/lib/data';

// Define o que será exposto pelo nosso contexto
type FavoritesContextType = {
  favorites: Product[];
  addFavorite: (product: Product) => void;
  removeFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (product: Product) => void;
  favoritesCount: number;
};

// Chave para salvar/ler do localStorage
const FAVORITES_STORAGE_KEY = 'canteen-favorites';

// Cria o contexto com um valor padrão inicial
const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// Componente Provedor que encapsulará nossa aplicação
export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<Product[]>([]);

  // Efeito para carregar os favoritos do localStorage quando o componente montar
  useEffect(() => {
    try {
      const savedFavorites = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (error) {
      console.error('Falha ao carregar favoritos do localStorage:', error);
    }
  }, []);

  // Efeito para salvar os favoritos no localStorage sempre que eles forem alterados
  useEffect(() => {
    try {
      window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (error)
    {
      console.error('Falha ao salvar favoritos no localStorage:', error);
    }
  }, [favorites]);

  const addFavorite = useCallback((product: Product) => {
    setFavorites(prevFavorites => {
      // Evita adicionar duplicados
      if (prevFavorites.some(fav => fav.id === product.id)) {
        return prevFavorites;
      }
      return [...prevFavorites, product];
    });
  }, []);

  const removeFavorite = useCallback((productId: string) => {
    setFavorites(prevFavorites => prevFavorites.filter(fav => fav.id !== productId));
  }, []);

  const isFavorite = useCallback((productId: string) => {
    return favorites.some(fav => fav.id === productId);
  }, [favorites]);

  const toggleFavorite = useCallback((product: Product) => {
    if (isFavorite(product.id)) {
      removeFavorite(product.id);
    } else {
      addFavorite(product);
    }
  }, [addFavorite, removeFavorite, isFavorite]);

  const favoritesCount = favorites.length;

  const value = {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
    favoritesCount
  };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};

// Hook customizado para facilitar o uso do contexto
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites deve ser usado dentro de um FavoritesProvider');
  }
  return context;
};


'use client';

import { useState, useMemo } from 'react';
import { Heart, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { useFavorites } from '@/hooks/use-favorites';
import { FavoriteList } from './favorite-list';
import { Input } from '@/components/ui/input';

export function FavoritesSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const { favorites, favoritesCount } = useFavorites();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFavorites = useMemo(() => {
    if (!searchTerm) {
      return favorites;
    }
    return favorites.filter(fav => 
      fav.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [favorites, searchTerm]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Heart className="h-5 w-5" />
          {favoritesCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
            >
              {favoritesCount}
            </Badge>
          )}
          <span className="sr-only">Abrir favoritos</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader className="pb-4">
          <SheetTitle>Meus Favoritos</SheetTitle>
           <div className="relative pt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                placeholder="Buscar nos favoritos..."
                className="pl-10 bg-background"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </SheetHeader>
        <FavoriteList favorites={filteredFavorites} />
      </SheetContent>
    </Sheet>
  );
}


'use client';

import { useState } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { useFavorites } from '@/hooks/use-favorites';
import { FavoriteList } from './favorite-list';

export function FavoritesSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const { favorites, favoritesCount } = useFavorites();

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
        <SheetHeader>
          <SheetTitle>Meus Favoritos</SheetTitle>
        </SheetHeader>
        <FavoriteList favorites={favorites} />
      </SheetContent>
    </Sheet>
  );
}

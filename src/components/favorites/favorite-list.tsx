
'use client';

import type { Product } from '@/lib/data';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Trash2, Heart, ShoppingCart } from 'lucide-react';
import { useFavorites } from '@/hooks/use-favorites';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';

interface FavoriteListProps {
  favorites: Product[];
}

export function FavoriteList({ favorites }: FavoriteListProps) {
  const { removeFavorite } = useFavorites();
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (product: Product) => {
    addItem(product, 1);
    toast({
      title: `${product.name} adicionado!`,
      description: "O item está no seu carrinho.",
      variant: "success"
    });
  }

  if (!favorites || favorites.length === 0) {
    return (
       <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <Heart className="h-20 w-20 text-muted-foreground/30" strokeWidth={1} />
            <div className="space-y-1">
              <h3 className="text-lg font-medium">Sem favoritos ainda</h3>
              <p className="text-sm text-muted-foreground">Clique no coração de um produto para adicioná-lo aqui.</p>
            </div>
          </div>
    );
  }

  return (
    <div className="space-y-3 overflow-y-auto flex-1 -mx-6 px-6">
      {favorites.map((p) => (
        <div key={p.id} className="flex items-center justify-between gap-3 pt-3 border-t first:border-t-0 first:pt-0">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 overflow-hidden rounded-md border bg-muted shrink-0">
              <Image src={p.image.imageUrl} alt={p.name} width={48} height={48} className="object-cover h-full w-full" />
            </div>
            <div>
              <div className="text-sm font-medium">{p.name}</div>
              <div className="text-xs text-primary font-semibold">R$ {p.price.toFixed(2)}</div>
            </div>
          </div>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => handleAddToCart(p)}>
              <ShoppingCart className="h-5 w-5 text-primary" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => removeFavorite(p.id)}>
                <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

'use client';

import { Minus, Plus } from 'lucide-react';
import { useState, useTransition } from 'react';

import { Price, PriceLabel } from '@/vibes/soul/primitives/price-label';
import { toast } from '@/vibes/soul/primitives/toaster';
import { Image } from '~/components/image';
import { Link } from '~/components/link';
import { useRouter } from '~/i18n/routing';

import { addByosItems } from './add-byos-items';

export interface ByosProduct {
  id: string;
  title: string;
  href: string;
  image?: { src: string; alt: string };
  price?: Price;
  unitPrice?: number;
  currencyCode?: string;
  purchasable: boolean;
  requiresOptions: boolean;
}

interface Props {
  description?: string;
  products: ByosProduct[];
}

const formatCurrency = (value: number, currencyCode?: string) =>
  new Intl.NumberFormat(undefined, {
    currency: currencyCode ?? 'USD',
    style: 'currency',
  }).format(value);

export function ByosBuilder({ description, products }: Props) {
  const router = useRouter();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [isPending, startTransition] = useTransition();
  const selectedProducts = products.filter((product) => (quantities[product.id] ?? 0) > 0);
  const itemCount = selectedProducts.reduce(
    (total, product) => total + (quantities[product.id] ?? 0),
    0,
  );
  const subtotal = selectedProducts.reduce(
    (total, product) => total + (product.unitPrice ?? 0) * (quantities[product.id] ?? 0),
    0,
  );
  const currencyCode = selectedProducts.find((product) => product.currencyCode)?.currencyCode;

  const updateQuantity = (productId: string, nextQuantity: number) => {
    setQuantities((currentQuantities) => ({
      ...currentQuantities,
      [productId]: Math.max(0, Math.min(nextQuantity, 99)),
    }));
  };

  const addSelectionToCart = () => {
    const items = selectedProducts.map((product) => ({
      productEntityId: Number(product.id),
      quantity: quantities[product.id] ?? 0,
    }));

    startTransition(async () => {
      const result = await addByosItems(items);

      if (result.error) {
        toast.error(result.error);

        return;
      }

      toast.success('Spread added to cart.');
      router.refresh();
    });
  };

  return (
    <section className="mx-auto max-w-screen-2xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <header className="border-b-2 border-primary pb-7">
        <p className="font-heading text-sm font-semibold uppercase tracking-wider text-primary">
          Build Your Spread
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold uppercase leading-none sm:text-5xl">
          Choose your decoys
        </h1>
        {description ? (
          <p className="mt-4 max-w-2xl text-base leading-7 text-contrast-500">{description}</p>
        ) : null}
      </header>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <div className="block space-y-3">
          {products.map((product) => {
            const quantity = quantities[product.id] ?? 0;
            const canSelect = product.purchasable && !product.requiresOptions;

            return (
              <article
                className="flex min-w-0 gap-x-6 border-b border-contrast-200 pb-6 last:border-b-0"
                key={product.id}
              >
                <div
                  className="group block shrink-0 rounded-lg bg-contrast-100"
                  // href={product.href}
                >
                  {product.image ? (
                    <Image
                      alt={product.image.alt}
                      className="block h-20 w-auto transition duration-500 group-hover:scale-105"
                      // fill
                      // sizes="(min-height: 1280px) 24vw, (min-width: 640px) 45vw, 100vw"
                      src={product.image.src}
                      height={120}
                      width={120}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center p-6 font-display text-2xl font-bold uppercase text-contrast-400">
                      {product.title}
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col pt-4">
                  <div className="flex items-start justify-between gap-4">
                    <Link
                      className="font-heading text-lg font-semibold leading-tight hover:text-primary"
                      href={product.href}
                    >
                      {product.title}
                    </Link>
                    {product.price ? (
                      <PriceLabel className="shrink-0" price={product.price} />
                    ) : null}
                  </div>

                  {product.requiresOptions ? (
                    <Link
                      className="mt-4 text-sm font-semibold text-primary underline underline-offset-4"
                      href={product.href}
                    >
                      Choose options
                    </Link>
                  ) : (
                    <div className="mt-4 flex items-center justify-between gap-4">
                      <span className="text-sm text-contrast-500">
                        {product.purchasable ? 'Add to your spread' : 'Unavailable'}
                      </span>
                      <div
                        className="inline-flex h-10 items-center border border-contrast-300"
                        role="group"
                      >
                        <button
                          aria-label={`Remove one ${product.title}`}
                          className="grid h-full w-10 place-items-center transition-colors hover:bg-contrast-100 disabled:cursor-not-allowed disabled:text-contrast-300"
                          disabled={!canSelect || quantity === 0}
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          type="button"
                        >
                          <Minus aria-hidden="true" size={16} />
                        </button>
                        <output
                          aria-label={`${product.title} quantity`}
                          className="grid h-full w-9 place-items-center border-x border-contrast-300 text-sm font-semibold"
                        >
                          {quantity}
                        </output>
                        <button
                          aria-label={`Add one ${product.title}`}
                          className="grid h-full w-10 place-items-center transition-colors hover:bg-contrast-100 disabled:cursor-not-allowed disabled:text-contrast-300"
                          disabled={!canSelect || quantity === 99}
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          type="button"
                        >
                          <Plus aria-hidden="true" size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        <aside className="border border-contrast-200 bg-white p-5 lg:sticky lg:top-6">
          <div className="flex items-baseline justify-between border-b border-contrast-200 pb-4">
            <h2 className="font-display text-2xl font-bold uppercase">Your spread</h2>
            <span className="text-sm text-contrast-500">{itemCount} items</span>
          </div>

          {selectedProducts.length === 0 ? (
            <p className="py-6 text-sm leading-6 text-contrast-500">
              Select decoys to start building your spread.
            </p>
          ) : (
            <ul className="divide-y divide-contrast-200">
              {selectedProducts.map((product) => (
                <li
                  className="flex items-center justify-between gap-4 py-4 text-sm"
                  key={product.id}
                >
                  <span className="min-w-0 font-semibold">{product.title}</span>
                  <span className="shrink-0 text-contrast-500">x{quantities[product.id]}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="border-t-2 border-foreground pt-4">
            <div className="flex items-center justify-between font-heading text-lg font-semibold">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal, currencyCode)}</span>
            </div>
            <button
              className="mt-5 w-full bg-primary px-4 py-3 font-heading text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-contrast-300"
              disabled={itemCount === 0 || isPending}
              onClick={addSelectionToCart}
              type="button"
            >
              {isPending ? 'Adding to cart...' : 'Add spread to cart'}
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}

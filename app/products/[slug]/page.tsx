import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product/product-detail";
import { ChunhuaDetail } from "@/components/product/chunhua-detail";
import { PRODUCTS, getProductBySlug } from "@/lib/products";

/** Пре-рендер всех страниц товара на этапе сборки. */
export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const product = getProductBySlug(params.slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images[0],
    },
  };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  // У CHUNHUA собственная верстка по оригинальному макету.
  if (product.slug === "chunhua-mousepad") {
    return <ChunhuaDetail product={product} />;
  }

  const related = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id,
  ).slice(0, 4);

  return <ProductDetail product={product} related={related} />;
}

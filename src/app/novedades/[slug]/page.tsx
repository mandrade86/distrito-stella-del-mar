import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { SafeHtml } from "@/components/ui/SafeHtml";
import { getBlogPostBySlug } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: "Novedades" };
  return {
    title: `${post.title} | Novedades | Distrito Stella del Mar`,
    description: post.excerpt || undefined,
    alternates: { canonical: `/novedades/${post.slug}` },
  };
}

export default async function NewsPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
      <PageHero
        eyebrow="Novedades"
        title={post.title}
        description={
          post.excerpt ||
          (post.publishedAt
            ? new Date(post.publishedAt).toLocaleDateString("es-HN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "Artículo")
        }
        image={post.coverImage || "/images/renders/render-2.jpg"}
        imageAlt={post.title}
      />
      <section className="section-y bg-off-white">
        <div className="section-pad container-site">
          {post.coverImage ? (
            <div className="relative mx-auto mb-10 aspect-[21/9] max-w-4xl overflow-hidden">
              <Image
                src={post.coverImage}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 896px"
              />
            </div>
          ) : null}
          <SafeHtml html={post.content} className="mx-auto max-w-3xl" />
          <p className="mx-auto mt-10 max-w-3xl">
            <Link
              href="/novedades"
              className="text-sm font-semibold text-ocean underline"
            >
              ← Volver a novedades
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}

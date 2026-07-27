import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/ui/PageHero";
import { PageHtmlBody } from "@/components/sections/PageHtmlBody";
import { ConstructionProgress } from "@/components/sections/ConstructionProgress";
import { Gallery } from "@/components/sections/Gallery";
import { FadeIn, Stagger, StaggerItem } from "@/components/ui/FadeIn";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getPageCopy, getPublishedBlogPosts, getSharedCopy } from "@/lib/content";
import { resolvePageHero } from "@/lib/content/page-hero";
import { SharedSections } from "@/components/sections/SharedSections";

export const metadata: Metadata = {
  title: "Novedades | Distrito Stella del Mar",
  description:
    "Noticias, avance de obra, artículos y actualizaciones de Distrito Stella del Mar en Puerto Cortés.",
  alternates: { canonical: "/novedades" },
};

export default async function NewsPage() {
  const [copy, posts, shared] = await Promise.all([
    getPageCopy("novedades"),
    getPublishedBlogPosts(),
    getSharedCopy(),
  ]);
  const hero = resolvePageHero(copy.pageHero, {
    eyebrow: "Novedades",
    title: "Sigue la evolución del nuevo distrito",
    description:
      "Avance de obra, noticias, aliados, aperturas y eventos publicados con información oficial.",
    image: "/images/renders/render-2.jpg",
    imageAlt: "Vista general del desarrollo Distrito Stella del Mar",
  });

  return (
    <>
      <PageHero {...hero} />
      <PageHtmlBody copy={copy.htmlBody} />
      <ConstructionProgress copy={copy.construction} />

      <section className="section-y bg-off-white">
        <div className="section-pad container-site">
          <FadeIn>
            <SectionTitle
              eyebrow="Publicaciones"
              title="Noticias y artículos"
              description="Comunicados, avances y contenido oficial del distrito."
            />
          </FadeIn>

          {posts.length ? (
            <Stagger className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <StaggerItem key={post.id}>
                  <article className="flex h-full flex-col border border-navy/10 bg-white">
                    {post.coverImage ? (
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <Image
                          src={post.coverImage}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                    ) : null}
                    <div className="flex flex-1 flex-col p-5">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ocean">
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString(
                              "es-HN",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )
                          : "Novedades"}
                      </p>
                      <h2 className="mt-3 font-serif text-xl text-navy md:text-2xl">
                        <Link
                          href={`/novedades/${post.slug}`}
                          className="hover:text-ocean"
                        >
                          {post.title}
                        </Link>
                      </h2>
                      {post.excerpt ? (
                        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                          {post.excerpt}
                        </p>
                      ) : null}
                      <Link
                        href={`/novedades/${post.slug}`}
                        className="mt-5 text-sm font-semibold text-ocean underline"
                      >
                        Leer más
                      </Link>
                    </div>
                  </article>
                </StaggerItem>
              ))}
            </Stagger>
          ) : (
            <p className="mt-10 text-sm text-muted">
              Pronto publicaremos las primeras novedades. Gestione entradas en
              Admin → Novedades.
            </p>
          )}
        </div>
      </section>

      <Gallery copy={copy.gallery} />
      <SharedSections pageSlug="novedades" shared={shared} />
    </>
  );
}

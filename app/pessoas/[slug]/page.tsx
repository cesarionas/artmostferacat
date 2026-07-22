import Image from "next/image";
import { notFound } from "next/navigation";
import { ZoomIn } from "lucide-react";
import { PublicHeader } from "@/components/public-header";
import { getPerson } from "@/services/people.service";

export default async function PersonPage({ params }: { params: Promise<{ slug: string }> }) {
  const person = await getPerson((await params).slug);
  if (!person) notFound();

  const cover = person.images?.find(image => image.is_cover) ?? person.images?.[0];

  return (
    <>
      <PublicHeader />
      <article className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
        <div className="grid gap-8 md:grid-cols-[.9fr_1.1fr]">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
            {cover?.public_url ? (
              <a
                href={cover.public_url}
                target="_blank"
                rel="noreferrer"
                aria-label={`Ampliar imagem de ${person.name}`}
                className="group absolute inset-0 block"
              >
                <Image
                  src={cover.public_url}
                  alt={cover.alt || person.name}
                  fill
                  priority
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
                <span className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-background/90 text-foreground shadow-sm transition group-hover:scale-110">
                  <ZoomIn size={20} aria-hidden="true" />
                </span>
              </a>
            ) : (
              <div className="grid h-full place-items-center text-sm text-foreground/55">Sem imagem</div>
            )}
          </div>
          <div className="self-center">
            <p className="text-sm text-foreground/60">{person.category?.name}</p>
            <h1 className="mt-1 text-4xl font-semibold tracking-tight">{person.name}</h1>
            <p className="mt-5 whitespace-pre-wrap leading-7 text-foreground/70">{person.description || "Sem descrição disponível."}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {person.tags?.map(tag => <span className="rounded-full bg-muted px-3 py-1 text-sm" key={tag.id}>{tag.name}</span>)}
            </div>
          </div>
        </div>
      </article>
    </>
  );
}

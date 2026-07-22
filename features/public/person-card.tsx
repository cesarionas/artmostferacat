import Image from "next/image";
import Link from "next/link";
import { ImageIcon } from "lucide-react";
import type { Person } from "@/types/database";

export function PersonCard({ person }: { person: Person }) {
  const cover = person.images?.find(image => image.is_cover) ?? person.images?.[0];

  return (
    <article className="group overflow-hidden rounded-2xl border bg-background shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-[4/3] bg-muted">
        {cover?.public_url ? (
          <Image src={cover.public_url} alt={cover.alt || person.name} fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
        ) : (
          <div className="grid h-full place-items-center text-sm text-foreground/45">Sem imagem</div>
        )}
      </div>
      <div className="space-y-3 p-4">
        <div>
          <p className="text-lg font-semibold">{person.name}</p>
          <p className="truncate text-sm text-foreground/60">{person.category?.name || "Sem categoria"}</p>
        </div>
        <span className="flex items-center gap-1 text-xs text-foreground/60"><ImageIcon size={14} />1 imagem</span>
        <Link className="block rounded-xl bg-muted px-4 py-3 text-center text-sm font-medium transition hover:bg-primary hover:text-background" href={`/produtos/${person.slug}`}>Visualizar</Link>
      </div>
    </article>
  );
}

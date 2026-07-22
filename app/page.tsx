import { PublicHeader } from "@/components/public-header";
import { Catalog } from "@/features/public/catalog";
import { getPeople } from "@/services/people.service";
export default async function Home() { const { people } = await getPeople(); return <><PublicHeader/><section className="border-b bg-muted/50"><div className="mx-auto max-w-6xl px-4 py-12 sm:py-20"><p className="mb-3 text-sm font-medium text-foreground/60">ACERVO DIGITAL</p><h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">Pessoas, histórias e arquivos em um só lugar.</h1><p className="mt-5 max-w-xl text-base leading-7 text-foreground/65">Explore o catálogo e encontre documentos, imagens e materiais de cada pessoa.</p></div></section><Catalog initial={people}/></> }

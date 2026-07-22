import { PublicHeader } from "@/components/public-header";
import { Catalog } from "@/features/public/catalog";
import { getPeople } from "@/services/people.service";
import type { Person } from "@/types/database";

export default async function Home() {
	let people: Person[] = [];
	try {
		const res = await getPeople();
		people = res?.people ?? [];
	} catch (err) {
		// já logamos no serviço, mas evitamos crash aqui também
		console.error("Erro ao carregar pessoas (render fallback):", err);
		people = [];
	}

	return (
		<>
			<PublicHeader />
			<section className="border-b bg-muted/50">
				<div className="mx-auto max-w-6xl px-4 py-12 sm:py-20">
				<p className="mb-3 text-sm font-medium text-foreground/60">Catálogo de loja</p>
				<h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">A sua vitrine de Wrestling, Música, Geek e Cultura Sáfica.</h1>
				<p className="mt-5 max-w-xl text-base leading-7 text-foreground/65">Explore produtos com imagem, categoria e descrição — pesquise por nome ou filtro para encontrar o que você quer.</p>
				</div>
			</section>
			<Catalog initial={people} />
		</>
	);
}

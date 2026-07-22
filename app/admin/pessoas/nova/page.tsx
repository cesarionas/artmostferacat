import { PersonForm } from "@/features/admin/person-form";
import { createClient } from "@/supabase/server";

export default async function NewPerson() {
	const supabase = await createClient();
	const [categoriesResult, productTypesResult] = await Promise.all([
		supabase.from("categories").select("id,name,slug").order("name"),
		supabase.from("product_types").select("id,name,slug").order("name"),
	]);

	return (
		<>
			<h1 className="mb-7 text-3xl font-semibold">Novo produto</h1>
			<p className="mb-6 text-sm text-foreground/60">Salve primeiro para liberar o painel de upload de imagens e arquivos.</p>
			<PersonForm categories={categoriesResult.data ?? []} productTypes={productTypesResult.data ?? []} />
		</>
	);
}

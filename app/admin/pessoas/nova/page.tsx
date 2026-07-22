import { PersonForm } from "@/features/admin/person-form";
export default function NewPerson() {
	return (
		<>
			<h1 className="mb-7 text-3xl font-semibold">Nova pessoa</h1>
			<p className="mb-6 text-sm text-foreground/60">Salve primeiro para liberar o painel de upload de imagens e arquivos.</p>
			<PersonForm />
		</>
	);
}

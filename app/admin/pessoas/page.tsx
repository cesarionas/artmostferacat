import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/supabase/server";
import { AdminPeopleTable } from "@/components/admin-people-table";

export default async function AdminPeople() {
	const supabase = await createClient();
	const { data: people } = await supabase
		.from("people")
		.select("id,name,status,created_at")
		.order("created_at", { ascending: false });

	return (
		<>
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-semibold">Pessoas</h1>
					<p className="mt-1 text-foreground/60">Gerencie o catálogo.</p>
				</div>
				<Link
					href="/admin/pessoas/nova"
					className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-background"
				>
					<Plus size={18} /> Nova pessoa
				</Link>
			</div>
			<AdminPeopleTable people={people ?? []} />
		</>
	);
}

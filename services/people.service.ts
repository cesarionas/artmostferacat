import { createClient } from "@/supabase/server";
import type { Person } from "@/types/database";

const decorate = async (
	supabase: Awaited<ReturnType<typeof createClient>>,
	row: any
): Promise<Person> => {
	const images = (row.images ?? []).map((image: any) => ({
		...image,
		public_url: supabase.storage.from("people-images").getPublicUrl(image.path).data.publicUrl,
	}));

	const files = await Promise.all(
		(row.files ?? []).map(async (file: any) => {
			const signed = await supabase.storage.from("people-files").createSignedUrl(file.path, 3600);
			return {
				...file,
				public_url: signed.data?.signedUrl ?? "",
			};
		})
	);

	return {
		...row,
		images,
		files,
		tags: row.people_tags?.map((x: any) => x.tags).filter(Boolean),
	} as Person;
};

export async function getPeople(query = "", page = 0, pageSize = 12) {
	try {
		const supabase = await createClient();
		let request = supabase
			.from("people")
			.select("*, category:categories(*), images(*), files(*), people_tags(tags(*))", { count: "exact" })
			.eq("status", "published")
			.order("created_at", { ascending: false })
			.range(page * pageSize, (page + 1) * pageSize - 1);

		if (query)
			request = request.or(
				`name.ilike.%${query}%,description.ilike.%${query}%`
			);

		const { data, count, error } = await request;
		if (error) {
			console.error("Supabase error in getPeople:", error);
			return { people: [], count: 0 };
		}

		return { people: await Promise.all((data ?? []).map((row) => decorate(supabase, row))), count: count ?? 0 };
	} catch (err) {
		console.error("Unexpected error in getPeople:", err);
		return { people: [], count: 0 };
	}
}

export async function getPerson(slug: string) {
	try {
		const supabase = await createClient();
		const { data, error } = await supabase
			.from("people")
			.select("*, category:categories(*), images(*), files(*), people_tags(tags(*))")
			.eq("slug", slug)
			.eq("status", "published")
			.single();

		if (error) {
			console.error("Supabase error in getPerson:", error);
			return null;
		}

		return decorate(supabase, data);
	} catch (err) {
		console.error("Unexpected error in getPerson:", err);
		return null;
	}
}

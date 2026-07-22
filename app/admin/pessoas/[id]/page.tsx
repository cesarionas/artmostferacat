import { notFound } from "next/navigation";
import { createClient } from "@/supabase/server";
import { PersonForm } from "@/features/admin/person-form";

export const dynamic = 'force-dynamic';

export default async function EditPerson({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const [personResult, categoriesResult, productTypesResult] = await Promise.all([
    supabase.from("people").select("*").eq("id", (await params).id).single(),
    supabase.from("categories").select("id,name,slug").order("name"),
    supabase.from("product_types").select("id,name,slug").order("name"),
  ]);

  if (!personResult.data) notFound();

  return (
    <>
      <h1 className="mb-7 text-3xl font-semibold">Editar produto</h1>
      <PersonForm id={personResult.data.id} initial={personResult.data} categories={categoriesResult.data ?? []} productTypes={productTypesResult.data ?? []} />
    </>
  );
}

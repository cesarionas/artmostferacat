import { notFound } from "next/navigation";
import { createClient } from "@/supabase/server";
import { PersonForm } from "@/features/admin/person-form";
import { UploadPanel } from "@/features/admin/upload-panel";
export default async function EditPerson({ params }: { params: Promise<{ id: string }> }) { const supabase = await createClient(); const { data } = await supabase.from("people").select("*").eq("id", (await params).id).single(); if (!data) notFound(); return <><h1 className="mb-7 text-3xl font-semibold">Editar pessoa</h1><PersonForm id={data.id} initial={data}/><div className="mt-10 border-t pt-8"><UploadPanel personId={data.id}/></div></> }

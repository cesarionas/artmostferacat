"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
const schema = z.object({ name: z.string().min(2, "Informe ao menos 2 caracteres"), description: z.string().max(3000).optional(), status: z.enum(["draft", "published", "archived"]) }); type Values = z.infer<typeof schema>;
const slugify = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
export function PersonForm({ id, initial }: { id?: string; initial?: Partial<Values> }) { const router = useRouter(); const [saving, setSaving] = useState(false); const { register, handleSubmit, formState: { errors } } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: initial || { status: "draft" } }); async function save(values: Values) {
		setSaving(true);
		const supabase = createClient();
		const payload = {
			...values,
			slug: `${slugify(values.name)}-${id ? id.slice(0, 5) : crypto.randomUUID().slice(0, 5)}`,
		};
		const result = id
			? await supabase.from("people").update(payload).eq("id", id)
			: await supabase.from("people").insert(payload).select("id").single();
		setSaving(false);
		if (result.error) return toast.error("Erro ao salvar", { description: result.error.message });
		const personId = result.data?.id;
		if (!personId) {
			return toast.error("Erro ao salvar: ID não disponível.");
		}
		toast.success("Pessoa salva com sucesso");
		router.push(id ? "/admin/pessoas" : `/admin/pessoas/${personId}`);
		router.refresh();
	} return <form onSubmit={handleSubmit(save)} className="max-w-2xl space-y-5"><label className="block text-sm font-medium">Nome<input {...register("name")} className="mt-2 h-11 w-full rounded-xl border bg-transparent px-3"/>{errors.name && <span className="mt-1 block text-xs text-red-600">{errors.name.message}</span>}</label><label className="block text-sm font-medium">Descrição<textarea {...register("description")} rows={6} className="mt-2 w-full rounded-xl border bg-transparent p-3"/></label><label className="block text-sm font-medium">Status<select {...register("status")} className="mt-2 h-11 w-full rounded-xl border bg-transparent px-3"><option value="draft">Rascunho</option><option value="published">Publicado</option><option value="archived">Arquivado</option></select></label><Button disabled={saving}>{saving ? "Salvando..." : "Salvar pessoa"}</Button></form> }

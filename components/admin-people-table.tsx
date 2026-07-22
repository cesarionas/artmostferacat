"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, Pencil } from "lucide-react";
import { createClient } from "@/supabase/client";
import { toast } from "sonner";
import type { Person } from "@/types/database";
import { Button } from "@/components/ui/button";

interface Props {
  people: Pick<Person, "id" | "name" | "status" | "created_at">[];
}

export function AdminPeopleTable({ people }: Props) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir esta pessoa?")) return;
    setDeletingId(id);
    const supabase = createClient();
    const { error } = await supabase.from("people").delete().eq("id", id);
    setDeletingId(null);
    if (error) {
      toast.error("Falha ao excluir", { description: error.message });
      return;
    }
    toast.success("Pessoa excluída com sucesso");
    router.refresh();
  }

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border">
      <table className="w-full text-left text-sm">
        <thead className="bg-muted text-foreground/60">
          <tr>
            <th className="p-4 font-medium">Nome</th>
            <th className="p-4 font-medium">Status</th>
            <th className="p-4 font-medium">Criado em</th>
            <th className="p-4 font-medium">Ações</th>
          </tr>
        </thead>
        <tbody>
          {people?.map((person) => (
            <tr key={person.id} className="border-t">
              <td className="p-4 font-medium">
                <Link className="hover:underline" href={`/admin/pessoas/${person.id}`}>
                  {person.name}
                </Link>
              </td>
              <td className="p-4">{person.status}</td>
              <td className="p-4">{new Date(person.created_at).toLocaleDateString("pt-BR")}</td>
              <td className="flex flex-wrap gap-2 p-4">
                <Link href={`/admin/pessoas/${person.id}`} className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm hover:bg-muted">
                  <Pencil size={16} /> Editar
                </Link>
                <Button
                  variant="secondary"
                  type="button"
                  disabled={deletingId === person.id}
                  onClick={() => handleDelete(person.id)}
                >
                  <Trash2 size={16} />
                  {deletingId === person.id ? "Excluindo..." : "Excluir"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!people?.length && (
        <div className="space-y-4 p-10 text-center text-foreground/60">
          <p className="text-lg font-medium text-foreground">Nenhuma pessoa cadastrada ainda.</p>
          <p className="text-sm text-foreground/70">Clique abaixo para adicionar seu primeiro produto ao catálogo.</p>
          <div className="flex justify-center">
            <Link href="/admin/pessoas/nova" className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-medium text-background hover:opacity-90">
              Criar primeiro produto
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

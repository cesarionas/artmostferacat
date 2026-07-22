"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus } from "lucide-react";
import { createClient } from "@/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Category, ProductType } from "@/types/database";

const schema = z.object({
  name: z.string().min(2, "Informe ao menos 2 caracteres"),
  category_id: z.string().uuid("Selecione uma categoria"),
  product_type_id: z.string().uuid("Selecione um tipo"),
  status: z.enum(["draft", "published", "archived"]),
});

type Values = z.infer<typeof schema>;

type PersonFormProps = {
  id?: string;
  initial?: Partial<Values>;
  categories?: Category[];
  productTypes?: ProductType[];
};

const slugify = (text: string) => text
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/(^-|-$)/g, "");

export function PersonForm({ id, initial, categories: initialCategories, productTypes: initialProductTypes }: PersonFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>(initialCategories ?? []);
  const [loadingCategories, setLoadingCategories] = useState(!(initialCategories?.length));
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [productTypes, setProductTypes] = useState<ProductType[]>(initialProductTypes ?? []);
  const [loadingProductTypes, setLoadingProductTypes] = useState(!(initialProductTypes?.length));
  const [productTypesError, setProductTypesError] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: initial || { status: "draft" },
  });

  useEffect(() => {
    if ((initialCategories ?? []).length > 0) {
      setCategories(initialCategories ?? []);
      setLoadingCategories(false);
      setCategoriesError(null);
      return;
    }

    let active = true;
    setLoadingCategories(true);
    setCategoriesError(null);

    createClient().from("categories").select("id,name,slug").order("name")
      .then(({ data, error }) => {
        if (!active) return;

        if (error) {
          setCategoriesError(error.message);
          toast.error("Não foi possível carregar as categorias");
        } else {
          setCategories(data ?? []);
        }
        setLoadingCategories(false);
      });

    return () => {
      active = false;
    };
  }, [initialCategories]);

  useEffect(() => {
    if ((initialProductTypes ?? []).length > 0) {
      setProductTypes(initialProductTypes ?? []);
      setLoadingProductTypes(false);
      setProductTypesError(null);
      return;
    }

    let active = true;
    setLoadingProductTypes(true);
    setProductTypesError(null);

    createClient().from("product_types").select("id,name,slug").order("name")
      .then(({ data, error }) => {
        if (!active) return;

        if (error) {
          setProductTypesError(error.message);
          toast.error("Não foi possível carregar os tipos", { description: error.message });
        } else {
          setProductTypes(data ?? []);
        }
        setLoadingProductTypes(false);
      });

    return () => {
      active = false;
    };
  }, [initialProductTypes]);

  async function save(values: Values) {
    setSaving(true);
    const supabase = createClient();
    const payload = {
      ...values,
      slug: `${slugify(values.name)}-${id ? id.slice(0, 5) : crypto.randomUUID().slice(0, 5)}`,
    };
    const result = id
      ? await supabase.from("people").update(payload).eq("id", id)
      : await supabase.from("people").insert(payload).select("id").single();

    const productId = id ?? result.data?.id;
    if (result.error || !productId) {
      setSaving(false);
      return toast.error("Erro ao salvar", { description: result.error?.message || "ID não disponível" });
    }

    if (image) {
      const safeName = image.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `${productId}/${crypto.randomUUID()}-${safeName}`;
      const { error: uploadError } = await supabase.storage.from("people-images").upload(path, image);
      if (uploadError) {
        setSaving(false);
        return toast.error("Produto salvo, mas a imagem não foi enviada", { description: uploadError.message });
      }
      await supabase.from("images").update({ is_cover: false }).eq("person_id", productId).eq("is_cover", true);
      const { error: imageError } = await supabase.from("images").insert({ person_id: productId, path, alt: values.name, is_cover: true });
      if (imageError) {
        setSaving(false);
        return toast.error("Produto salvo, mas a imagem não foi associada", { description: imageError.message });
      }
    }

    setSaving(false);
    toast.success("Produto salvo com sucesso");
    router.push(id ? "/admin/produtos" : `/admin/produtos/${productId}`);
    router.refresh();
  }

  return <form onSubmit={handleSubmit(save)} className="max-w-2xl space-y-5">
    <label className="block text-sm font-medium">Nome do produto
      <input {...register("name")} className="mt-2 h-11 w-full rounded-xl border bg-transparent px-3" />
      {errors.name && <span className="mt-1 block text-xs text-red-600">{errors.name.message}</span>}
    </label>
    <div className="grid gap-5 sm:grid-cols-2">
      <label className="block text-sm font-medium">Categoria
        <select {...register("category_id")} className="mt-2 h-11 w-full rounded-xl border bg-transparent px-3">
          <option value="">Selecione uma categoria</option>
          {loadingCategories ? (
            <option value="" disabled>Carregando categorias...</option>
          ) : categories.length > 0 ? (
            categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)
          ) : (
            <option value="" disabled>Nenhuma categoria disponível</option>
          )}
        </select>
        {errors.category_id && <span className="mt-1 block text-xs text-red-600">{errors.category_id.message}</span>}
        {categoriesError && <span className="mt-1 block text-xs text-red-600">Erro ao buscar categorias: {categoriesError}</span>}
      </label>
      <label className="block text-sm font-medium">Tipo
        <select {...register("product_type_id")} className="mt-2 h-11 w-full rounded-xl border bg-transparent px-3">
          <option value="">Selecione um tipo</option>
          {loadingProductTypes ? (
            <option value="" disabled>Carregando tipos...</option>
          ) : productTypes.length > 0 ? (
            productTypes.map(productType => <option key={productType.id} value={productType.id}>{productType.name}</option>)
          ) : (
            <option value="" disabled>Nenhum tipo disponível</option>
          )}
        </select>
        {errors.product_type_id && <span className="mt-1 block text-xs text-red-600">{errors.product_type_id.message}</span>}
        {productTypesError && <span className="mt-1 block text-xs text-red-600">Erro ao buscar tipos: {productTypesError}</span>}
      </label>
    </div>
    <label className="block text-sm font-medium">Imagem principal
      <span className="mt-2 flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed text-sm text-foreground/60 hover:bg-muted">
        <ImagePlus size={22} />
        <span className="mt-2">{image ? image.name : "Selecione uma imagem"}</span>
        <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={event => setImage(event.target.files?.[0] ?? null)} />
      </span>
    </label>
    <label className="block text-sm font-medium">Status
      <select {...register("status")} className="mt-2 h-11 w-full rounded-xl border bg-transparent px-3">
        <option value="draft">Rascunho</option><option value="published">Publicado</option><option value="archived">Arquivado</option>
      </select>
    </label>
    <Button disabled={saving}>{saving ? "Salvando..." : "Salvar produto"}</Button>
  </form>;
}

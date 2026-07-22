"use client";
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { Person } from "@/types/database";
import { PersonCard } from "./person-card";

const CATEGORIES = [
  "Todas",
  "Wrestling",
  "Música",
  "Geek",
  "Cultura Sáfica",
];

export function Catalog({ initial }: { initial: Person[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todas");
  const [allPeople, setAllPeople] = useState(initial);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const id = setTimeout(async () => {
      setLoading(true);
      const r = await fetch(`/api/people?q=${encodeURIComponent(query)}`);
      if (r.ok) {
        const json = await r.json();
        setAllPeople(json.people ?? []);
      }
      setLoading(false);
    }, 250);

    return () => clearTimeout(id);
  }, [query]);

  const people = useMemo(() => {
    return allPeople.filter((person) => {
      if (category === "Todas") return true;
      return person.category?.name === category;
    });
  }, [allPeople, category]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-7 flex flex-col gap-3 sm:flex-row">
        <label className="flex h-12 flex-1 items-center gap-3 rounded-xl border bg-background px-4">
          <Search size={18} />
          <input
            aria-label="Pesquisar pessoas"
            className="w-full bg-transparent outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar por nome, descrição ou categoria..."
          />
        </label>
      </div>

      <div className="mb-7 flex flex-wrap gap-3">
        {CATEGORIES.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setCategory(option)}
            className={`rounded-full px-4 py-2 text-sm transition ${
              category === option
                ? "bg-primary text-background"
                : "border border-muted/70 bg-background text-foreground hover:bg-muted"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="py-16 text-center text-sm text-foreground/60">Buscando acervo...</p>
      ) : people.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {people.map((person) => (
            <PersonCard key={person.id} person={person} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed py-20 text-center text-foreground/60">
          Nenhuma pessoa encontrada.
        </div>
      )}
    </section>
  );
}


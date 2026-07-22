"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createClient } from "@/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
function LoginForm() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const searchParams = useSearchParams();
	const accessError = searchParams.get("error") === "admin";

	async function submit(e: React.FormEvent) {
		e.preventDefault();
		if (loading) return;
		setLoading(true);
		try {
			const response = await fetch("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ email, password }),
			});

			let data: any = {};
			try {
				data = await response.json();
			} catch (e) {
				console.error("Failed to parse response:", e);
				data = { error: "Erro ao processar resposta do servidor" };
			}

			if (!response.ok) {
				return toast.error("Não foi possível entrar", { description: data.error || "Erro ao autenticar" });
			}

			router.push("/admin");
			router.refresh();
		} catch (error) {
			console.error("Login error:", error);
			toast.error("Erro de conexão", { description: "Verifique sua conexão e tente novamente" });
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="grid min-h-screen place-items-center bg-muted p-4">
			<form onSubmit={submit} className="w-full max-w-sm space-y-5 rounded-2xl border bg-background p-6 shadow-sm">
				<div>
					<h1 className="text-2xl font-semibold">Acesso administrativo</h1>
					<p className="mt-1 text-sm text-foreground/60">Use as credenciais de administrador.</p>
					{accessError && <p role="alert" className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">Este usuário não possui permissão de administrador.</p>}
				</div>
				<label className="block text-sm font-medium">
					E-mail
					<input
						required
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						disabled={loading}
						className="mt-2 h-11 w-full rounded-xl border bg-transparent px-3 outline-none focus:ring-2 focus:ring-primary"
					/>
				</label>
				<label className="block text-sm font-medium">
					Senha
					<input
						required
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						disabled={loading}
						className="mt-2 h-11 w-full rounded-xl border bg-transparent px-3 outline-none focus:ring-2 focus:ring-primary"
					/>
				</label>
				<Button disabled={loading} className="w-full" type="submit">
					{loading ? (
						<span className="inline-flex items-center gap-2">
							<Loader2 className="h-4 w-4 animate-spin" />
							Entrando...
						</span>
					) : (
						"Entrar"
					)}
				</Button>
			</form>
		</div>
	);
}

export default function Login() {
	return (
		<Suspense fallback={<div className="min-h-screen bg-muted" />}>
			<LoginForm />
		</Suspense>
	);
}

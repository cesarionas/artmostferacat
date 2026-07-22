import Link from "next/link";
import { FolderHeart } from "lucide-react";
export function PublicHeader() { return <header className="sticky top-0 z-20 border-b bg-background/85 backdrop-blur"><nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4"><Link href="/" className="flex items-center gap-2 font-semibold"><span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-background"><FolderHeart size={18}/></span>Artmosfera</Link><Link href="/login" className="rounded-lg px-3 py-2 text-sm hover:bg-muted">Administração</Link></nav></header> }

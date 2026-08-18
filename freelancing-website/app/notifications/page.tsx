"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import { api } from "@/lib/api";

type Notification = { _id: string; title: string; message: string; read: boolean; link?: string; createdAt: string };
export default function NotificationsPage() {
  const [items, setItems] = useState<Notification[]>([]);
  async function load() { const data = await api<{notifications: Notification[]}>("/notifications"); setItems(data.notifications); }
  useEffect(() => { load(); }, []);
  async function read(id: string) { await api(`/notifications/${id}/read`, {method:"PATCH"}); load(); }
  async function readAll() { await api("/notifications/read-all", {method:"PATCH"}); load(); }
  return <AppShell><div className="mb-8 flex items-end justify-between"><div><p className="text-sm text-indigo-300">Activity</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">Notifications</h1></div><button onClick={readAll} className="text-xs text-white/35 hover:text-white">Mark all read</button></div><div className="space-y-2">{items.length===0 ? <div className="rounded-2xl border border-white/[0.07] p-10 text-center text-sm text-white/30">You're all caught up.</div> : items.map((n)=><div key={n._id} className={`rounded-2xl border p-4 ${n.read?"border-white/[0.06] bg-white/[0.02]":"border-indigo-400/15 bg-indigo-400/[0.05]"}`}><div className="flex items-start justify-between gap-4"><div><p className="font-medium">{n.title}</p><p className="mt-1 text-sm leading-6 text-white/40">{n.message}</p>{n.link && <Link href={n.link} onClick={()=>read(n._id)} className="mt-3 inline-block text-xs text-indigo-300">Open →</Link>}</div>{!n.read && <button onClick={()=>read(n._id)} className="text-[10px] text-white/30 hover:text-white">Mark read</button>}</div></div>)}</div></AppShell>;
}

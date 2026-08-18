"use client";
import { FormEvent, useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { api } from "@/lib/api";

type Project = {_id:string; jobId:{title:string}; freelancerId:{name:string}; employerId:{name:string}};
type Message = {_id:string; content:string; createdAt:string; senderId:{_id:string; name:string; role:string}};
export default function MessagesPage(){
 const [projects,setProjects]=useState<Project[]>([]); const [projectId,setProjectId]=useState(""); const [messages,setMessages]=useState<Message[]>([]); const [content,setContent]=useState("");
 async function loadProjects(){const d=await api<{projects:Project[]}>("/projects/mine");setProjects(d.projects); if(!projectId&&d.projects[0])setProjectId(d.projects[0]._id);}
 async function loadMessages(){if(!projectId)return;const d=await api<{messages:Message[]}>(`/messages/project/${projectId}`);setMessages(d.messages);}
 useEffect(()=>{loadProjects()},[]); useEffect(()=>{loadMessages()},[projectId]);
 async function send(e:FormEvent){e.preventDefault(); if(!content.trim())return; await api(`/messages/project/${projectId}`,{method:"POST",json:{content}});setContent("");loadMessages();}
 return <AppShell><div className="mb-8"><p className="text-sm text-indigo-300">Project communication</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">Messages</h1><p className="mt-2 text-sm text-white/35">Simple project-based messaging between both sides.</p></div><div className="grid gap-4 lg:grid-cols-[280px_1fr]"> <aside className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-3">{projects.length===0?<p className="p-4 text-sm text-white/30">No active projects.</p>:projects.map(p=><button key={p._id} onClick={()=>setProjectId(p._id)} className={`w-full rounded-xl p-4 text-left ${p._id===projectId?"bg-white/[0.08]":"hover:bg-white/[0.04]"}`}><p className="text-sm font-medium">{p.jobId.title}</p><p className="mt-1 text-xs text-white/30">{p.freelancerId.name}</p></button>)}</aside><section className="flex min-h-[520px] flex-col rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4"> <div className="flex-1 space-y-3 overflow-auto">{messages.length===0?<p className="p-6 text-sm text-white/30">Start the conversation.</p>:messages.map(m=><div key={m._id} className="rounded-xl bg-white/[0.035] p-4"><p className="text-[11px] text-white/30">{m.senderId.name} · {new Date(m.createdAt).toLocaleString()}</p><p className="mt-2 text-sm leading-6 text-white/60">{m.content}</p></div>)}</div>{projectId&&<form onSubmit={send} className="mt-4 flex gap-2"><input value={content} onChange={e=>setContent(e.target.value)} placeholder="Write a message..." className="h-11 flex-1 rounded-xl border border-white/[0.08] bg-black/20 px-3 text-sm outline-none"/><button className="rounded-xl bg-white px-4 text-xs font-semibold text-black">Send</button></form>}</section></div></AppShell>
}

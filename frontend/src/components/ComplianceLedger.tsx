"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, Loader2, Key } from "lucide-react";

const API_BASE = "http://localhost:8000";

interface AuditLog {
    id: string;
    company_name: string;
    source: string;
    dedup_hash: string;
    created_at: string;
}

export default function ComplianceLedger() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchLogs() {
            try {
                const res = await fetch(`${API_BASE}/api/v1/webhooks/signals`);
                if (res.ok) {
                    const data = await res.json();
                    setLogs(data);
                }
            } catch (e) {
                console.error("Failed to fetch compliance logs", e);
            } finally {
                setIsLoading(false);
            }
        }
        fetchLogs();
    }, []);

    return (
        <div className="flex-1 flex flex-col min-h-0 bg-[#0C1519]">
            <div className="p-6 border-b border-[#CA9C68]/20 bg-[#162127]/70 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/20 text-emerald-500 rounded-md">
                        <ShieldCheck size={20} />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold uppercase tracking-widest text-[#F8FAFC]">Data Compliance Ledger</h2>
                        <p className="text-xs text-gray-400">SOC2 & GDPR Audit Trail</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 p-6 overflow-auto">
                <div className="bg-[#162127]/70 border border-[#CA9C68]/20 rounded-md overflow-hidden">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-[#0C1519]/80 text-gray-400 border-b border-[#CA9C68]/20">
                            <tr>
                                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-xs">Timestamp</th>
                                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-xs">Target Account</th>
                                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-xs">Ingestion Source</th>
                                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-xs">Cryptographic Hash (SHA-256)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan={4} className="text-center py-8"><Loader2 className="animate-spin inline-block text-gray-400" /></td></tr>
                            ) : logs.length === 0 ? (
                                <tr><td colSpan={4} className="text-center py-8 text-gray-500">No data ingested yet.</td></tr>
                            ) : (
                                logs.map((log) => (
                                    <tr key={log.id} className="border-b border-[#CA9C68]/10 hover:bg-[#0C1519]/50">
                                        <td className="px-4 py-3 text-gray-300">{new Date(log.created_at).toLocaleString()}</td>
                                        <td className="px-4 py-3 font-medium text-white">{log.company_name}</td>
                                        <td className="px-4 py-3 text-emerald-400 font-mono text-xs">{log.source}</td>
                                        <td className="px-4 py-3 text-gray-500 font-mono text-xs flex items-center gap-2">
                                            <Key size={12} /> {log.dedup_hash}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
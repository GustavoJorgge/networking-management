'use client'

import { Card, CardContent, CardTitle } from "@/app/components/ui/input/card";
import { Input } from "@/app/components/ui/input/input";
import ProtectedRoute from "@/hooks/ProtectedRoute";
import { api } from "@/lib/api/axios";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowLeft, Bell, FileText, MessageSquare, Plus, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

type Comunicado = {
    id: string;
    titulo: string;
    conteudo: string;
    autor: string;
    criadoEm: string;
    idMembro: string;
};

type FormComunicado = {
    titulo: string;
    conteudo: string;
};

export default function ComunicadosPage() {
    const router = useRouter();
    const [comunicados, setComunicados] = useState<Comunicado[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [stats, setStats] = useState({ total: 0, hoje: 0, semana: 0 });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormComunicado>();

    useEffect(() => {
        fetchComunicados();
        fetchEstatisticas();
    }, []);

    async function fetchComunicados() {
        try {
            const { data } = await api.get("/comunicados");
            setComunicados(data);
        } catch (error) {
            toast.error("Erro ao carregar comunicados");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function fetchEstatisticas() {
        try {
            const { data } = await api.get("/comunicados");
            const hoje = new Date().toDateString();
            const umaSemanaAtras = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

            const hojeCont = data.filter(
                (c: Comunicado) => new Date(c.criadoEm).toDateString() === hoje
            ).length;

            const semanaCont = data.filter(
                (c: Comunicado) => new Date(c.criadoEm) >= umaSemanaAtras
            ).length;

            setStats({
                total: data.length,
                hoje: hojeCont,
                semana: semanaCont,
            });
        } catch (error) {
            console.error("Erro ao carregar estatísticas:", error);
        }
    }

    async function onSubmit(formData: FormComunicado) {
        try {
            await api.post("/comunicados", formData);
            toast.success("Comunicado publicado com sucesso!");
            reset();
            setShowForm(false);
            fetchComunicados();
            fetchEstatisticas();
        } catch (error) {
            toast.error("Erro ao publicar comunicado");
            console.error(error);
        }
    }

    async function deletarComunicado(id: string) {
        if (!confirm("Tem certeza que deseja excluir este comunicado?")) return;

        try {
            await api.delete(`/comunicados/${id}`);
            toast.success("Comunicado excluído com sucesso");
            setComunicados((prev) => prev.filter((c) => c.id !== id));
            fetchEstatisticas();
        } catch (error) {
            toast.error("Erro ao excluir comunicado");
            console.error(error);
        }
    }

    function formatarData(data: string) {
        try {
            const date = new Date(data);
            if (isNaN(date.getTime())) {
                return "Data inválida";
            }

            // Formato: 12 de novembro de 2024 às 14:30
            return format(date, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
        } catch (error) {
            console.error("Erro ao formatar data:", error);
            return "Data inválida";
        }
    }

    if (loading) {
        return <p className="text-center mt-6 text-gray-500">Carregando comunicados...</p>;
    }

    return (
        <ProtectedRoute>
            <div className="max-w-4xl mx-auto mt-10 bg-white rounded-2xl shadow-lg p-6">

                <button
                    onClick={() => router.push("/intentions/list")}
                    className="flex items-center gap-2 text-gray-600 p-4 hover:text-gray-900 transition-colors"
                    title="Voltar para Intenções"
                >
                    <ArrowLeft size={20} />
                    Voltar para Intenções
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <Card>
                        <CardTitle>
                            <FileText className="w-5 h-5 text-blue-700" aria-hidden="true" />
                            Total
                        </CardTitle>
                        <CardContent>{stats.total}</CardContent>
                    </Card>

                    <Card>
                        <CardTitle>
                            <Bell className="w-5 h-5 text-green-700" aria-hidden="true" />
                            Hoje
                        </CardTitle>
                        <CardContent>{stats.hoje}</CardContent>
                    </Card>

                    <Card>
                        <CardTitle>
                            <MessageSquare className="w-5 h-5 text-purple-700" aria-hidden="true" />
                            Esta Semana
                        </CardTitle>
                        <CardContent>{stats.semana}</CardContent>
                    </Card>
                </div>

                {/* Cabeçalho com botões */}
                <div className="flex justify-between items-center mb-5">
                    <div className="flex items-center gap-3">

                        <h2 className="text-2xl font-semibold text-gray-800">
                            Comunicados ({comunicados.length})
                        </h2>
                    </div>

                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors"
                    >
                        {showForm ? (
                            <>
                                <X size={18} />
                                Cancelar
                            </>
                        ) : (
                            <>
                                <Plus size={18} />
                                Novo Comunicado
                            </>
                        )}
                    </button>
                </div>

                {/* Formulário de Novo Comunicado */}
                {showForm && (
                    <div className="bg-gray-50 rounded-lg p-5 mb-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Publicar Comunicado</h3>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Título
                                </label>
                                <Input
                                    {...register("titulo", { required: "O título é obrigatório" })}
                                    placeholder="Digite o título do comunicado"
                                    className={`${errors.titulo
                                            ? "border-red-500 focus:ring-red-500"
                                            : "border-gray-300 focus:ring-sky-500"
                                        }`}
                                />
                                {errors.titulo && (
                                    <p className="text-sm text-red-500 mt-1">{errors.titulo.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Conteúdo
                                </label>
                                <textarea
                                    {...register("conteudo", { required: "O conteúdo é obrigatório" })}
                                    rows={4}
                                    placeholder="Digite o conteúdo do comunicado"
                                    className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 resize-none ${errors.conteudo
                                            ? "border-red-500 focus:ring-red-500"
                                            : "border-gray-300 focus:ring-sky-500"
                                        }`}
                                />
                                {errors.conteudo && (
                                    <p className="text-sm text-red-500 mt-1">{errors.conteudo.message}</p>
                                )}
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 bg-sky-600 text-white font-medium py-2 rounded-lg hover:bg-sky-700 transition-colors disabled:opacity-50"
                                >
                                    {isSubmitting ? "Publicando..." : "Publicar"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        reset();
                                    }}
                                    className="flex-1 bg-gray-500 text-white font-medium py-2 rounded-lg hover:bg-gray-600 transition-colors"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Lista de Comunicados */}
                {comunicados.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Nenhum comunicado publicado ainda.</p>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {comunicados.map((comunicado) => (
                            <Card key={comunicado.id} className="relative hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <CardTitle className="text-lg font-semibold text-gray-800 mb-3">
                                            {comunicado.titulo}
                                        </CardTitle>

                                        <CardContent className="text-gray-600 whitespace-pre-wrap mb-4 p-0 text-sm">
                                            {comunicado.conteudo}
                                        </CardContent>

                                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-3">
                                            <span className="font-medium text-gray-700 flex items-center gap-2">
                                                <MessageSquare size={16} className="text-sky-600" />
                                                {comunicado.autor}
                                            </span>
                                            <span>•</span>
                                            <span className="flex items-center gap-2">
                                                {formatarData(comunicado.criadoEm)}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => deletarComunicado(comunicado.id)}
                                        className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50"
                                        title="Excluir comunicado"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}
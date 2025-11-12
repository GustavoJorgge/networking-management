'use client'

import { Intention } from "@/@types/intention";
import { Card, CardContent, CardTitle } from "@/app/components/ui/input/card";
import { api } from "@/lib/api/axios";
import axios from "axios";
import { CheckCircle, Filter, Trash2, UserCheck2, UserPlus, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function ListaIntencoes() {
  const [intencoes, setIntencoes] = useState<Intention[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFiltro, setStatusFiltro] = useState<"TODOS" | "PENDENTE" | "APROVADA" | "REJEITADA">("TODOS");
  const [stats, setStats] = useState({ pendentes: 0, aprovadas: 0, rejeitadas: 0, total: 0 });

  useEffect(() => {
    fetchIntencoes();
    fetchEstatisticas();
  }, []);

  async function fetchIntencoes() {
    try {
      const { data } = await axios.get(api.defaults.baseURL + "/intencoes");
      setIntencoes(data);
    } catch (error) {
      toast.error("Erro ao carregar intenções");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function atualizarStatus(id: string, status: "APROVADA" | "REJEITADA") {
    try {
      await axios.put(api.defaults.baseURL + `/intencoes/${id}/status`, { status });
      toast.success(`Intenção ${status === "APROVADA" ? "aprovada" : "rejeitada"} com sucesso`);
      fetchIntencoes();
      fetchEstatisticas();
    } catch (error) {
      toast.error("Erro ao atualizar status");
      console.error(error);
    }
  }

  async function deletarIntencao(id: string) {
    try {
      console.log('Deletando intenção com ID:', id);
      await axios.delete(api.defaults.baseURL + `/intencoes/${id}`);
      toast.success("Intenção excluída com sucesso");
      setIntencoes(prev => prev.filter(item => item.id !== id));
      fetchEstatisticas();
    } catch (error) {
      toast.error("Erro ao excluir intenção");
      console.error(error);
    }
  }

  async function fetchEstatisticas(params?: Record<string, unknown>) {
    try {
      const { data } = await api.get('/intencoes/estatisticas', { params });
      setStats({
        pendentes: data.pendentes?.length ?? 0,
        aprovadas: data.aprovadas?.length ?? 0,
        rejeitadas: data.rejeitadas?.length ?? 0,
        total:
          (data.pendentes?.length ?? 0) +
          (data.aprovadas?.length ?? 0) +
          (data.rejeitadas?.length ?? 0),
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  }

  const intencoesFiltradas =
    statusFiltro === "TODOS"
      ? intencoes
      : intencoes.filter(item => item.status === statusFiltro);

  if (loading) {
    return <p className="text-center mt-6 text-gray-500">Carregando intenções...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white rounded-2xl shadow-lg p-6">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardTitle>
            <UserPlus className="w-5 h-5 text-yellow-700" aria-hidden="true" />
            Pendentes
          </CardTitle>
          <CardContent>{stats.pendentes}</CardContent>
        </Card>

        <Card>
          <CardTitle>
            <CheckCircle className="w-5 h-5 text-green-700" aria-hidden="true" />
            Aprovados
          </CardTitle>
          <CardContent>{stats.aprovadas}</CardContent>
        </Card>

        <Card>
          <CardTitle>
            <XCircle className="w-5 h-5 text-red-700" aria-hidden="true" />
            Rejeitados
          </CardTitle>
          <CardContent>{stats.rejeitadas}</CardContent>
        </Card>

        <Card>
          <CardTitle>
            <UserCheck2 className="w-5 h-5 text-blue-700" aria-hidden="true" />
            Total
          </CardTitle>
          <CardContent>{stats.total}</CardContent>
        </Card>
      </div>

      {/* Filtro de status */}
      <div className="flex items-center gap-3 mb-5">
        <Filter className="w-5 h-5 text-gray-600" />
        <select
          value={statusFiltro}
           
          onChange={(e) => setStatusFiltro(e.target.value as "TODOS" | "PENDENTE" | "APROVADA" | "REJEITADA")}
          className="border border-gray-300 rounded-lg px-3 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="TODOS">Todos</option>
          <option value="PENDENTE">Pendentes</option>
          <option value="APROVADA">Aprovadas</option>
          <option value="REJEITADA">Rejeitadas</option>
        </select>
      </div>

      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Intenções de Participar ({intencoesFiltradas.length})
      </h2>

      {intencoesFiltradas.length === 0 ? (
        <p className="text-gray-500 text-center">Nenhuma intenção encontrada.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {intencoesFiltradas.map((item) => (
            <li key={item.id} className="py-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.email}</p>
                  <p className="text-sm text-gray-500">{item.empresa}</p>
                  <p className="text-sm text-gray-600 mt-2">{item.motivo}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      item.status === "APROVADA"
                        ? "bg-green-100 text-green-700"
                        : item.status === "REJEITADA"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {item.status}
                  </span>

                  <div className="flex gap-2">
                    {item.status === "PENDENTE" && (
                      <>
                        <button
                          onClick={() => atualizarStatus(item.id, "APROVADA")}
                          className="text-green-600 hover:text-green-800"
                          title="Aprovar"
                        >
                          <CheckCircle size={22} />
                        </button>
                        <button
                          onClick={() => atualizarStatus(item.id, "REJEITADA")}
                          className="text-red-600 hover:text-red-800"
                          title="Rejeitar"
                        >
                          <XCircle size={22} />
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => deletarIntencao(item.id)}
                      className="text-gray-500 hover:text-red-700"
                      title="Excluir intenção"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

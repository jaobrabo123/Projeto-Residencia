// Dados de exemplo enquanto o sistema da escola não está conectado.
// Substituir por dados reais (login/API) quando estiverem disponíveis.

export type StatusProtocolo = "analise" | "aprovado" | "concluido";

export const STATUS = {
  analise: { rotulo: "Em análise", cor: "#D97706", fundo: "#FBF0C0" },
  aprovado: { rotulo: "Aprovado", cor: "#059669", fundo: "#D9F7E6" },
  concluido: { rotulo: "Concluído", cor: "#4338CA", fundo: "#EEEEFD" },
};

export type EtapaProtocolo = {
  titulo: string;
  data: string;
  // false = etapa ainda não aconteceu.
  concluida: boolean;
};

export type Protocolo = {
  titulo: string;
  codigo: string;
  data: string;
  status: StatusProtocolo;
  descricao: string;
  observacoes: string;
  etapas: EtapaProtocolo[];
};

export const PROTOCOLOS: Protocolo[] = [
  {
    titulo: "Troca de Escola",
    codigo: "P20240087",
    data: "15/08/2024",
    status: "analise",
    descricao: "Solicitação de transferência para outra unidade escolar.",
    observacoes:
      "Mudança de bairro da família. Solicito transferência para a unidade mais próxima da nova residência.",
    etapas: [
      { titulo: "Solicitação enviada", data: "15/08/2024", concluida: true },
      { titulo: "Recebida pela secretaria", data: "16/08/2024", concluida: true },
      { titulo: "Em análise", data: "19/08/2024", concluida: true },
      { titulo: "Aprovação", data: "Aguardando", concluida: false },
      { titulo: "Concluído", data: "Aguardando", concluida: false },
    ],
  },
  {
    titulo: "Segunda Chamada de Prova",
    codigo: "P20240063",
    data: "02/08/2024",
    status: "aprovado",
    descricao: "Para alunos que perderam avaliação por motivo justificado.",
    observacoes:
      "Ausência na prova de Matemática do dia 31/07 por motivo de saúde. Atestado anexado.",
    etapas: [
      { titulo: "Solicitação enviada", data: "02/08/2024", concluida: true },
      { titulo: "Recebida pela secretaria", data: "02/08/2024", concluida: true },
      { titulo: "Em análise", data: "05/08/2024", concluida: true },
      { titulo: "Aprovação", data: "08/08/2024", concluida: true },
      { titulo: "Concluído", data: "Aguardando", concluida: false },
    ],
  },
  {
    titulo: "Declaração Escolar",
    codigo: "P20240041",
    data: "20/07/2024",
    status: "concluido",
    descricao: "Comprovante de vínculo ativo com a escola.",
    observacoes: "Declaração necessária para apresentação em convênio médico.",
    etapas: [
      { titulo: "Solicitação enviada", data: "20/07/2024", concluida: true },
      { titulo: "Recebida pela secretaria", data: "20/07/2024", concluida: true },
      { titulo: "Em análise", data: "22/07/2024", concluida: true },
      { titulo: "Aprovação", data: "22/07/2024", concluida: true },
      { titulo: "Concluído", data: "23/07/2024", concluida: true },
    ],
  },
  {
    titulo: "Histórico Escolar",
    codigo: "P20240028",
    data: "05/07/2024",
    status: "concluido",
    descricao: "Documento com todas as notas e aprovações anteriores.",
    observacoes: "Solicitação de via impressa do histórico escolar.",
    etapas: [
      { titulo: "Solicitação enviada", data: "05/07/2024", concluida: true },
      { titulo: "Recebida pela secretaria", data: "05/07/2024", concluida: true },
      { titulo: "Em análise", data: "08/07/2024", concluida: true },
      { titulo: "Aprovação", data: "09/07/2024", concluida: true },
      { titulo: "Concluído", data: "12/07/2024", concluida: true },
    ],
  },
];

export type TipoSolicitacao = {
  id: string;
  icone: string;
  titulo: string;
  descricao: string;
};

export const TIPOS_SOLICITACAO: TipoSolicitacao[] = [
  {
    id: "troca-escola",
    icone: "🏫",
    titulo: "Troca de Escola",
    descricao: "Solicitação de transferência para outra unidade escolar.",
  },
  {
    id: "segunda-chamada",
    icone: "📝",
    titulo: "Segunda Chamada de Prova",
    descricao: "Para alunos que perderam avaliação por motivo justificado.",
  },
  {
    id: "declaracao",
    icone: "📄",
    titulo: "Declaração de Matrícula",
    descricao: "Comprovante de vínculo ativo com a escola.",
  },
  {
    id: "historico",
    icone: "📋",
    titulo: "Histórico Escolar",
    descricao: "Documento com todas as notas e aprovações anteriores.",
  },
  {
    id: "atestado",
    icone: "🩺",
    titulo: "Apresentar atestado",
    descricao: "Envie foto ou PDF do atestado.",
  },
  {
    id: "outro",
    icone: "📮",
    titulo: "Outro requerimento",
    descricao: "Solicitações diversas à secretaria escolar.",
  },
];

// Histórico escolar (notas finais por ano).
export type AnoLetivo = {
  ano: number;
  serie: string;
  notas: { disciplina: string; nota: number }[];
};

const DISCIPLINAS_HISTORICO = [
  "Língua Portuguesa",
  "Matemática",
  "Ciências",
  "História",
  "Geografia",
  "Inglês",
  "Arte",
  "Educação Física",
];

function anoLetivo(ano: number, serie: string, notas: number[]): AnoLetivo {
  return {
    ano,
    serie,
    notas: DISCIPLINAS_HISTORICO.map((disciplina, i) => ({
      disciplina,
      nota: notas[i],
    })),
  };
}

export const HISTORICO: AnoLetivo[] = [
  anoLetivo(2023, "8º Ano", [8.2, 7.0, 8.8, 7.5, 7.8, 9.1, 9.5, 10.0]),
  anoLetivo(2022, "7º Ano", [7.6, 6.8, 8.0, 7.2, 7.4, 8.5, 9.0, 9.8]),
  anoLetivo(2021, "6º Ano", [7.9, 7.1, 8.3, 7.0, 7.6, 8.8, 9.2, 9.5]),
];

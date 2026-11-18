import { router, Stack } from "expo-router";
import { ArrowLeft, BookOpen, Info } from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CartaoDisciplina, type Destaque } from "@/components/cartao-disciplina";

// ---------------------------------------------------------------------------
// Configuração e dados de exemplo
// ---------------------------------------------------------------------------

const ANO_LETIVO = 2024;

// Média mínima para aprovação (escala de 0 a 10).
// Ajustar conforme o regimento da escola.
const MEDIA_MINIMA = 6;

const AVALIACOES = ["Prova", "Trabalho", "Atividades"] as const;

// Notas de cada bimestre, na ordem de AVALIACOES.
// null = bimestre ainda sem notas lançadas.
type NotasBimestre = [number, number, number] | null;

type Disciplina = {
  id: string;
  nome: string;
  professor: string;
  bimestres: [NotasBimestre, NotasBimestre, NotasBimestre, NotasBimestre];
};

// Dados de exemplo enquanto o sistema da escola não está conectado.
// Substituir por dados reais (login/API) quando estiverem disponíveis.
const DISCIPLINAS: Disciplina[] = [
  {
    id: "mat",
    nome: "Matemática",
    professor: "Prof. Ricardo Alves",
    bimestres: [[6.5, 7, 8], [5, 6, 7], [4.5, 5.5, 6], null],
  },
  {
    id: "por",
    nome: "Língua Portuguesa",
    professor: "Profª. Helena Costa",
    bimestres: [[8, 8.5, 9], [7.5, 8, 9], [8, 9, 9.5], null],
  },
  {
    id: "his",
    nome: "História",
    professor: "Prof. Marcos Lima",
    bimestres: [[7, 8, 8], [8, 7.5, 9], [7, 8, 8.5], null],
  },
  {
    id: "geo",
    nome: "Geografia",
    professor: "Profª. Sandra Rocha",
    bimestres: [[6, 7, 7.5], [6.5, 7, 8], [7, 7, 8], null],
  },
  {
    id: "cie",
    nome: "Ciências",
    professor: "Profª. Juliana Prado",
    bimestres: [[7.5, 8, 8.5], [8, 8, 9], [7, 7.5, 8], null],
  },
  {
    id: "ing",
    nome: "Inglês",
    professor: "Prof. Daniel Souza",
    bimestres: [[9, 9, 10], [8.5, 9, 9.5], [9, 8.5, 10], null],
  },
  {
    id: "art",
    nome: "Artes",
    professor: "Profª. Camila Reis",
    bimestres: [[8, 9, 9], [8.5, 9, 9], [9, 9, 9.5], null],
  },
  {
    id: "edf",
    nome: "Educação Física",
    professor: "Prof. Bruno Martins",
    bimestres: [[9, 9.5, 10], [9, 9, 10], [9.5, 9, 10], null],
  },
];

// ---------------------------------------------------------------------------
// Cálculos
// ---------------------------------------------------------------------------

// 0..3 = bimestres; 4 = visão anual.
const ANUAL = 4;
type Bimestre = 0 | 1 | 2 | 3;
type Periodo = Bimestre | typeof ANUAL;
const PERIODOS: { id: Periodo; rotulo: string }[] = [
  { id: 0, rotulo: "1º Bim" },
  { id: 1, rotulo: "2º Bim" },
  { id: 2, rotulo: "3º Bim" },
  { id: 3, rotulo: "4º Bim" },
  { id: ANUAL, rotulo: "Anual" },
];

function media(valores: number[]): number | null {
  if (valores.length === 0) return null;
  return valores.reduce((soma, v) => soma + v, 0) / valores.length;
}

function mediaBimestre(notas: NotasBimestre): number | null {
  return notas ? media(notas) : null;
}

// Média anual parcial: considera só os bimestres já lançados.
function mediaAnual(disciplina: Disciplina): number | null {
  return media(
    disciplina.bimestres
      .map(mediaBimestre)
      .filter((m): m is number => m !== null),
  );
}

function mediaNoPeriodo(disciplina: Disciplina, periodo: Periodo) {
  return periodo === ANUAL
    ? mediaAnual(disciplina)
    : mediaBimestre(disciplina.bimestres[periodo]);
}

function bimestreLancado(periodo: Periodo) {
  return periodo === ANUAL || DISCIPLINAS.some((d) => d.bimestres[periodo]);
}

// Último bimestre com notas, para abrir a tela já nele.
function ultimoBimestreLancado(): Periodo {
  for (let i = 3; i >= 0; i--) {
    if (bimestreLancado(i as Bimestre)) return i as Bimestre;
  }
  return ANUAL;
}

// 7.25 -> "7,3"
function formatarNota(nota: number | null) {
  return nota === null ? "—" : nota.toFixed(1).replace(".", ",");
}

const COR_OK = "#16A34A";
const COR_BAIXA = "#E5252A";
const COR_SEM_NOTA = "#94A3B8";

function corDaNota(nota: number | null) {
  if (nota === null) return COR_SEM_NOTA;
  return nota >= MEDIA_MINIMA ? COR_OK : COR_BAIXA;
}

// ---------------------------------------------------------------------------
// Tela
// ---------------------------------------------------------------------------

export default function Boletim() {
  const [periodo, setPeriodo] = useState<Periodo>(ultimoBimestreLancado);

  const medias = DISCIPLINAS.map((d) => mediaNoPeriodo(d, periodo));
  const lancadas = medias.filter((m): m is number => m !== null);
  const mediaGeral = media(lancadas);
  const naMedia = lancadas.filter((m) => m >= MEDIA_MINIMA).length;
  const abaixo = lancadas.length - naMedia;

  function voltar() {
    if (router.canGoBack()) router.back();
    else router.replace("/inicio");
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        contentContainerStyle={styles.rolagem}
        showsVerticalScrollIndicator={false}
      >
        {/* Cabeçalho */}
        <SafeAreaView edges={["top", "left", "right"]} style={styles.cabecalho}>
          <View style={styles.cabecalhoLinha}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Voltar"
              style={styles.botaoCabecalho}
              onPress={voltar}
            >
              <ArrowLeft size={20} color="#FFFFFF" />
            </Pressable>

            <View style={styles.cabecalhoTexto}>
              <Text style={styles.cabecalhoTitulo}>Boletim</Text>
              <Text style={styles.cabecalhoSub}>
                Notas por disciplina · {ANO_LETIVO}
              </Text>
            </View>

            <View style={styles.botaoCabecalho}>
              <BookOpen size={20} color="#FFFFFF" />
            </View>
          </View>

          {/* Resumo do período */}
          <View style={styles.resumo}>
            <Resumo
              valor={formatarNota(mediaGeral)}
              rotulo="Média geral"
              cor={mediaGeral === null ? "#DCE6FF" : "#6EE7A8"}
            />
            <Resumo valor={String(naMedia)} rotulo="Na média" cor="#6EE7A8" />
            <Resumo
              valor={String(abaixo)}
              rotulo="Abaixo"
              cor={abaixo > 0 ? "#FF9DB1" : "#6EE7A8"}
            />
          </View>
        </SafeAreaView>

        <View style={styles.conteudo}>
          {/* Seletor de período */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.periodos}
            accessibilityRole="tablist"
          >
            {PERIODOS.map((p) => {
              const ativo = p.id === periodo;
              return (
                <Pressable
                  key={p.id}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: ativo }}
                  onPress={() => setPeriodo(p.id)}
                  style={[styles.periodo, ativo && styles.periodoAtivo]}
                >
                  <Text
                    style={[
                      styles.periodoTexto,
                      ativo && styles.periodoTextoAtivo,
                    ]}
                  >
                    {p.rotulo}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {!bimestreLancado(periodo) && (
            <View style={styles.aviso}>
              <Info size={16} color="#1D4ED8" />
              <Text style={styles.avisoTexto}>
                As notas deste bimestre ainda não foram lançadas pelos
                professores.
              </Text>
            </View>
          )}

          <Text style={styles.secaoTitulo}>
            {periodo === ANUAL ? "MÉDIA ANUAL PARCIAL" : "DISCIPLINAS"}
          </Text>

          {DISCIPLINAS.map((disciplina, i) => (
            <LinhaDisciplina
              // A chave muda com o período para fechar os cartões abertos.
              key={`${disciplina.id}-${periodo}`}
              disciplina={disciplina}
              periodo={periodo}
              nota={medias[i]}
            />
          ))}

          <Text style={styles.rodape}>
            Média mínima para aprovação: {formatarNota(MEDIA_MINIMA)}. A média
            anual considera apenas os bimestres já lançados.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Componentes de apoio
// ---------------------------------------------------------------------------

function Resumo({
  valor,
  rotulo,
  cor,
}: {
  valor: string;
  rotulo: string;
  cor: string;
}) {
  return (
    <View style={styles.resumoCard}>
      <Text style={[styles.resumoValor, { color: cor }]}>{valor}</Text>
      <Text style={styles.resumoRotulo}>{rotulo}</Text>
    </View>
  );
}

function LinhaDisciplina({
  disciplina,
  periodo,
  nota,
}: {
  disciplina: Disciplina;
  periodo: Periodo;
  nota: number | null;
}) {
  const destaque: Destaque = {
    valor: formatarNota(nota),
    rotulo: periodo === ANUAL ? "média anual" : "média",
    cor: corDaNota(nota),
  };

  const etiqueta =
    nota === null
      ? undefined
      : nota >= MEDIA_MINIMA
        ? { texto: "Na média", cor: COR_OK, fundo: "#DCFCE7" }
        : { texto: "Abaixo da média", cor: COR_BAIXA, fundo: "#FFE1E1" };

  // Bimestre sem notas: o cartão não abre.
  if (nota === null) {
    return (
      <CartaoDisciplina
        nome={disciplina.nome}
        subtitulo={disciplina.professor}
        destaque={{ ...destaque, rotulo: "sem nota" }}
      />
    );
  }

  return (
    <CartaoDisciplina
      nome={disciplina.nome}
      subtitulo={disciplina.professor}
      destaque={destaque}
      etiqueta={etiqueta}
    >
      {periodo === ANUAL ? (
        <DetalheAnual disciplina={disciplina} />
      ) : (
        <DetalheBimestre notas={disciplina.bimestres[periodo]} />
      )}
    </CartaoDisciplina>
  );
}

function DetalheBimestre({ notas }: { notas: NotasBimestre }) {
  if (!notas) return null;

  return (
    <View>
      {AVALIACOES.map((avaliacao, i) => (
        <LinhaNota key={avaliacao} rotulo={avaliacao} nota={notas[i]} />
      ))}
    </View>
  );
}

function DetalheAnual({ disciplina }: { disciplina: Disciplina }) {
  return (
    <View style={styles.gradeBimestres}>
      {disciplina.bimestres.map((notas, i) => {
        const nota = mediaBimestre(notas);
        return (
          <View key={i} style={styles.celulaBimestre}>
            <Text style={styles.celulaRotulo}>{i + 1}º Bim</Text>
            <Text style={[styles.celulaValor, { color: corDaNota(nota) }]}>
              {formatarNota(nota)}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

function LinhaNota({ rotulo, nota }: { rotulo: string; nota: number }) {
  return (
    <View style={styles.linhaNota}>
      <Text style={styles.linhaNotaRotulo}>{rotulo}</Text>
      <Text style={[styles.linhaNotaValor, { color: corDaNota(nota) }]}>
        {formatarNota(nota)}
      </Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FC",
  },

  rolagem: {
    flexGrow: 1,
    paddingBottom: 32,
  },

  // Cabeçalho
  cabecalho: {
    backgroundColor: "#1D4ED8",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },

  cabecalhoLinha: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  botaoCabecalho: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
  },

  cabecalhoTexto: {
    flex: 1,
  },

  cabecalhoTitulo: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },

  cabecalhoSub: {
    color: "#DCE6FF",
    fontSize: 13,
    marginTop: 3,
  },

  // Resumo
  resumo: {
    flexDirection: "row",
    gap: 8,
    marginTop: 20,
  },

  resumoCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.14)",
  },

  resumoValor: {
    fontSize: 20,
    fontWeight: "bold",
  },

  resumoRotulo: {
    color: "#DCE6FF",
    fontSize: 12,
    marginTop: 4,
  },

  // Conteúdo
  conteudo: {
    width: "100%",
    maxWidth: 440,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  // Seletor de período
  periodos: {
    gap: 8,
    paddingBottom: 4,
  },

  periodo: {
    minHeight: 40,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D3DDF4",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  periodoAtivo: {
    backgroundColor: "#1D4ED8",
    borderColor: "#1D4ED8",
  },

  periodoTexto: {
    color: "#475569",
    fontSize: 13,
    fontWeight: "600",
  },

  periodoTextoAtivo: {
    color: "#FFFFFF",
  },

  // Aviso de bimestre sem notas
  aviso: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 16,
    padding: 14,
    borderRadius: 16,
    backgroundColor: "#EEF2FF",
    borderWidth: 1,
    borderColor: "#D3DDF4",
  },

  avisoTexto: {
    flex: 1,
    color: "#0B1B44",
    fontSize: 13,
    lineHeight: 19,
  },

  secaoTitulo: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1.2,
    marginTop: 20,
    marginBottom: 12,
  },

  // Detalhe do bimestre
  linhaNota: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },

  linhaNotaRotulo: {
    color: "#475569",
    fontSize: 13,
  },

  linhaNotaValor: {
    fontSize: 14,
    fontWeight: "bold",
  },

  // Detalhe anual
  gradeBimestres: {
    flexDirection: "row",
    gap: 8,
  },

  celulaBimestre: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E3E9F5",
  },

  celulaRotulo: {
    color: "#7486A8",
    fontSize: 11,
  },

  celulaValor: {
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 4,
  },

  rodape: {
    color: "#7486A8",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 12,
    textAlign: "center",
  },
});

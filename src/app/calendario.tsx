import { router, Stack } from "expo-router";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ---------------------------------------------------------------------------
// Configuração e dados de exemplo
// ---------------------------------------------------------------------------

const ANO_LETIVO = 2024;

// Dia "de hoje" dos dados de exemplo (usado em "Próximos eventos").
// Substituir por new Date() quando os dados vierem do sistema da escola.
const HOJE = { ano: 2024, mes: 7, dia: 28 }; // mes: 0 = janeiro

type TipoEvento = "feriado" | "recesso" | "prova" | "reuniao" | "entrega";

const TIPOS: Record<
  TipoEvento,
  { rotulo: string; cor: string; fundo: string; borda: string }
> = {
  feriado: {
    rotulo: "Feriado",
    cor: "#DC2626",
    fundo: "#FEE2E2",
    borda: "#FECACA",
  },
  recesso: {
    rotulo: "Recesso",
    cor: "#D97706",
    fundo: "#FEF3C7",
    borda: "#FDE68A",
  },
  prova: {
    rotulo: "Prova",
    cor: "#1D4ED8",
    fundo: "#DBEAFE",
    borda: "#BFDBFE",
  },
  reuniao: {
    rotulo: "Reunião",
    cor: "#16A34A",
    fundo: "#DCFCE7",
    borda: "#BBF7D0",
  },
  entrega: {
    rotulo: "Entrega de atividade",
    cor: "#7C3AED",
    fundo: "#EDE9FE",
    borda: "#DDD6FE",
  },
};

// Ordem da legenda (duas colunas, como no protótipo).
const LEGENDA: TipoEvento[] = ["feriado", "recesso", "prova", "reuniao", "entrega"];

type Evento = {
  ano: number;
  mes: number; // 0 = janeiro
  dia: number;
  tipo: TipoEvento;
  titulo: string;
  detalhe?: string;
  hora?: string;
};

const EVENTOS: Evento[] = [
  { ano: 2024, mes: 7, dia: 7, tipo: "feriado", titulo: "Feriado escolar", detalhe: "Sem aula" },
  { ano: 2024, mes: 7, dia: 15, tipo: "prova", titulo: "Prova de Matemática", detalhe: "Matemática", hora: "07:00" },
  { ano: 2024, mes: 7, dia: 16, tipo: "prova", titulo: "Prova de História", detalhe: "História", hora: "07:00" },
  { ano: 2024, mes: 7, dia: 19, tipo: "prova", titulo: "Prova de Língua Portuguesa", detalhe: "Língua Portuguesa", hora: "07:00" },
  { ano: 2024, mes: 7, dia: 19, tipo: "prova", titulo: "Prova de Geografia", detalhe: "Geografia", hora: "09:00" },
  { ano: 2024, mes: 7, dia: 20, tipo: "prova", titulo: "Prova de Ciências", detalhe: "Ciências", hora: "07:00" },
  { ano: 2024, mes: 7, dia: 28, tipo: "entrega", titulo: "Entrega: Lista de exercícios Cap.7", detalhe: "Matemática", hora: "11:00" },
  { ano: 2024, mes: 7, dia: 30, tipo: "entrega", titulo: "Entrega: Lista de exercícios Cap.7", detalhe: "Matemática", hora: "23:59" },
  { ano: 2024, mes: 7, dia: 30, tipo: "reuniao", titulo: "Reunião de Pais e Mestres", detalhe: "Auditório", hora: "18:00" },
  { ano: 2024, mes: 8, dia: 2, tipo: "entrega", titulo: "Entrega: Resenha — Revolução Industrial", detalhe: "História", hora: "11:00" },
  { ano: 2024, mes: 8, dia: 5, tipo: "entrega", titulo: "Entrega: Relatório de experimento", detalhe: "Ciências", hora: "11:00" },
  { ano: 2024, mes: 8, dia: 7, tipo: "feriado", titulo: "Independência do Brasil", detalhe: "Sem aula" },
  { ano: 2024, mes: 8, dia: 15, tipo: "reuniao", titulo: "Prazo de rematrícula", detalhe: "Secretaria", hora: "17:00" },
];

const MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const MESES_CURTOS = [
  "JAN",
  "FEV",
  "MAR",
  "ABR",
  "MAI",
  "JUN",
  "JUL",
  "AGO",
  "SET",
  "OUT",
  "NOV",
  "DEZ",
];

const DIAS_SEMANA = ["D", "S", "T", "Q", "Q", "S", "S"];

// ---------------------------------------------------------------------------
// Utilidades de data (sem depender de Intl)
// ---------------------------------------------------------------------------

type Dia = { ano: number; mes: number; dia: number };

function pad(n: number) {
  return String(n).padStart(2, "0");
}

// 28/08/2024
function formatarData({ ano, mes, dia }: Dia) {
  return `${pad(dia)}/${pad(mes + 1)}/${ano}`;
}

// Valor numérico comparável (AAAAMMDD).
function chave({ ano, mes, dia }: Dia) {
  return ano * 10000 + mes * 100 + dia;
}

function mesmoDia(a: Dia, b: Dia) {
  return chave(a) === chave(b);
}

function eventosDoDia(dia: Dia) {
  return EVENTOS.filter((e) => mesmoDia(e, dia));
}

// Semanas do mês: cada semana tem 7 posições (null = fora do mês).
function montarSemanas(ano: number, mes: number): (number | null)[][] {
  const primeiro = new Date(ano, mes, 1).getDay();
  const total = new Date(ano, mes + 1, 0).getDate();

  const celulas: (number | null)[] = [
    ...Array<null>(primeiro).fill(null),
    ...Array.from({ length: total }, (_, i) => i + 1),
  ];
  while (celulas.length % 7 !== 0) celulas.push(null);

  const semanas: (number | null)[][] = [];
  for (let i = 0; i < celulas.length; i += 7) {
    semanas.push(celulas.slice(i, i + 7));
  }
  return semanas;
}

// ---------------------------------------------------------------------------
// Tela
// ---------------------------------------------------------------------------

export default function Calendario() {
  const [mesVisivel, setMesVisivel] = useState({
    ano: HOJE.ano,
    mes: HOJE.mes,
  });
  const [selecionado, setSelecionado] = useState<Dia>(HOJE);

  const semanas = montarSemanas(mesVisivel.ano, mesVisivel.mes);
  const eventosSelecionado = eventosDoDia(selecionado);

  // Eventos a partir do dia selecionado (inclusive).
  const proximos = EVENTOS.filter((e) => chave(e) >= chave(selecionado))
    .sort((a, b) => chave(a) - chave(b))
    .slice(0, 6);

  function voltar() {
    if (router.canGoBack()) router.back();
    else router.replace("/inicio");
  }

  function mudarMes(delta: number) {
    setMesVisivel(({ ano, mes }) => {
      const data = new Date(ano, mes + delta, 1);
      return { ano: data.getFullYear(), mes: data.getMonth() };
    });
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Cabeçalho */}
      <SafeAreaView edges={["top", "left", "right"]} style={styles.cabecalho}>
        <View style={styles.cabecalhoLinha}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            style={styles.botaoCabecalho}
            onPress={voltar}
          >
            <ChevronLeft size={22} color="#FFFFFF" />
          </Pressable>

          <View style={styles.cabecalhoTexto}>
            <Text style={styles.titulo}>Calendário Escolar</Text>
            <Text style={styles.subtitulo}>
              Mobile Educational · Ano letivo {ANO_LETIVO}
            </Text>
          </View>
        </View>

        <View style={styles.navegacaoMes}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Mês anterior"
            style={styles.botaoCabecalho}
            onPress={() => mudarMes(-1)}
          >
            <ChevronLeft size={20} color="#FFFFFF" />
          </Pressable>

          <Text style={styles.mesTitulo}>
            {MESES[mesVisivel.mes]} {mesVisivel.ano}
          </Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Próximo mês"
            style={styles.botaoCabecalho}
            onPress={() => mudarMes(1)}
          >
            <ChevronRight size={20} color="#FFFFFF" />
          </Pressable>
        </View>
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={styles.rolagem}
        showsVerticalScrollIndicator={false}
      >
        {/* Grade do mês */}
        <View style={styles.semana}>
          {DIAS_SEMANA.map((letra, i) => (
            <Text key={i} style={styles.diaSemana}>
              {letra}
            </Text>
          ))}
        </View>

        {semanas.map((semana, i) => (
          <View key={i} style={styles.semana}>
            {semana.map((numero, j) => {
              if (numero === null) return <View key={j} style={styles.celula} />;

              const dia: Dia = {
                ano: mesVisivel.ano,
                mes: mesVisivel.mes,
                dia: numero,
              };

              return (
                <CelulaDia
                  key={j}
                  dia={dia}
                  eventos={eventosDoDia(dia)}
                  selecionado={mesmoDia(dia, selecionado)}
                  aoPressionar={() => setSelecionado(dia)}
                />
              );
            })}
          </View>
        ))}

        {/* Legenda */}
        <View style={styles.legenda}>
          {LEGENDA.map((tipo) => (
            <View key={tipo} style={styles.legendaItem}>
              <View
                style={[styles.legendaPonto, { backgroundColor: TIPOS[tipo].cor }]}
              />
              <Text style={styles.legendaTexto}>{TIPOS[tipo].rotulo}</Text>
            </View>
          ))}
        </View>

        {/* Dia selecionado */}
        <Text style={styles.secaoTitulo}>{formatarData(selecionado)}</Text>

        {eventosSelecionado.length === 0 ? (
          <Text style={styles.semEventos}>Nenhum evento neste dia.</Text>
        ) : (
          eventosSelecionado.map((evento, i) => (
            <CartaoEventoDia key={i} evento={evento} />
          ))
        )}

        {/* Próximos eventos */}
        <Text style={[styles.secaoTitulo, styles.secaoEspaco]}>
          PRÓXIMOS EVENTOS
        </Text>

        {proximos.length === 0 ? (
          <Text style={styles.semEventos}>Nenhum evento próximo.</Text>
        ) : (
          proximos.map((evento, i) => (
            <CartaoProximo key={i} evento={evento} />
          ))
        )}
      </ScrollView>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Componentes de apoio
// ---------------------------------------------------------------------------

function CelulaDia({
  dia,
  eventos,
  selecionado,
  aoPressionar,
}: {
  dia: Dia;
  eventos: Evento[];
  selecionado: boolean;
  aoPressionar: () => void;
}) {
  const principal = eventos.length > 0 ? TIPOS[eventos[0].tipo] : null;

  return (
    <View style={styles.celula}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${dia.dia} de ${MESES[dia.mes]}${
          eventos.length > 0 ? `, ${eventos.length} evento(s)` : ""
        }`}
        accessibilityState={{ selected: selecionado }}
        onPress={aoPressionar}
        style={[
          styles.dia,
          principal && { backgroundColor: principal.fundo },
          selecionado && styles.diaSelecionado,
        ]}
      >
        <Text
          style={[
            styles.diaNumero,
            principal && { color: principal.cor },
            selecionado && styles.diaNumeroSelecionado,
          ]}
        >
          {dia.dia}
        </Text>

        {eventos.length > 0 && (
          <View style={styles.pontos}>
            {eventos.slice(0, 3).map((evento, i) => (
              <View
                key={i}
                style={[
                  styles.ponto,
                  {
                    backgroundColor: selecionado
                      ? "#FFFFFF"
                      : TIPOS[evento.tipo].cor,
                  },
                ]}
              />
            ))}
          </View>
        )}
      </Pressable>
    </View>
  );
}

function CartaoEventoDia({ evento }: { evento: Evento }) {
  const tipo = TIPOS[evento.tipo];

  return (
    <View
      style={[
        styles.eventoDia,
        { backgroundColor: tipo.fundo, borderColor: tipo.borda },
      ]}
    >
      <View style={[styles.eventoPonto, { backgroundColor: tipo.cor }]} />
      <View style={styles.eventoTexto}>
        <Text style={[styles.eventoTipo, { color: tipo.cor }]}>
          {tipo.rotulo.toUpperCase()}
          {evento.hora ? `  ·  ${evento.hora}` : ""}
        </Text>
        <Text style={[styles.eventoTitulo, { color: tipo.cor }]}>
          {evento.titulo}
        </Text>
        {evento.detalhe && (
          <Text style={styles.eventoDetalhe}>{evento.detalhe}</Text>
        )}
      </View>
    </View>
  );
}

function CartaoProximo({ evento }: { evento: Evento }) {
  const tipo = TIPOS[evento.tipo];

  return (
    <View style={styles.proximo}>
      <View style={[styles.proximoData, { backgroundColor: tipo.fundo }]}>
        <Text style={[styles.proximoDia, { color: tipo.cor }]}>{evento.dia}</Text>
        <Text style={[styles.proximoMes, { color: tipo.cor }]}>
          {MESES_CURTOS[evento.mes]}
        </Text>
      </View>

      <View style={styles.eventoTexto}>
        <Text style={[styles.eventoTipo, { color: tipo.cor }]}>
          {tipo.rotulo.toUpperCase()}
        </Text>
        <Text style={styles.proximoTitulo}>{evento.titulo}</Text>
        {evento.detalhe && (
          <Text style={styles.eventoDetalhe}>{evento.detalhe}</Text>
        )}
      </View>

      {evento.hora && <Text style={styles.proximoHora}>{evento.hora}</Text>}
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

  // Cabeçalho
  cabecalho: {
    backgroundColor: "#1D4ED8",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },

  cabecalhoLinha: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  botaoCabecalho: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
  },

  cabecalhoTexto: {
    flex: 1,
  },

  titulo: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },

  subtitulo: {
    color: "#DCE6FF",
    fontSize: 12,
    marginTop: 3,
  },

  navegacaoMes: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
  },

  mesTitulo: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },

  rolagem: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },

  // Grade
  semana: {
    flexDirection: "row",
  },

  diaSemana: {
    flex: 1,
    textAlign: "center",
    color: "#3B6AD8",
    fontSize: 12,
    fontWeight: "700",
    paddingVertical: 8,
  },

  celula: {
    flex: 1,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },

  dia: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  diaSelecionado: {
    backgroundColor: "#1D4ED8",
  },

  diaNumero: {
    color: "#0B1B44",
    fontSize: 14,
    fontWeight: "600",
  },

  diaNumeroSelecionado: {
    color: "#FFFFFF",
  },

  pontos: {
    flexDirection: "row",
    gap: 2,
    position: "absolute",
    bottom: 5,
  },

  ponto: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },

  // Legenda
  legenda: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 10,
    marginTop: 8,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#DDE4F3",
    backgroundColor: "#FFFFFF",
  },

  legendaItem: {
    width: "50%",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  legendaPonto: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  legendaTexto: {
    color: "#64748B",
    fontSize: 12,
  },

  // Seções
  secaoTitulo: {
    color: "#64748B",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1,
    marginTop: 20,
    marginBottom: 12,
    marginLeft: 4,
  },

  secaoEspaco: {
    marginTop: 24,
  },

  semEventos: {
    color: "#94A3B8",
    fontSize: 13,
    marginLeft: 4,
  },

  // Evento do dia selecionado
  eventoDia: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 16,
    marginBottom: 10,
    borderRadius: 16,
    borderWidth: 1,
  },

  eventoPonto: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 4,
  },

  eventoTexto: {
    flex: 1,
  },

  eventoTipo: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  eventoTitulo: {
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 4,
  },

  eventoDetalhe: {
    color: "#64748B",
    fontSize: 13,
    marginTop: 3,
  },

  // Próximos eventos
  proximo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 14,
    marginBottom: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#DDE4F3",
    backgroundColor: "#FFFFFF",
  },

  proximoData: {
    width: 48,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  proximoDia: {
    fontSize: 18,
    fontWeight: "bold",
  },

  proximoMes: {
    fontSize: 10,
    fontWeight: "700",
  },

  proximoTitulo: {
    color: "#0B1B44",
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 3,
  },

  proximoHora: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "600",
  },
});

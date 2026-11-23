import { router, Stack } from "expo-router";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Check,
  CircleAlert,
  CircleCheck,
  User,
} from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Dados de exemplo enquanto o sistema da escola não está conectado.
// Substituir por dados reais (login/API) quando estiverem disponíveis.
type Atividade = {
  id: string;
  disciplina: string;
  cor: string;
  titulo: string;
  descricao: string;
  professor: string;
  entrega: string;
  // Texto do prazo, ex.: "2d". Só aparece enquanto a atividade está pendente.
  prazo: string;
  urgente?: boolean;
  concluida: boolean;
};

const ATIVIDADES_INICIAIS: Atividade[] = [
  {
    id: "mat",
    disciplina: "Matemática",
    cor: "#1D4ED8",
    titulo: "Lista de exercícios — Capítulo 7",
    descricao:
      "Resolver as questões 1 a 15 do capítulo de geometria plana. Mostrar todos os cálculos.",
    professor: "Prof. Rogério Alves",
    entrega: "30/08/2024",
    prazo: "2d",
    urgente: true,
    concluida: false,
  },
  {
    id: "his",
    disciplina: "História",
    cor: "#D97706",
    titulo: "Resenha: A Revolução Industrial",
    descricao:
      "Escrever uma resenha de 1 a 2 páginas sobre as causas e impactos da Revolução Industrial.",
    professor: "Profa. Luísa Ferraz",
    entrega: "02/09/2024",
    prazo: "5d",
    concluida: false,
  },
  {
    id: "cie",
    disciplina: "Ciências",
    cor: "#0891B2",
    titulo: "Relatório de experimento",
    descricao:
      "Registrar os resultados do experimento de osmose realizado em sala. Incluir fotos.",
    professor: "Profa. Amanda Pires",
    entrega: "05/09/2024",
    prazo: "8d",
    concluida: false,
  },
  {
    id: "ing",
    disciplina: "Inglês",
    cor: "#7C3AED",
    titulo: "Dialogue writing — My Daily Routine",
    descricao:
      "Escrever um diálogo de 10 a 15 linhas usando present simple e time expressions.",
    professor: "Prof. Fábio Drummond",
    entrega: "09/09/2024",
    prazo: "12d",
    concluida: false,
  },
  {
    id: "por",
    disciplina: "Língua Portuguesa",
    cor: "#6366F1",
    titulo: "Análise sintática — texto jornalístico",
    descricao: "Realizar a análise sintática das três primeiras frases do texto distribuído em sala.",
    professor: "Profa. Carla Mendes",
    entrega: "23/08/2024",
    prazo: "",
    concluida: true,
  },
  {
    id: "art",
    disciplina: "Arte",
    cor: "#DB2777",
    titulo: "Croqui — Artes Plásticas Brasileiras",
    descricao:
      "Criar um croqui inspirado em obra de Tarsila do Amaral. Formato A4.",
    professor: "Profa. Renata Lins",
    entrega: "21/08/2024",
    prazo: "",
    concluida: true,
  },
  {
    id: "cie2",
    disciplina: "Ciências",
    cor: "#0891B2",
    titulo: "Pesquisa — Células e organismos",
    descricao:
      "Fazer uma pesquisa sobre a diferença entre células eucarióticas e procarióticas.",
    professor: "Profa. Amanda Pires",
    entrega: "19/08/2024",
    prazo: "",
    concluida: true,
  },
];

type Aba = "pendentes" | "concluidas";

export default function Atividades() {
  const [atividades, setAtividades] = useState(ATIVIDADES_INICIAIS);
  const [aba, setAba] = useState<Aba>("pendentes");

  const pendentes = atividades.filter((a) => !a.concluida);
  const concluidas = atividades.filter((a) => a.concluida);
  const lista = aba === "pendentes" ? pendentes : concluidas;

  function voltar() {
    if (router.canGoBack()) router.back();
    else router.replace("/inicio");
  }

  // Marca uma atividade pendente como entregue (e permite desfazer).
  function alternar(id: string) {
    setAtividades((atual) =>
      atual.map((a) => (a.id === id ? { ...a, concluida: !a.concluida } : a)),
    );
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
            style={styles.botaoVoltar}
            hitSlop={8}
            onPress={voltar}
          >
            <ArrowLeft size={20} color="#FFFFFF" />
          </Pressable>

          <View style={styles.cabecalhoTexto}>
            <Text style={styles.titulo}>Atividades e Tarefas</Text>
            <Text style={styles.subtitulo}>{pendentes.length} pendentes</Text>
          </View>
        </View>

        {/* Abas */}
        <View style={styles.abas} accessibilityRole="tablist">
          <BotaoAba
            rotulo={`Pendentes (${pendentes.length})`}
            ativa={aba === "pendentes"}
            aoPressionar={() => setAba("pendentes")}
          />
          <BotaoAba
            rotulo={`Concluídas (${concluidas.length})`}
            ativa={aba === "concluidas"}
            aoPressionar={() => setAba("concluidas")}
          />
        </View>
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
      >
        {lista.length === 0 && (
          <View style={styles.vazio}>
            <CircleCheck size={32} color="#16A34A" />
            <Text style={styles.vazioTexto}>
              {aba === "pendentes"
                ? "Tudo em dia! Nenhuma atividade pendente."
                : "Nenhuma atividade concluída ainda."}
            </Text>
          </View>
        )}

        {lista.map((atividade) => (
          <CartaoAtividade
            key={atividade.id}
            atividade={atividade}
            aoAlternar={() => alternar(atividade.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

function BotaoAba({
  rotulo,
  ativa,
  aoPressionar,
}: {
  rotulo: string;
  ativa: boolean;
  aoPressionar: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: ativa }}
      style={[styles.aba, ativa && styles.abaAtiva]}
      onPress={aoPressionar}
    >
      <Text style={[styles.abaTexto, ativa && styles.abaTextoAtivo]}>
        {rotulo}
      </Text>
    </Pressable>
  );
}

function CartaoAtividade({
  atividade,
  aoAlternar,
}: {
  atividade: Atividade;
  aoAlternar: () => void;
}) {
  const { concluida, urgente } = atividade;
  const destaqueUrgente = urgente === true && !concluida;

  return (
    <View style={[styles.cartao, destaqueUrgente && styles.cartaoUrgente]}>
      <View style={styles.cartaoTopo}>
        <View
          style={[
            styles.icone,
            destaqueUrgente && styles.iconeUrgente,
            concluida && styles.iconeConcluido,
          ]}
        >
          {destaqueUrgente ? (
            <CircleAlert size={22} color="#E5252A" />
          ) : concluida ? (
            <CircleCheck size={22} color="#16A34A" />
          ) : (
            <BookOpen size={20} color={atividade.cor} />
          )}
        </View>

        <View style={styles.cartaoTexto}>
          <Text
            style={[
              styles.disciplina,
              { color: concluida ? `${atividade.cor}AA` : atividade.cor },
            ]}
          >
            {atividade.disciplina}
          </Text>
          <Text
            style={[styles.tituloAtividade, concluida && styles.tituloRiscado]}
            numberOfLines={1}
          >
            {atividade.titulo}
          </Text>
        </View>

        <Pressable
          accessibilityRole="checkbox"
          accessibilityLabel={
            concluida
              ? `Marcar ${atividade.titulo} como pendente`
              : `Marcar ${atividade.titulo} como entregue`
          }
          accessibilityState={{ checked: concluida }}
          hitSlop={8}
          style={[styles.marcador, concluida && styles.marcadorConcluido]}
          onPress={aoAlternar}
        >
          {concluida && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
        </Pressable>
      </View>

      <Text style={styles.descricao}>{atividade.descricao}</Text>

      <View style={styles.rodape}>
        <View style={styles.professor}>
          <User size={14} color="#5B3FA6" fill="#5B3FA6" />
          <Text style={styles.professorTexto} numberOfLines={1}>
            {atividade.professor}
          </Text>
        </View>

        {concluida ? (
          <View style={styles.selo}>
            <Check size={12} color="#16A34A" strokeWidth={3} />
            <Text style={styles.seloTexto}>Entregue</Text>
          </View>
        ) : (
          <View style={[styles.prazo, destaqueUrgente && styles.prazoUrgente]}>
            <CalendarDays
              size={13}
              color={destaqueUrgente ? "#E5252A" : "#1D4ED8"}
            />
            <Text
              style={[
                styles.prazoTexto,
                destaqueUrgente && styles.prazoTextoUrgente,
              ]}
            >
              {atividade.entrega} · {atividade.prazo}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

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

  botaoVoltar: {
    width: 36,
    height: 36,
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
    fontSize: 13,
    marginTop: 3,
  },

  // Abas
  abas: {
    flexDirection: "row",
    marginTop: 18,
    padding: 4,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.14)",
  },

  aba: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  abaAtiva: {
    backgroundColor: "#FFFFFF",
  },

  abaTexto: {
    color: "#DCE6FF",
    fontSize: 13,
    fontWeight: "600",
  },

  abaTextoAtivo: {
    color: "#1D4ED8",
  },

  // Lista
  lista: {
    padding: 20,
    paddingBottom: 32,
    gap: 14,
  },

  vazio: {
    alignItems: "center",
    gap: 10,
    paddingVertical: 48,
  },

  vazioTexto: {
    color: "#64748B",
    fontSize: 14,
    textAlign: "center",
  },

  // Cartão
  cartao: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#DDE4F3",
    backgroundColor: "#FFFFFF",
  },

  cartaoUrgente: {
    borderColor: "#F5B5B5",
  },

  cartaoTopo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  icone: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F1F4FD",
    alignItems: "center",
    justifyContent: "center",
  },

  iconeUrgente: {
    backgroundColor: "#EEF2FF",
  },

  iconeConcluido: {
    backgroundColor: "#F1F4FD",
  },

  cartaoTexto: {
    flex: 1,
  },

  disciplina: {
    fontSize: 13,
    fontWeight: "700",
  },

  tituloAtividade: {
    color: "#0B1B44",
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 2,
  },

  tituloRiscado: {
    color: "#475569",
    textDecorationLine: "line-through",
  },

  marcador: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#D5DBEA",
    backgroundColor: "#EEF1FA",
    alignItems: "center",
    justifyContent: "center",
  },

  marcadorConcluido: {
    borderColor: "#4CB872",
    backgroundColor: "#4CB872",
  },

  descricao: {
    color: "#64748B",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 12,
  },

  rodape: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 14,
  },

  professor: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  professorTexto: {
    flexShrink: 1,
    color: "#64748B",
    fontSize: 13,
  },

  prazo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    backgroundColor: "#E8EDFF",
  },

  prazoUrgente: {
    backgroundColor: "#FFE3E3",
    borderWidth: 1,
    borderColor: "#F5B5B5",
  },

  prazoTexto: {
    color: "#1D4ED8",
    fontSize: 12,
    fontWeight: "700",
  },

  prazoTextoUrgente: {
    color: "#E5252A",
  },

  selo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    backgroundColor: "#DCFCE7",
  },

  seloTexto: {
    color: "#16A34A",
    fontSize: 12,
    fontWeight: "700",
  },
});

import { Stack } from "expo-router";
import { DoorOpen, UserRound } from "lucide-react-native";
import { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BarraAbas from "@/components/BarraAbas";

// Dados de exemplo enquanto o sistema da escola não está conectado.
// Substituir por dados reais (login/API) quando estiverem disponíveis.
type Aula = {
  horario: string;
  disciplina: string;
  professor: string;
  sala: string;
  cor: string;
};

const COR = {
  ciencias: "#0891B2",
  portugues: "#6366F1",
  matematica: "#1D4ED8",
  ingles: "#7C3AED",
  historia: "#D97706",
  geografia: "#059669",
  edFisica: "#E11D48",
  artes: "#DB2777",
};

const AULAS = {
  ciencias: {
    disciplina: "Ciências",
    professor: "Profa. Amanda Pires",
    sala: "Lab. Ciências",
    cor: COR.ciencias,
  },
  portugues: {
    disciplina: "Língua Portuguesa",
    professor: "Profa. Carla Mendes",
    sala: "Sala 12",
    cor: COR.portugues,
  },
  matematica: {
    disciplina: "Matemática",
    professor: "Prof. Rogério Alves",
    sala: "Sala 12",
    cor: COR.matematica,
  },
  ingles: {
    disciplina: "Inglês",
    professor: "Prof. Fábio Drummond",
    sala: "Sala 08",
    cor: COR.ingles,
  },
  historia: {
    disciplina: "História",
    professor: "Profa. Luísa Ferraz",
    sala: "Sala 12",
    cor: COR.historia,
  },
  geografia: {
    disciplina: "Geografia",
    professor: "Prof. Marcos Tavares",
    sala: "Sala 12",
    cor: COR.geografia,
  },
  edFisica: {
    disciplina: "Educação Física",
    professor: "Prof. Diego Santana",
    sala: "Quadra",
    cor: COR.edFisica,
  },
  artes: {
    disciplina: "Artes",
    professor: "Profa. Helena Costa",
    sala: "Ateliê",
    cor: COR.artes,
  },
};

const HORARIOS = ["07:00", "08:00", "09:00", "10:00", "11:00"];

function montarDia(
  ...disciplinas: (keyof typeof AULAS)[]
): Aula[] {
  return disciplinas.map((chave, indice) => ({
    horario: HORARIOS[indice],
    ...AULAS[chave],
  }));
}

const DIAS: { id: string; curto: string; completo: string; aulas: Aula[] }[] =
  [
    {
      id: "seg",
      curto: "Seg",
      completo: "Segunda-feira",
      aulas: montarDia(
        "matematica",
        "portugues",
        "geografia",
        "edFisica",
        "ingles",
      ),
    },
    {
      id: "ter",
      curto: "Ter",
      completo: "Terça-feira",
      aulas: montarDia(
        "portugues",
        "historia",
        "matematica",
        "artes",
        "ciencias",
      ),
    },
    {
      id: "qua",
      curto: "Qua",
      completo: "Quarta-feira",
      aulas: montarDia(
        "ciencias",
        "portugues",
        "matematica",
        "ingles",
        "historia",
      ),
    },
    {
      id: "qui",
      curto: "Qui",
      completo: "Quinta-feira",
      aulas: montarDia(
        "geografia",
        "matematica",
        "ciencias",
        "portugues",
        "edFisica",
      ),
    },
    {
      id: "sex",
      curto: "Sex",
      completo: "Sexta-feira",
      aulas: montarDia(
        "historia",
        "ingles",
        "artes",
        "matematica",
        "geografia",
      ),
    },
  ];

const MONO = Platform.select({
  ios: "Menlo",
  android: "monospace",
  default: "monospace",
});

// Domingo = 0 e sábado = 6 não têm aula: nesses dias nada fica marcado como
// "HOJE" e a grade abre na segunda-feira.
function indiceDeHoje() {
  const diaSemana = new Date().getDay();
  return diaSemana >= 1 && diaSemana <= 5 ? diaSemana - 1 : -1;
}

export default function Horarios() {
  const hoje = indiceDeHoje();
  const [selecionado, setSelecionado] = useState(hoje === -1 ? 0 : hoje);

  const dia = DIAS[selecionado];
  const total = dia.aulas.length;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        contentContainerStyle={styles.rolagem}
        showsVerticalScrollIndicator={false}
      >
        {/* Cabeçalho */}
        <SafeAreaView edges={["top", "left", "right"]} style={styles.cabecalho}>
          <Text style={styles.eyebrow}>Horário de aulas</Text>
          <Text style={styles.titulo}>Grade Semanal</Text>

          <View style={styles.dias} accessibilityRole="tablist">
            {DIAS.map((item, indice) => {
              const ativo = indice === selecionado;
              const ehHoje = indice === hoje;

              return (
                <Pressable
                  key={item.id}
                  style={[styles.dia, ativo && styles.diaAtivo]}
                  accessibilityRole="tab"
                  accessibilityLabel={ehHoje ? `${item.completo}, hoje` : item.completo}
                  accessibilityState={{ selected: ativo }}
                  onPress={() => setSelecionado(indice)}
                >
                  <Text style={[styles.diaTexto, ativo && styles.diaTextoAtivo]}>
                    {item.curto}
                  </Text>
                  {ehHoje && (
                    <View style={[styles.hoje, !ativo && styles.hojeInativo]}>
                      <Text style={styles.hojeTexto}>HOJE</Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </SafeAreaView>

        {/* Linha do tempo */}
        <View style={styles.conteudo}>
          <Text style={styles.secaoTitulo}>
            {dia.completo.toUpperCase()} · {total} {total === 1 ? "AULA" : "AULAS"}
          </Text>

          {dia.aulas.map((aula, indice) => (
            <LinhaAula
              key={`${dia.id}-${aula.horario}`}
              aula={aula}
              primeira={indice === 0}
              ultima={indice === total - 1}
            />
          ))}
        </View>
      </ScrollView>

      <BarraAbas ativa="horarios" />
    </View>
  );
}

function LinhaAula({
  aula,
  primeira,
  ultima,
}: {
  aula: Aula;
  primeira: boolean;
  ultima: boolean;
}) {
  return (
    <View style={styles.linha}>
      <View style={styles.coluna}>
        {/* Trilho vertical que liga os pontos de cada aula */}
        <View
          style={[
            styles.trilho,
            primeira ? styles.trilhoPrimeira : styles.trilhoMeio,
            ultima && styles.trilhoUltima,
          ]}
        />
        <Text style={styles.horario}>{aula.horario}</Text>
        <View style={[styles.ponto, { backgroundColor: aula.cor }]}>
          <View style={styles.pontoMiolo} />
        </View>
      </View>

      <View
        style={[styles.cartao, { borderLeftColor: aula.cor }]}
        accessible
        accessibilityLabel={`${aula.horario}, ${aula.disciplina}, ${aula.professor}, ${aula.sala}`}
      >
        <Text style={styles.disciplina}>{aula.disciplina}</Text>

        <View style={styles.detalhes}>
          <View style={styles.professor}>
            <UserRound size={14} color="#4B3F7A" />
            <Text style={styles.professorTexto}>{aula.professor}</Text>
          </View>

          <View style={[styles.sala, { backgroundColor: `${aula.cor}1F` }]}>
            <DoorOpen size={13} color={aula.cor} />
            <Text style={[styles.salaTexto, { color: aula.cor }]}>
              {aula.sala}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FC",
  },

  rolagem: {
    flexGrow: 1,
    paddingBottom: 24,
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

  eyebrow: {
    color: "#DCE6FF",
    fontSize: 12,
  },

  titulo: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 6,
  },

  // Seletor de dia
  dias: {
    flexDirection: "row",
    gap: 8,
    marginTop: 18,
  },

  dia: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.14)",
    alignItems: "center",
    justifyContent: "center",
  },

  diaAtivo: {
    backgroundColor: "#FFFFFF",
  },

  diaTexto: {
    color: "#DCE6FF",
    fontSize: 13,
    fontWeight: "bold",
  },

  diaTextoAtivo: {
    color: "#1D4ED8",
  },

  hoje: {
    marginTop: 2,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    backgroundColor: "#1D4ED8",
  },

  hojeInativo: {
    backgroundColor: "rgba(255,255,255,0.22)",
  },

  hojeTexto: {
    color: "#FFFFFF",
    fontSize: 8,
    fontWeight: "bold",
    letterSpacing: 0.4,
  },

  // Conteúdo
  conteudo: {
    width: "100%",
    maxWidth: 440,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  secaoTitulo: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1.2,
    marginBottom: 16,
  },

  // Linha do tempo
  linha: {
    flexDirection: "row",
    gap: 12,
    paddingBottom: 14,
  },

  coluna: {
    width: 52,
    alignItems: "center",
    paddingTop: 2,
  },

  trilho: {
    position: "absolute",
    left: 25,
    width: 2,
    backgroundColor: "#D5DEF1",
  },

  // A primeira aula só começa a linha no ponto; a última termina nele.
  trilhoPrimeira: {
    top: 36,
    bottom: 0,
  },

  trilhoMeio: {
    top: 0,
    bottom: 0,
  },

  trilhoUltima: {
    bottom: undefined,
    height: 36,
  },

  horario: {
    color: "#64748B",
    fontFamily: MONO,
    fontSize: 12,
    fontWeight: "bold",
  },

  ponto: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },

  pontoMiolo: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#F5F6FC",
  },

  // Cartão da aula
  cartao: {
    flex: 1,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E3E9F5",
    borderLeftWidth: 4,
    backgroundColor: "#FFFFFF",
  },

  disciplina: {
    color: "#0B1B44",
    fontSize: 15,
    fontWeight: "bold",
  },

  detalhes: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    columnGap: 10,
    rowGap: 8,
    marginTop: 8,
  },

  professor: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  professorTexto: {
    color: "#64748B",
    fontSize: 13,
  },

  sala: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  salaTexto: {
    fontSize: 12,
    fontWeight: "600",
  },
});

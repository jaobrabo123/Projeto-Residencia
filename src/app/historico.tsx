import { router, Stack } from "expo-router";
import { ArrowLeft, Check } from "lucide-react-native";
import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BarraAbas from "@/components/BarraAbas";
import { HISTORICO } from "@/data/protocolos";

// Dados de exemplo enquanto o sistema da escola não está conectado.
const ALUNO = {
  nome: "Ana Beatriz Silva",
  matricula: "2024005847",
};

const ESCOLA = {
  nome: "EMEF Prof. Adalberto Lima",
  detalhe: "Ensino Fundamental II · Turno Manhã",
};

// Média mínima para aprovação (escala de 0 a 10).
const MEDIA_MINIMA = 6;

function formatarNota(nota: number) {
  return nota.toFixed(1).replace(".", ",");
}

export default function Historico() {
  function voltar() {
    if (router.canGoBack()) router.back();
    else router.replace("/servicos");
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

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
            <Text style={styles.titulo}>Histórico Escolar</Text>
            <Text style={styles.subtitulo}>
              {ALUNO.nome} · Mat. {ALUNO.matricula}
            </Text>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={styles.rolagem}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.escola}>
          <Text style={styles.escolaIcone}>🎓</Text>
          <View style={styles.escolaTexto}>
            <Text style={styles.escolaNome}>{ESCOLA.nome}</Text>
            <Text style={styles.escolaDetalhe}>{ESCOLA.detalhe}</Text>
          </View>
        </View>

        {HISTORICO.map((periodo) => {
          const aprovado = periodo.notas.every((n) => n.nota >= MEDIA_MINIMA);

          return (
            <View key={periodo.ano} style={styles.periodo}>
              <View style={styles.periodoCabecalho}>
                <Text style={styles.periodoTitulo}>
                  {periodo.ano} · {periodo.serie}
                </Text>

                <View style={[styles.selo, !aprovado && styles.seloReprovado]}>
                  {aprovado && (
                    <Check size={12} color="#16A34A" strokeWidth={3} />
                  )}
                  <Text
                    style={[
                      styles.seloTexto,
                      !aprovado && styles.seloTextoReprovado,
                    ]}
                  >
                    {aprovado ? "Aprovado(a)" : "Reprovado(a)"}
                  </Text>
                </View>
              </View>

              <View style={styles.tabela}>
                {periodo.notas.map((item, i) => (
                  <View
                    key={item.disciplina}
                    style={[
                      styles.linha,
                      i < periodo.notas.length - 1 && styles.linhaDivisoria,
                    ]}
                  >
                    <Text style={styles.disciplina}>{item.disciplina}</Text>
                    <View
                      style={[
                        styles.nota,
                        item.nota < MEDIA_MINIMA && styles.notaBaixa,
                      ]}
                    >
                      <Text
                        style={[
                          styles.notaTexto,
                          item.nota < MEDIA_MINIMA && styles.notaTextoBaixa,
                        ]}
                      >
                        {formatarNota(item.nota)}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          );
        })}
      </ScrollView>

      <BarraAbas ativa="servicos" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FC",
  },

  cabecalho: {
    backgroundColor: "#1D4ED8",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 22,
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
    fontSize: 12,
    marginTop: 3,
  },

  rolagem: {
    padding: 20,
    paddingBottom: 32,
  },

  escola: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#D3DDF4",
    backgroundColor: "#EEF2FF",
  },

  escolaIcone: {
    fontSize: 30,
  },

  escolaTexto: {
    flex: 1,
  },

  escolaNome: {
    color: "#0B1B44",
    fontSize: 15,
    fontWeight: "bold",
  },

  escolaDetalhe: {
    color: "#7486A8",
    fontSize: 12,
    marginTop: 3,
  },

  periodo: {
    marginTop: 24,
  },

  periodoCabecalho: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  periodoTitulo: {
    color: "#0B1B44",
    fontSize: 15,
    fontWeight: "bold",
  },

  selo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: "#DCFCE7",
  },

  seloReprovado: {
    backgroundColor: "#FFE3E3",
  },

  seloTexto: {
    color: "#16A34A",
    fontSize: 12,
    fontWeight: "700",
  },

  seloTextoReprovado: {
    color: "#E5252A",
  },

  tabela: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#DDE4F3",
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },

  linha: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  linhaDivisoria: {
    borderBottomWidth: 1,
    borderBottomColor: "#E8ECF6",
  },

  disciplina: {
    color: "#0B1B44",
    fontSize: 15,
  },

  nota: {
    minWidth: 46,
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: "#DCFCE7",
  },

  notaBaixa: {
    backgroundColor: "#FFE3E3",
  },

  notaTexto: {
    color: "#16A34A",
    fontSize: 14,
    fontWeight: "700",
  },

  notaTextoBaixa: {
    color: "#E5252A",
  },
});

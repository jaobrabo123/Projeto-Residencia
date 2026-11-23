import { router, Stack, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Check, Clipboard } from "lucide-react-native";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BarraAbas from "@/components/BarraAbas";
import { PROTOCOLOS, STATUS } from "@/data/protocolos";

export default function DetalheProtocolo() {
  const { codigo } = useLocalSearchParams<{ codigo?: string }>();
  const protocolo = PROTOCOLOS.find((p) => p.codigo === codigo);
  const status = protocolo ? STATUS[protocolo.status] : null;

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
            <Text style={styles.titulo}>Detalhes do Protocolo</Text>
            <Text style={styles.subtitulo}>
              {protocolo ? protocolo.codigo : "Protocolo não encontrado"}
            </Text>
          </View>
        </View>
      </SafeAreaView>

      {protocolo && status ? (
        <ScrollView
          contentContainerStyle={styles.rolagem}
          showsVerticalScrollIndicator={false}
        >
          {/* Resumo */}
          <View style={styles.cartao}>
            <View style={styles.resumoTopo}>
              <View style={[styles.icone, { backgroundColor: status.fundo }]}>
                <Clipboard size={22} color={status.cor} />
              </View>

              <View style={styles.resumoTexto}>
                <Text style={styles.protocoloTitulo}>{protocolo.titulo}</Text>
                <View style={styles.statusLinha}>
                  <View
                    style={[styles.statusPonto, { backgroundColor: status.cor }]}
                  />
                  <Text style={[styles.statusTexto, { color: status.cor }]}>
                    {status.rotulo}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.dados}>
              <Dado rotulo="Protocolo" valor={protocolo.codigo} />
              <Dado rotulo="Aberto em" valor={protocolo.data} />
            </View>
          </View>

          {/* Descrição e observações */}
          <Text style={styles.secaoTitulo}>SOLICITAÇÃO</Text>
          <View style={styles.cartao}>
            <Text style={styles.campoRotulo}>Descrição</Text>
            <Text style={styles.campoTexto}>{protocolo.descricao}</Text>

            <Text style={[styles.campoRotulo, styles.campoEspaco]}>
              Justificativa / observações
            </Text>
            <Text style={styles.campoTexto}>{protocolo.observacoes}</Text>
          </View>

          {/* Acompanhamento */}
          <Text style={styles.secaoTitulo}>ACOMPANHAMENTO</Text>
          <View style={styles.cartao}>
            {protocolo.etapas.map((etapa, i) => {
              const ultima = i === protocolo.etapas.length - 1;

              return (
                <View key={etapa.titulo} style={styles.etapa}>
                  <View style={styles.etapaTrilho}>
                    <View
                      style={[
                        styles.etapaMarcador,
                        etapa.concluida && {
                          backgroundColor: status.cor,
                          borderColor: status.cor,
                        },
                      ]}
                    >
                      {etapa.concluida && (
                        <Check size={12} color="#FFFFFF" strokeWidth={3} />
                      )}
                    </View>
                    {!ultima && (
                      <View
                        style={[
                          styles.etapaLinha,
                          etapa.concluida &&
                            protocolo.etapas[i + 1].concluida && {
                              backgroundColor: status.cor,
                            },
                        ]}
                      />
                    )}
                  </View>

                  <View style={styles.etapaTexto}>
                    <Text
                      style={[
                        styles.etapaTitulo,
                        !etapa.concluida && styles.etapaPendente,
                      ]}
                    >
                      {etapa.titulo}
                    </Text>
                    <Text style={styles.etapaData}>{etapa.data}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          <Pressable
            accessibilityRole="button"
            style={({ pressed }) => [styles.botao, pressed && styles.pressionado]}
            onPress={voltar}
          >
            <ArrowLeft size={18} color="#1D4ED8" />
            <Text style={styles.botaoTexto}>Voltar</Text>
          </Pressable>
        </ScrollView>
      ) : (
        <View style={styles.vazio}>
          <Text style={styles.vazioTexto}>
            Não encontramos esse protocolo. Volte para a lista e tente
            novamente.
          </Text>
          <Pressable
            accessibilityRole="button"
            style={({ pressed }) => [styles.botao, pressed && styles.pressionado]}
            onPress={voltar}
          >
            <ArrowLeft size={18} color="#1D4ED8" />
            <Text style={styles.botaoTexto}>Voltar</Text>
          </Pressable>
        </View>
      )}

      <BarraAbas ativa="servicos" />
    </View>
  );
}

function Dado({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <View style={styles.dado}>
      <Text style={styles.dadoRotulo}>{rotulo}</Text>
      <Text style={styles.dadoValor}>{valor}</Text>
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
    fontSize: 13,
    marginTop: 3,
  },

  rolagem: {
    padding: 20,
    paddingBottom: 32,
  },

  cartao: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#DDE4F3",
    backgroundColor: "#FFFFFF",
  },

  resumoTopo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  icone: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  resumoTexto: {
    flex: 1,
  },

  protocoloTitulo: {
    color: "#0B1B44",
    fontSize: 17,
    fontWeight: "bold",
  },

  statusLinha: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 5,
  },

  statusPonto: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  statusTexto: {
    fontSize: 13,
    fontWeight: "700",
  },

  dados: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#E8ECF6",
  },

  dado: {
    flex: 1,
  },

  dadoRotulo: {
    color: "#7486A8",
    fontSize: 12,
  },

  dadoValor: {
    color: "#0B1B44",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 3,
  },

  secaoTitulo: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginTop: 24,
    marginBottom: 12,
    marginLeft: 2,
  },

  campoRotulo: {
    color: "#7486A8",
    fontSize: 12,
    fontWeight: "600",
  },

  campoEspaco: {
    marginTop: 14,
  },

  campoTexto: {
    color: "#0B1B44",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },

  // Linha do tempo
  etapa: {
    flexDirection: "row",
    gap: 14,
  },

  etapaTrilho: {
    alignItems: "center",
  },

  etapaMarcador: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#D5DBEA",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  etapaLinha: {
    flex: 1,
    width: 2,
    minHeight: 24,
    backgroundColor: "#D5DBEA",
  },

  etapaTexto: {
    flex: 1,
    paddingBottom: 18,
  },

  etapaTitulo: {
    color: "#0B1B44",
    fontSize: 14,
    fontWeight: "600",
  },

  etapaPendente: {
    color: "#94A3B8",
  },

  etapaData: {
    color: "#7486A8",
    fontSize: 12,
    marginTop: 2,
  },

  botao: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 50,
    marginTop: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#BFD0F7",
    backgroundColor: "#EEF2FF",
  },

  botaoTexto: {
    color: "#1D4ED8",
    fontSize: 15,
    fontWeight: "bold",
  },

  pressionado: {
    opacity: 0.8,
  },

  vazio: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 32,
  },

  vazioTexto: {
    color: "#64748B",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },
});

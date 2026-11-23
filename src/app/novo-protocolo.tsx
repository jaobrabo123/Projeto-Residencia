import { router, Stack, useLocalSearchParams } from "expo-router";
import { ArrowLeft, CircleCheck } from "lucide-react-native";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BarraAbas from "@/components/BarraAbas";
import { TIPOS_SOLICITACAO } from "@/data/protocolos";

// Número de protocolo de exemplo. Substituir pelo retorno da API quando o
// sistema da escola estiver conectado.
function gerarCodigo() {
  const sufixo = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
  return `P2024${sufixo}`;
}

export default function NovoProtocolo() {
  // `tipo` vem da tela de Serviços quando o aluno já escolheu um serviço.
  const { tipo } = useLocalSearchParams<{ tipo?: string }>();

  const [selecionado, setSelecionado] = useState<string | null>(
    TIPOS_SOLICITACAO.some((t) => t.id === tipo) ? (tipo ?? null) : null,
  );
  const [justificativa, setJustificativa] = useState("");
  const [codigo, setCodigo] = useState<string | null>(null);

  const escolhido = TIPOS_SOLICITACAO.find((t) => t.id === selecionado);

  function voltar() {
    if (router.canGoBack()) router.back();
    else router.replace("/servicos");
  }

  function enviar() {
    if (!selecionado) return;
    setCodigo(gerarCodigo());
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
            <Text style={styles.titulo}>Novo Protocolo</Text>
            <Text style={styles.subtitulo}>Abrir solicitação na secretaria</Text>
          </View>
        </View>
      </SafeAreaView>

      {codigo ? (
        <View style={styles.sucesso}>
          <CircleCheck size={56} color="#16A34A" />
          <Text style={styles.sucessoTitulo}>Solicitação enviada!</Text>
          <Text style={styles.sucessoTexto}>
            Sua solicitação de {escolhido?.titulo} foi registrada com o
            protocolo {codigo}. A secretaria responderá em breve.
          </Text>

          <Pressable
            accessibilityRole="button"
            style={({ pressed }) => [styles.botao, pressed && styles.pressionado]}
            onPress={() => router.replace("/servicos")}
          >
            <Text style={styles.botaoTexto}>Voltar para Serviços</Text>
          </Pressable>
        </View>
      ) : (
        <KeyboardAvoidingView
          style={styles.corpo}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.rolagem}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.secaoTitulo}>TIPO DE SOLICITAÇÃO</Text>

            {TIPOS_SOLICITACAO.map((item) => {
              const ativo = item.id === selecionado;

              return (
                <Pressable
                  key={item.id}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: ativo }}
                  style={[styles.tipo, ativo && styles.tipoAtivo]}
                  onPress={() => setSelecionado(item.id)}
                >
                  <Text style={styles.tipoIcone}>{item.icone}</Text>
                  <View style={styles.tipoTexto}>
                    <Text style={styles.tipoTitulo}>{item.titulo}</Text>
                    <Text style={styles.tipoDescricao}>{item.descricao}</Text>
                  </View>
                </Pressable>
              );
            })}

            <Text style={[styles.secaoTitulo, styles.secaoEspaco]}>
              JUSTIFICATIVA / OBSERVAÇÕES
            </Text>

            <TextInput
              style={styles.campo}
              multiline
              textAlignVertical="top"
              value={justificativa}
              onChangeText={setJustificativa}
              placeholder="Descreva o motivo da solicitação, período e outros detalhes relevantes..."
              placeholderTextColor="#94A3B8"
            />
          </ScrollView>

          <View style={styles.rodape}>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: !selecionado }}
              disabled={!selecionado}
              style={({ pressed }) => [
                styles.botao,
                !selecionado && styles.botaoDesabilitado,
                pressed && styles.pressionado,
              ]}
              onPress={enviar}
            >
              <Text style={styles.botaoTexto}>Enviar Solicitação</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      )}

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
    fontSize: 13,
    marginTop: 3,
  },

  corpo: {
    flex: 1,
  },

  rolagem: {
    padding: 20,
    paddingBottom: 24,
  },

  secaoTitulo: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 14,
    marginLeft: 2,
  },

  secaoEspaco: {
    marginTop: 12,
  },

  tipo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 16,
    marginBottom: 10,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#DDE4F3",
    backgroundColor: "#FFFFFF",
  },

  tipoAtivo: {
    borderColor: "#1D4ED8",
    backgroundColor: "#EEF2FF",
  },

  tipoIcone: {
    fontSize: 26,
  },

  tipoTexto: {
    flex: 1,
  },

  tipoTitulo: {
    color: "#0B1B44",
    fontSize: 15,
    fontWeight: "bold",
  },

  tipoDescricao: {
    color: "#64748B",
    fontSize: 13,
    lineHeight: 18,
    marginTop: 3,
  },

  campo: {
    minHeight: 110,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1D4ED8",
    backgroundColor: "#FFFFFF",
    color: "#0B1B44",
    fontSize: 14,
    lineHeight: 20,
  },

  rodape: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: "#E3E9F5",
    backgroundColor: "#F5F6FC",
  },

  botao: {
    alignSelf: "stretch",
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1D4ED8",
  },

  botaoDesabilitado: {
    backgroundColor: "#A5B9F2",
  },

  botaoTexto: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
  },

  pressionado: {
    opacity: 0.85,
  },

  // Confirmação
  sucesso: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    paddingHorizontal: 32,
  },

  sucessoTitulo: {
    color: "#0B1B44",
    fontSize: 20,
    fontWeight: "bold",
  },

  sucessoTexto: {
    color: "#64748B",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginBottom: 12,
  },
});

import { router, Stack } from "expo-router";
import { ArrowLeft, KeyRound, MailCheck, User } from "lucide-react-native";
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

import { validarIdentificacao } from "@/utils/validacao";

export default function EsqueciSenha() {
  const [identificacao, setIdentificacao] = useState("");
  const [erro, setErro] = useState("");
  const [enviado, setEnviado] = useState(false);

  function voltarAoLogin() {
    if (router.canGoBack()) router.back();
    else router.replace("/login");
  }

  // MVP sem back-end: apenas valida o campo e mostra a confirmação.
  // Com a API, enviar a identificação e tratar falhas de rede aqui.
  // A mensagem de sucesso é a mesma exista ou não o cadastro, para não
  // revelar quais matrículas/CPFs estão cadastrados.
  function enviar() {
    const mensagem = validarIdentificacao(identificacao);

    if (mensagem) {
      setErro(mensagem);
      return;
    }

    setErro("");
    setEnviado(true);
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        contentContainerStyle={styles.rolagem}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        {/* Cabeçalho */}
        <SafeAreaView edges={["top", "left", "right"]} style={styles.cabecalho}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Voltar ao login"
            style={styles.botaoVoltar}
            onPress={voltarAoLogin}
          >
            <ArrowLeft size={20} color="#FFFFFF" />
          </Pressable>

          <View style={styles.marca}>
            <View style={styles.logo}>
              {enviado ? (
                <MailCheck size={32} color="#FFFFFF" />
              ) : (
                <KeyRound size={32} color="#FFFFFF" />
              )}
            </View>
            <Text style={styles.nomeApp}>Recuperar senha</Text>
            <Text style={styles.areaAluno}>Área do Aluno</Text>
          </View>
        </SafeAreaView>

        <SafeAreaView
          edges={["bottom", "left", "right"]}
          style={styles.areaConteudo}
        >
          <View style={styles.conteudo}>
            {enviado ? (
              // Confirmação
              <View>
                <Text style={styles.titulo}>Verifique seu e-mail</Text>
                <Text style={styles.subtitulo} accessibilityLiveRegion="polite">
                  Se houver um cadastro para{" "}
                  <Text style={styles.negrito}>{identificacao.trim()}</Text>,
                  enviaremos um link para criar uma nova senha no e-mail
                  cadastrado na secretaria da escola.
                </Text>

                <View style={styles.dica}>
                  <Text style={styles.dicaTexto}>
                    Não recebeu? Confira a caixa de spam ou procure a
                    secretaria para atualizar seu e-mail.
                  </Text>
                </View>

                <Pressable
                  accessibilityRole="button"
                  style={({ pressed }) => [
                    styles.botaoPrincipal,
                    pressed && styles.pressionado,
                  ]}
                  onPress={voltarAoLogin}
                >
                  <Text style={styles.textoPrincipal}>Voltar ao login</Text>
                </Pressable>

                <Pressable
                  accessibilityRole="button"
                  style={styles.linkCentro}
                  onPress={() => setEnviado(false)}
                >
                  <Text style={styles.textoLink}>
                    Usar outra matrícula ou CPF
                  </Text>
                </Pressable>
              </View>
            ) : (
              // Formulário
              <View>
                <Text style={styles.titulo}>Esqueceu sua senha?</Text>
                <Text style={styles.subtitulo}>
                  Informe sua matrícula ou CPF. Vamos enviar as instruções
                  para o e-mail cadastrado.
                </Text>

                <View style={styles.formulario}>
                  <Text style={styles.rotulo}>Matrícula / CPF</Text>
                  <View style={[styles.campo, erro !== "" && styles.campoErro]}>
                    <User size={18} color="#7486A8" />
                    <TextInput
                      style={styles.entrada}
                      accessibilityLabel="Matrícula ou CPF"
                      placeholder="Digite sua matrícula ou CPF"
                      placeholderTextColor="#8290AB"
                      value={identificacao}
                      keyboardType="number-pad"
                      onChangeText={(texto) => {
                        setIdentificacao(texto);
                        setErro("");
                      }}
                      autoCapitalize="none"
                      autoCorrect={false}
                      autoComplete="username"
                      autoFocus
                      returnKeyType="send"
                      onSubmitEditing={enviar}
                    />
                  </View>

                  {erro !== "" && (
                    <Text style={styles.erro} accessibilityLiveRegion="polite">
                      {erro}
                    </Text>
                  )}

                  <Pressable
                    accessibilityRole="button"
                    style={({ pressed }) => [
                      styles.botaoPrincipal,
                      pressed && styles.pressionado,
                    ]}
                    onPress={enviar}
                  >
                    <Text style={styles.textoPrincipal}>Enviar instruções</Text>
                  </Pressable>

                  <Pressable
                    accessibilityRole="button"
                    style={styles.linkCentro}
                    onPress={voltarAoLogin}
                  >
                    <Text style={styles.textoLink}>
                      Lembrei minha senha
                    </Text>
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Estilos seguem o visual da tela de login.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FC",
  },

  rolagem: {
    flexGrow: 1,
  },

  // Cabeçalho
  cabecalho: {
    backgroundColor: "#2054D8",
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },

  botaoVoltar: {
    position: "absolute",
    top: 12,
    left: 16,
    zIndex: 1,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
  },

  marca: {
    alignItems: "center",
    paddingTop: 24,
    paddingBottom: 34,
    paddingHorizontal: 20,
  },

  logo: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: "#FFFFFF26",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  nomeApp: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "bold",
    textAlign: "center",
  },

  areaAluno: {
    color: "#DFE8FF",
    fontSize: 14,
    marginTop: 6,
  },

  // Conteúdo
  areaConteudo: {
    flex: 1,
  },

  conteudo: {
    width: "100%",
    maxWidth: 440,
    alignSelf: "center",
    padding: 24,
    paddingTop: 34,
    paddingBottom: 40,
  },

  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0B1B44",
  },

  subtitulo: {
    fontSize: 14,
    lineHeight: 21,
    color: "#7486A8",
    marginTop: 8,
  },

  negrito: {
    fontWeight: "bold",
    color: "#0B1B44",
  },

  // Formulário
  formulario: {
    marginTop: 32,
  },

  rotulo: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0B1B44",
    marginBottom: 8,
  },

  campo: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 52,
    borderWidth: 1,
    borderColor: "#D3DDF4",
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    paddingLeft: 16,
    paddingRight: 4,
  },

  campoErro: {
    borderColor: "#E5252A",
  },

  entrada: {
    flex: 1,
    minWidth: 0,
    minHeight: 50,
    paddingHorizontal: 10,
    paddingVertical: 12,
    fontSize: 14,
    color: "#0B1B44",
  },

  erro: {
    color: "#E5252A",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 8,
  },

  // Botões
  botaoPrincipal: {
    minHeight: 52,
    padding: 14,
    marginTop: 24,
    borderRadius: 16,
    backgroundColor: "#205BE9",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0px 8px 16px rgba(32, 84, 216, 0.22)",
  },

  textoPrincipal: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },

  pressionado: {
    opacity: 0.75,
  },

  linkCentro: {
    alignSelf: "center",
    minHeight: 44,
    justifyContent: "center",
    marginTop: 12,
  },

  textoLink: {
    color: "#064BFF",
    fontSize: 14,
    fontWeight: "500",
  },

  // Dica pós-envio
  dica: {
    marginTop: 24,
    padding: 14,
    borderRadius: 16,
    backgroundColor: "#EEF2FF",
    borderWidth: 1,
    borderColor: "#D3DDF4",
  },

  dicaTexto: {
    color: "#0B1B44",
    fontSize: 13,
    lineHeight: 19,
  },
});

import { router, Stack } from "expo-router";
import { Check, ChevronDown, ChevronLeft, Info } from "lucide-react-native";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Envio da pré-matrícula.
// Substitua pela URL do seu formulário no Formspree.
const URL_ENVIO = "https://formspree.io/f/SEU_CODIGO_AQUI";

type Turno = "Manhã" | "Tarde" | "Noite";

type Dados = {
  // 1. Dados pessoais
  nome: string;
  nascimento: string;
  cpf: string;
  rg: string;
  email: string;
  telefone: string;
  // 2. Endereço
  cep: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  // 3. Série / turno
  escola: string;
  serie: string;
  turno: Turno | "";
  // 4. Documentos
  documentos: string[];
};

const DADOS_VAZIOS: Dados = {
  nome: "",
  nascimento: "",
  cpf: "",
  rg: "",
  email: "",
  telefone: "",
  cep: "",
  rua: "",
  numero: "",
  bairro: "",
  cidade: "",
  estado: "",
  escola: "",
  serie: "",
  turno: "",
  documentos: [],
};

const ETAPAS = ["Dados Pessoais", "Endereço", "Série / Turno", "Documentos"];

const ESTADOS = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
];

// Exemplo: trocar pela lista de escolas vinda do sistema da escola.
const ESCOLAS = ["EMEF Prof. Adalberto Lima"];

const SERIES = [
  "1º Ano",
  "2º Ano",
  "3º Ano",
  "4º Ano",
  "5º Ano",
  "6º Ano",
  "7º Ano",
  "8º Ano",
  "9º Ano",
];

const TURNOS: Turno[] = ["Manhã", "Tarde", "Noite"];

const DOCUMENTOS = [
  {
    id: "rg",
    titulo: "RG ou Certidão de Nascimento",
    detalhe: "Cópia + original para conferência",
  },
  {
    id: "residencia",
    titulo: "Comprovante de Residência",
    detalhe: "Conta de água, luz ou gás (últimos 3 meses)",
  },
  {
    id: "foto",
    titulo: "Foto 3x4 recente",
    detalhe: "1 foto colorida, fundo branco",
  },
  {
    id: "historico",
    titulo: "Histórico Escolar",
    detalhe: "Da escola de origem (quando aplicável)",
  },
];

// Máscaras dos campos
function somenteDigitos(valor: string, limite: number) {
  return valor.replace(/\D/g, "").slice(0, limite);
}

function mascaraData(valor: string) {
  const d = somenteDigitos(valor, 8);
  if (d.length > 4) return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
  if (d.length > 2) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return d;
}

function mascaraCpf(valor: string) {
  const d = somenteDigitos(valor, 11);
  if (d.length > 9)
    return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
  if (d.length > 6) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  if (d.length > 3) return `${d.slice(0, 3)}.${d.slice(3)}`;
  return d;
}

function mascaraTelefone(valor: string) {
  const d = somenteDigitos(valor, 11);
  if (d.length > 7) {
    const meio = d.length === 11 ? 7 : 6;
    return `(${d.slice(0, 2)}) ${d.slice(2, meio)}-${d.slice(meio)}`;
  }
  if (d.length > 2) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return d;
}

function mascaraCep(valor: string) {
  const d = somenteDigitos(valor, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
}

function dataValida(texto: string) {
  const [dia, mes, ano] = texto.split("/").map(Number);
  if (!dia || !mes || !ano || ano < 1900) return false;

  const data = new Date(ano, mes - 1, dia);
  const existe =
    data.getFullYear() === ano &&
    data.getMonth() === mes - 1 &&
    data.getDate() === dia;

  return existe && data <= new Date();
}

// Retorna a mensagem de erro da etapa, ou null se estiver tudo certo.
function validarEtapa(etapa: number, dados: Dados): string | null {
  if (etapa === 0) {
    if (!dados.nome.trim()) return "Informe o nome completo.";
    if (!dataValida(dados.nascimento))
      return "Informe uma data de nascimento válida (DD/MM/AAAA).";
    if (dados.cpf.length !== 14) return "Informe o CPF completo.";
    if (!dados.rg.trim()) return "Informe o número do RG.";
    if (!/^\S+@\S+\.\S+$/.test(dados.email.trim()))
      return "Informe um e-mail válido.";
    if (dados.telefone.length < 14) return "Informe o telefone com DDD.";
  }

  if (etapa === 1) {
    if (dados.cep.length !== 9) return "Informe o CEP completo.";
    if (!dados.rua.trim()) return "Informe a rua ou avenida.";
    if (!dados.numero.trim()) return "Informe o número.";
    if (!dados.bairro.trim()) return "Informe o bairro.";
    if (!dados.cidade.trim()) return "Informe a cidade.";
    if (!dados.estado) return "Selecione o estado.";
  }

  if (etapa === 2) {
    if (!dados.escola) return "Selecione a escola de interesse.";
    if (!dados.serie) return "Selecione a série pretendida.";
    if (!dados.turno) return "Selecione o turno preferencial.";
  }

  return null;
}

export default function Formulario() {
  const [dados, setDados] = useState<Dados>(DADOS_VAZIOS);
  const [etapa, setEtapa] = useState(0);
  const [mensagem, setMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);

  const ultimaEtapa = etapa === ETAPAS.length - 1;

  function atualizar<K extends keyof Dados>(campo: K, valor: Dados[K]) {
    setDados((atual) => ({ ...atual, [campo]: valor }));
    setMensagem("");
  }

  function alternarDocumento(id: string) {
    setDados((atual) => ({
      ...atual,
      documentos: atual.documentos.includes(id)
        ? atual.documentos.filter((doc) => doc !== id)
        : [...atual.documentos, id],
    }));
  }

  function voltar() {
    if (enviando) return;

    setMensagem("");

    if (etapa > 0) {
      setEtapa(etapa - 1);
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  }

  async function avancar() {
    if (enviando) return;

    const erro = validarEtapa(etapa, dados);

    if (erro) {
      setMensagem(erro);
      return;
    }

    if (!ultimaEtapa) {
      setEtapa(etapa + 1);
      return;
    }

    setEnviando(true);
    setDados(DADOS_VAZIOS);
    setEtapa(0);
    Alert.alert("Sucesso!", "A pré-matrícula foi enviada com sucesso.", [
      {
        text: "OK",
        onPress: () =>
          router.canGoBack() ? router.back() : router.replace("/"),
      },
    ]);

    // try {
    //   const resposta = await fetch(URL_ENVIO, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(dados),
    //   });

    //   if (resposta.ok) {
    //     setDados(DADOS_VAZIOS);
    //     setEtapa(0);
    //     Alert.alert("Sucesso!", "A pré-matrícula foi enviada com sucesso.", [
    //       {
    //         text: "OK",
    //         onPress: () =>
    //           router.canGoBack() ? router.back() : router.replace("/"),
    //       },
    //     ]);
    //   } else {
    //     setMensagem("Ocorreu um problema ao enviar. Tente novamente.");
    //   }
    // } catch {
    //   setMensagem("Sem conexão com a internet ou erro no servidor.");
    // } finally {
    //   setEnviando(false);
    // }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Stack.Screen options={{ headerShown: false }} />

      {/* Cabeçalho com progresso */}
      <SafeAreaView edges={["top", "left", "right"]} style={styles.cabecalho}>
        <View style={styles.cabecalhoLinha}>
          <Pressable
            style={styles.botaoVoltarIcone}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            onPress={voltar}
          >
            <ChevronLeft size={24} color="#FFFFFF" />
          </Pressable>

          <View>
            <Text style={styles.titulo}>Pré-Matrícula</Text>
            <Text style={styles.subtitulo}>
              Novo aluno — passo {etapa + 1} de {ETAPAS.length}
            </Text>
          </View>
        </View>

        <View style={styles.progresso} accessible={false}>
          {ETAPAS.map((nome, indice) => (
            <View
              key={nome}
              style={[
                styles.progressoBarra,
                indice <= etapa && styles.progressoBarraAtiva,
              ]}
            />
          ))}
        </View>
        <Text style={styles.etapaNome}>{ETAPAS[etapa]}</Text>
      </SafeAreaView>

      {/* Campos da etapa */}
      <ScrollView
        style={styles.corpo}
        contentContainerStyle={styles.corpoConteudo}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        {etapa === 0 && (
          <>
            <Campo rotulo="Nome completo">
              <Entrada
                placeholder="Como consta no RG"
                value={dados.nome}
                onChangeText={(t) => atualizar("nome", t)}
                autoCapitalize="words"
                autoComplete="name"
              />
            </Campo>
            <Campo rotulo="Data de nascimento">
              <Entrada
                placeholder="DD/MM/AAAA"
                value={dados.nascimento}
                onChangeText={(t) => atualizar("nascimento", mascaraData(t))}
                keyboardType="number-pad"
              />
            </Campo>
            <Campo rotulo="CPF">
              <Entrada
                placeholder="000.000.000-00"
                value={dados.cpf}
                onChangeText={(t) => atualizar("cpf", mascaraCpf(t))}
                keyboardType="number-pad"
              />
            </Campo>
            <Campo rotulo="RG">
              <Entrada
                placeholder="Número do documento"
                value={dados.rg}
                onChangeText={(t) => atualizar("rg", t)}
                autoCapitalize="characters"
              />
            </Campo>
            <Campo rotulo="E-mail">
              <Entrada
                placeholder="seu@email.com"
                value={dados.email}
                onChangeText={(t) => atualizar("email", t)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </Campo>
            <Campo rotulo="Telefone / WhatsApp">
              <Entrada
                placeholder="(00) 00000-0000"
                value={dados.telefone}
                onChangeText={(t) => atualizar("telefone", mascaraTelefone(t))}
                keyboardType="phone-pad"
                autoComplete="tel"
              />
            </Campo>
          </>
        )}

        {etapa === 1 && (
          <>
            <Campo rotulo="CEP">
              <Entrada
                placeholder="00000-000"
                value={dados.cep}
                onChangeText={(t) => atualizar("cep", mascaraCep(t))}
                keyboardType="number-pad"
                autoComplete="postal-code"
              />
            </Campo>
            <Campo rotulo="Rua / Avenida">
              <Entrada
                placeholder="Nome da rua"
                value={dados.rua}
                onChangeText={(t) => atualizar("rua", t)}
                autoCapitalize="words"
              />
            </Campo>
            <View style={styles.linhaDupla}>
              <View style={styles.colunaNumero}>
                <Campo rotulo="Número">
                  <Entrada
                    placeholder="Nº"
                    value={dados.numero}
                    onChangeText={(t) => atualizar("numero", t)}
                  />
                </Campo>
              </View>
              <View style={styles.colunaBairro}>
                <Campo rotulo="Bairro">
                  <Entrada
                    placeholder="Bairro"
                    value={dados.bairro}
                    onChangeText={(t) => atualizar("bairro", t)}
                    autoCapitalize="words"
                  />
                </Campo>
              </View>
            </View>
            <Campo rotulo="Cidade">
              <Entrada
                placeholder="Sua cidade"
                value={dados.cidade}
                onChangeText={(t) => atualizar("cidade", t)}
                autoCapitalize="words"
              />
            </Campo>
            <Campo rotulo="Estado">
              <Seletor
                titulo="Estado"
                placeholder="Selecione o estado"
                opcoes={ESTADOS}
                valor={dados.estado}
                aoSelecionar={(v) => atualizar("estado", v)}
              />
            </Campo>
          </>
        )}

        {etapa === 2 && (
          <>
            <Campo rotulo="Escola de interesse">
              <Seletor
                titulo="Escola de interesse"
                placeholder="Selecione a escola"
                opcoes={ESCOLAS}
                valor={dados.escola}
                aoSelecionar={(v) => atualizar("escola", v)}
              />
            </Campo>
            <Campo rotulo="Série / Ano pretendido">
              <Seletor
                titulo="Série / Ano pretendido"
                placeholder="Selecione a série"
                opcoes={SERIES}
                valor={dados.serie}
                aoSelecionar={(v) => atualizar("serie", v)}
              />
            </Campo>
            <Campo rotulo="Turno preferencial">
              <View style={styles.turnos}>
                {TURNOS.map((turno) => {
                  const ativo = dados.turno === turno;

                  return (
                    <Pressable
                      key={turno}
                      style={[styles.turno, ativo && styles.turnoAtivo]}
                      accessibilityRole="radio"
                      accessibilityState={{ selected: ativo }}
                      onPress={() => atualizar("turno", turno)}
                    >
                      <Text
                        style={[
                          styles.turnoTexto,
                          ativo && styles.turnoTextoAtivo,
                        ]}
                      >
                        {turno}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </Campo>

            <View style={styles.aviso}>
              <View style={styles.avisoTitulo}>
                <Info size={14} color="#1D4ED8" />
                <Text style={styles.avisoTituloTexto}>
                  Informação importante
                </Text>
              </View>
              <Text style={styles.avisoTexto}>
                A confirmação da vaga fica sujeita à disponibilidade e ao envio
                dos documentos obrigatórios.
              </Text>
            </View>
          </>
        )}

        {etapa === 3 && (
          <>
            <Text style={styles.introDocumentos}>
              Marque os documentos que você tem disponíveis para entrega na
              secretaria:
            </Text>

            {DOCUMENTOS.map((doc) => {
              const marcado = dados.documentos.includes(doc.id);

              return (
                <Pressable
                  key={doc.id}
                  style={styles.documento}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: marcado }}
                  onPress={() => alternarDocumento(doc.id)}
                >
                  <View
                    style={[styles.marcador, marcado && styles.marcadorAtivo]}
                  >
                    {marcado && (
                      <Check size={15} color="#FFFFFF" strokeWidth={3} />
                    )}
                  </View>
                  <View style={styles.documentoTexto}>
                    <Text style={styles.documentoTitulo}>{doc.titulo}</Text>
                    <Text style={styles.documentoDetalhe}>{doc.detalhe}</Text>
                  </View>
                </Pressable>
              );
            })}
          </>
        )}

        {mensagem !== "" && (
          <Text style={styles.mensagem} accessibilityLiveRegion="polite">
            {mensagem}
          </Text>
        )}
      </ScrollView>

      {/* Rodapé com ações */}
      <SafeAreaView edges={["bottom", "left", "right"]} style={styles.rodape}>
        <View style={styles.rodapeLinha}>
          {etapa > 0 && (
            <Pressable
              style={({ pressed }) => [
                styles.botaoVoltar,
                pressed && styles.pressionado,
              ]}
              accessibilityRole="button"
              disabled={enviando}
              onPress={voltar}
            >
              <Text style={styles.botaoVoltarTexto}>Voltar</Text>
            </Pressable>
          )}

          <Pressable
            style={({ pressed }) => [
              styles.botaoContinuar,
              (pressed || enviando) && styles.pressionado,
            ]}
            accessibilityRole="button"
            accessibilityState={{ disabled: enviando, busy: enviando }}
            disabled={enviando}
            onPress={avancar}
          >
            <Text style={styles.botaoContinuarTexto}>
              {enviando
                ? "Enviando..."
                : ultimaEtapa
                  ? "Enviar Pré-Matrícula"
                  : "Continuar"}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

function Campo({
  rotulo,
  children,
}: {
  rotulo: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.campo}>
      <Text style={styles.rotulo}>{rotulo}</Text>
      {children}
    </View>
  );
}

function Entrada(props: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor="#8290AB"
      autoCorrect={false}
      style={styles.entrada}
      {...props}
    />
  );
}

// Lista de opções em um painel inferior (evita depender de um picker nativo).
function Seletor({
  titulo,
  placeholder,
  opcoes,
  valor,
  aoSelecionar,
}: {
  titulo: string;
  placeholder: string;
  opcoes: string[];
  valor: string;
  aoSelecionar: (valor: string) => void;
}) {
  const [aberto, setAberto] = useState(false);

  return (
    <>
      <Pressable
        style={styles.seletor}
        accessibilityRole="button"
        accessibilityLabel={titulo}
        accessibilityValue={{ text: valor || placeholder }}
        onPress={() => setAberto(true)}
      >
        <Text style={valor ? styles.seletorValor : styles.seletorPlaceholder}>
          {valor || placeholder}
        </Text>
        <ChevronDown size={18} color="#64748B" />
      </Pressable>

      <Modal
        visible={aberto}
        transparent
        animationType="slide"
        onRequestClose={() => setAberto(false)}
      >
        <Pressable style={styles.fundoModal} onPress={() => setAberto(false)}>
          <Pressable style={styles.painel}>
            <SafeAreaView edges={["bottom"]}>
              <Text style={styles.painelTitulo}>{titulo}</Text>
              <ScrollView style={styles.painelLista}>
                {opcoes.map((opcao) => {
                  const ativa = opcao === valor;

                  return (
                    <Pressable
                      key={opcao}
                      style={styles.opcao}
                      accessibilityRole="button"
                      accessibilityState={{ selected: ativa }}
                      onPress={() => {
                        aoSelecionar(opcao);
                        setAberto(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.opcaoTexto,
                          ativa && styles.opcaoTextoAtiva,
                        ]}
                      >
                        {opcao}
                      </Text>
                      {ativa && <Check size={18} color="#1D4ED8" />}
                    </Pressable>
                  );
                })}
              </ScrollView>
            </SafeAreaView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
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
    paddingTop: 12,
    paddingBottom: 20,
  },

  cabecalhoLinha: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  botaoVoltarIcone: {
    width: 44,
    height: 44,
    marginLeft: -10,
    alignItems: "center",
    justifyContent: "center",
  },

  titulo: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
  },

  subtitulo: {
    color: "#DCE6FF",
    fontSize: 12,
    marginTop: 3,
  },

  progresso: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14,
  },

  progressoBarra: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.28)",
  },

  progressoBarraAtiva: {
    backgroundColor: "#FFFFFF",
  },

  etapaNome: {
    color: "#FFFFFF",
    fontSize: 12,
    marginTop: 8,
  },

  // Corpo
  corpo: {
    flex: 1,
  },

  corpoConteudo: {
    width: "100%",
    maxWidth: 440,
    alignSelf: "center",
    padding: 20,
    paddingBottom: 28,
  },

  campo: {
    marginBottom: 18,
  },

  rotulo: {
    color: "#0B1B44",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },

  entrada: {
    minHeight: 50,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#D3DDF4",
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    color: "#0B1B44",
    fontSize: 14,
  },

  linhaDupla: {
    flexDirection: "row",
    gap: 12,
  },

  colunaNumero: {
    flex: 1,
  },

  colunaBairro: {
    flex: 1,
  },

  // Seletor
  seletor: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#D3DDF4",
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
  },

  seletorValor: {
    color: "#0B1B44",
    fontSize: 14,
  },

  seletorPlaceholder: {
    color: "#7486A8",
    fontSize: 14,
  },

  fundoModal: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(11, 27, 68, 0.45)",
  },

  painel: {
    maxHeight: "65%",
    paddingTop: 18,
    paddingHorizontal: 20,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: "#FFFFFF",
  },

  painelTitulo: {
    color: "#0B1B44",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },

  painelLista: {
    flexGrow: 0,
  },

  opcao: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#EEF2FA",
  },

  opcaoTexto: {
    color: "#0B1B44",
    fontSize: 14,
  },

  opcaoTextoAtiva: {
    color: "#1D4ED8",
    fontWeight: "bold",
  },

  // Turno
  turnos: {
    flexDirection: "row",
    gap: 10,
  },

  turno: {
    flex: 1,
    minHeight: 46,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#D3DDF4",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
  },

  turnoAtivo: {
    borderColor: "#1D4ED8",
    backgroundColor: "#EEF2FF",
  },

  turnoTexto: {
    color: "#0B1B44",
    fontSize: 14,
    fontWeight: "600",
  },

  turnoTextoAtivo: {
    color: "#1D4ED8",
  },

  // Informação importante
  aviso: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#EEF2FF",
  },

  avisoTitulo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  avisoTituloTexto: {
    color: "#1D4ED8",
    fontSize: 12,
    fontWeight: "bold",
  },

  avisoTexto: {
    color: "#7486A8",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
  },

  // Documentos
  introDocumentos: {
    color: "#7486A8",
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 16,
  },

  documento: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#D3DDF4",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
  },

  marcador: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#D3DDF4",
    alignItems: "center",
    justifyContent: "center",
  },

  marcadorAtivo: {
    borderColor: "#1D4ED8",
    backgroundColor: "#1D4ED8",
  },

  documentoTexto: {
    flex: 1,
  },

  documentoTitulo: {
    color: "#0B1B44",
    fontSize: 14,
    fontWeight: "bold",
  },

  documentoDetalhe: {
    color: "#7486A8",
    fontSize: 12,
    marginTop: 3,
  },

  mensagem: {
    color: "#E5252A",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },

  // Rodapé
  rodape: {
    borderTopWidth: 1,
    borderTopColor: "#E3E9F5",
    backgroundColor: "#FFFFFF",
  },

  rodapeLinha: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },

  botaoVoltar: {
    flex: 1,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#D3DDF4",
    borderRadius: 16,
    backgroundColor: "#EEF2FF",
  },

  botaoVoltarTexto: {
    color: "#1D4ED8",
    fontSize: 14,
    fontWeight: "bold",
  },

  botaoContinuar: {
    flex: 1,
    minHeight: 52,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: "#205BE9",
    boxShadow: "0px 8px 16px rgba(32, 84, 216, 0.22)",
  },

  botaoContinuarTexto: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },

  pressionado: {
    opacity: 0.75,
  },
});

import { router, Stack } from "expo-router";
import {
  ArrowLeft,
  Check,
  CircleCheck,
  Clock,
  RefreshCw,
} from "lucide-react-native";
import type { ReactNode } from "react";
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
import type { TextInputProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ---------------------------------------------------------------------------
// Configuração e dados de exemplo
// ---------------------------------------------------------------------------

const ANO_LETIVO = 2027;

// Dados de exemplo enquanto o sistema da escola não está conectado.
// Substituir por dados reais (login/API) quando estiverem disponíveis.
const ALUNO = {
  nome: "Ana Beatriz Silva",
  matricula: "2024005847",
  turma: "9º Ano B",
  escola: "EMEF Prof. Adalberto Lima",
};

const TURNOS = ["Manhã", "Tarde"];
const PARENTESCOS = ["Mãe", "Pai", "Avó/Avô", "Tio/Tia", "Tutor legal", "Outro"];
const SIM_NAO = ["Sim", "Não"];

// ---------------------------------------------------------------------------
// Tipos e estado inicial
// ---------------------------------------------------------------------------

type Dados = {
  resp_nome: string;
  resp_parentesco: string;
  resp_cpf: string;
  resp_telefone: string;
  resp_email: string;
  turno: string;
  transporte: string;
  dadosCorretos: boolean;
  aceiteTermos: boolean;
};

type Erros = Partial<Record<keyof Dados, string>>;

type Protocolo = {
  numero: string;
  data: string;
  status: string;
};

const DADOS_VAZIOS: Dados = {
  resp_nome: "",
  resp_parentesco: "",
  resp_cpf: "",
  resp_telefone: "",
  resp_email: "",
  turno: "",
  transporte: "",
  dadosCorretos: false,
  aceiteTermos: false,
};

// ---------------------------------------------------------------------------
// Máscaras e validações
// ---------------------------------------------------------------------------

const soDigitos = (texto: string) => texto.replace(/\D/g, "");

function mascaraCpf(texto: string) {
  const n = soDigitos(texto).slice(0, 11);
  if (n.length <= 3) return n;
  if (n.length <= 6) return `${n.slice(0, 3)}.${n.slice(3)}`;
  if (n.length <= 9) return `${n.slice(0, 3)}.${n.slice(3, 6)}.${n.slice(6)}`;
  return `${n.slice(0, 3)}.${n.slice(3, 6)}.${n.slice(6, 9)}-${n.slice(9)}`;
}

function mascaraTelefone(texto: string) {
  const n = soDigitos(texto).slice(0, 11);
  if (n.length <= 2) return n;
  if (n.length <= 7) return `(${n.slice(0, 2)}) ${n.slice(2)}`;
  return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`;
}

function cpfValido(texto: string) {
  const n = soDigitos(texto);
  if (n.length !== 11 || /^(\d)\1{10}$/.test(n)) return false;
  const digito = (qtd: number) => {
    let soma = 0;
    for (let i = 0; i < qtd; i++) soma += Number(n[i]) * (qtd + 1 - i);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };
  return digito(9) === Number(n[9]) && digito(10) === Number(n[10]);
}

const emailValido = (texto: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(texto.trim());

function validar(d: Dados): Erros {
  const e: Erros = {};
  const obrigatorio = "Campo obrigatório.";

  if (!d.resp_nome.trim()) e.resp_nome = obrigatorio;
  if (!d.resp_parentesco) e.resp_parentesco = "Selecione uma opção.";

  if (!d.resp_cpf) e.resp_cpf = obrigatorio;
  else if (!cpfValido(d.resp_cpf)) e.resp_cpf = "CPF inválido.";

  if (!d.resp_telefone) e.resp_telefone = obrigatorio;
  else if (soDigitos(d.resp_telefone).length < 10)
    e.resp_telefone = "Telefone incompleto.";

  if (!d.resp_email.trim()) e.resp_email = obrigatorio;
  else if (!emailValido(d.resp_email)) e.resp_email = "E-mail inválido.";

  if (!d.turno) e.turno = "Selecione o turno.";
  if (!d.transporte) e.transporte = "Selecione uma opção.";

  if (!d.dadosCorretos) e.dadosCorretos = "Confirme que os dados estão corretos.";
  if (!d.aceiteTermos) e.aceiteTermos = "É necessário aceitar os termos.";

  return e;
}

// Protocolo gerado no próprio app. Em produção, o ideal é o back-end gerar.
function gerarProtocolo(): Protocolo {
  const agora = new Date();
  const dia = String(agora.getDate()).padStart(2, "0");
  const mes = String(agora.getMonth() + 1).padStart(2, "0");

  return {
    numero: `REM-${Date.now()}`,
    data: `${dia}/${mes}/${agora.getFullYear()}`,
    status: "Aguardando análise",
  };
}

// ---------------------------------------------------------------------------
// Componentes de apoio
// ---------------------------------------------------------------------------

function Secao({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <View style={styles.secao}>
      <Text style={styles.secaoTitulo}>{titulo}</Text>
      <View style={styles.cartao}>{children}</View>
    </View>
  );
}

function Campo({
  label,
  erro,
  children,
}: {
  label: string;
  erro?: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.campo}>
      <Text style={styles.label}>{label}</Text>
      {children}
      {erro ? <Text style={styles.erro}>{erro}</Text> : null}
    </View>
  );
}

function Entrada({
  label,
  erro,
  ...props
}: { label: string; erro?: string } & TextInputProps) {
  return (
    <Campo label={label} erro={erro}>
      <TextInput
        placeholderTextColor="#9AA7C2"
        {...props}
        style={[styles.input, erro ? styles.inputErro : null]}
      />
    </Campo>
  );
}

function Opcoes({
  label,
  erro,
  opcoes,
  valor,
  onChange,
}: {
  label: string;
  erro?: string;
  opcoes: string[];
  valor: string;
  onChange: (novo: string) => void;
}) {
  return (
    <Campo label={label} erro={erro}>
      <View style={styles.opcoes}>
        {opcoes.map((opcao) => {
          const ativa = valor === opcao;
          return (
            <Pressable
              key={opcao}
              accessibilityRole="button"
              accessibilityState={{ selected: ativa }}
              onPress={() => onChange(opcao)}
              style={[styles.chip, ativa && styles.chipAtivo]}
            >
              <Text style={[styles.chipTexto, ativa && styles.chipTextoAtivo]}>
                {opcao}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </Campo>
  );
}

function Caixa({
  texto,
  marcado,
  erro,
  onPress,
}: {
  texto: string;
  marcado: boolean;
  erro?: string;
  onPress: () => void;
}) {
  return (
    <View style={styles.campo}>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: marcado }}
        style={styles.caixaLinha}
        onPress={onPress}
      >
        <View style={[styles.caixa, marcado && styles.caixaMarcada]}>
          {marcado ? <Check size={14} color="#FFFFFF" strokeWidth={3} /> : null}
        </View>
        <Text style={styles.caixaTexto}>{texto}</Text>
      </Pressable>
      {erro ? <Text style={styles.erro}>{erro}</Text> : null}
    </View>
  );
}

function LinhaInfo({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <View style={styles.infoLinha}>
      <Text style={styles.infoRotulo}>{rotulo}</Text>
      <Text style={styles.infoValor}>{valor}</Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Tela
// ---------------------------------------------------------------------------

export default function Rematricula() {
  const [dados, setDados] = useState<Dados>(DADOS_VAZIOS);
  const [erros, setErros] = useState<Erros>({});
  const [protocolo, setProtocolo] = useState<Protocolo | null>(null);

  function atualizar<K extends keyof Dados>(campo: K, valor: Dados[K]) {
    setDados((anterior) => ({ ...anterior, [campo]: valor }));
    setErros((anterior) => {
      if (!anterior[campo]) return anterior;
      const atualizado = { ...anterior };
      delete atualizado[campo];
      return atualizado;
    });
  }

  function confirmar() {
    const encontrados = validar(dados);
    setErros(encontrados);
    if (Object.keys(encontrados).length > 0) return;

    // Aqui entra o envio para a API da escola, quando ela existir.
    setProtocolo(gerarProtocolo());
  }

  function voltar() {
    if (router.canGoBack()) router.back();
    else router.replace("/inicio");
  }

  // Tela de sucesso
  if (protocolo) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />

        <View style={styles.sucessoArea}>
          <View style={styles.sucessoIcone}>
            <CircleCheck size={44} color="#16A34A" />
          </View>

          <Text style={styles.sucessoTitulo}>Rematrícula enviada!</Text>
          <Text style={styles.sucessoTexto}>
            A solicitação para o ano letivo de {ANO_LETIVO} foi registrada e
            será analisada pela secretaria.
          </Text>

          <View style={[styles.cartao, styles.sucessoCartao]}>
            <LinhaInfo rotulo="Número" valor={protocolo.numero} />
            <LinhaInfo rotulo="Aluno(a)" valor={ALUNO.nome} />
            <LinhaInfo rotulo="Data" valor={protocolo.data} />
            <View style={styles.statusLinha}>
              <Text style={styles.infoRotulo}>Status</Text>
              <View style={styles.statusSelo}>
                <Clock size={13} color="#B45309" />
                <Text style={styles.statusTexto}>{protocolo.status}</Text>
              </View>
            </View>
          </View>

          <Pressable
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.botao,
              styles.botaoLargo,
              pressed && styles.pressionado,
            ]}
            onPress={() => router.replace("/inicio")}
          >
            <Text style={styles.botaoTexto}>Voltar ao início</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.rolagem}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Cabeçalho */}
          <SafeAreaView edges={["top", "left", "right"]} style={styles.cabecalho}>
            <View style={styles.cabecalhoLinha}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Voltar"
                style={styles.botaoVoltar}
                onPress={voltar}
              >
                <ArrowLeft size={20} color="#FFFFFF" />
              </Pressable>

              <View style={styles.cabecalhoTexto}>
                <Text style={styles.cabecalhoTitulo}>Rematrícula</Text>
                <Text style={styles.cabecalhoSub}>
                  Confirmar para {ANO_LETIVO}
                </Text>
              </View>

              <View style={styles.cabecalhoIcone}>
                <RefreshCw size={20} color="#FFFFFF" />
              </View>
            </View>
          </SafeAreaView>

          <View style={styles.conteudo}>
            {/* Dados do aluno */}
            <Secao titulo="DADOS DO ALUNO">
              <LinhaInfo rotulo="Nome" valor={ALUNO.nome} />
              <LinhaInfo rotulo="Matrícula" valor={ALUNO.matricula} />
              <LinhaInfo rotulo="Turma atual" valor={ALUNO.turma} />
              <LinhaInfo rotulo="Escola" valor={ALUNO.escola} />
            </Secao>

            {/* Responsável */}
            <Secao titulo="RESPONSÁVEL">
              <Entrada
                label="Nome completo"
                value={dados.resp_nome}
                onChangeText={(t) => atualizar("resp_nome", t)}
                erro={erros.resp_nome}
                autoCapitalize="words"
                placeholder="Nome do responsável"
              />
              <Opcoes
                label="Parentesco"
                opcoes={PARENTESCOS}
                valor={dados.resp_parentesco}
                onChange={(v) => atualizar("resp_parentesco", v)}
                erro={erros.resp_parentesco}
              />
              <Entrada
                label="CPF"
                value={dados.resp_cpf}
                onChangeText={(t) => atualizar("resp_cpf", mascaraCpf(t))}
                erro={erros.resp_cpf}
                keyboardType="number-pad"
                placeholder="000.000.000-00"
              />
              <Entrada
                label="Telefone"
                value={dados.resp_telefone}
                onChangeText={(t) =>
                  atualizar("resp_telefone", mascaraTelefone(t))
                }
                erro={erros.resp_telefone}
                keyboardType="phone-pad"
                placeholder="(00) 00000-0000"
              />
              <Entrada
                label="E-mail"
                value={dados.resp_email}
                onChangeText={(t) => atualizar("resp_email", t)}
                erro={erros.resp_email}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="email@exemplo.com"
              />
            </Secao>

            {/* Preferências para o novo ano */}
            <Secao titulo={`PARA ${ANO_LETIVO}`}>
              <Opcoes
                label="Turno"
                opcoes={TURNOS}
                valor={dados.turno}
                onChange={(v) => atualizar("turno", v)}
                erro={erros.turno}
              />
              <Opcoes
                label="Vai utilizar transporte escolar?"
                opcoes={SIM_NAO}
                valor={dados.transporte}
                onChange={(v) => atualizar("transporte", v)}
                erro={erros.transporte}
              />
            </Secao>

            {/* Confirmações */}
            <Secao titulo="CONFIRMAÇÃO">
              <Caixa
                texto="Confirmo que meus dados estão corretos."
                marcado={dados.dadosCorretos}
                onPress={() => atualizar("dadosCorretos", !dados.dadosCorretos)}
                erro={erros.dadosCorretos}
              />
              <Caixa
                texto="Li e aceito os termos de rematrícula da escola."
                marcado={dados.aceiteTermos}
                onPress={() => atualizar("aceiteTermos", !dados.aceiteTermos)}
                erro={erros.aceiteTermos}
              />
            </Secao>

            {Object.keys(erros).length > 0 ? (
              <Text style={styles.erroGeral}>
                Revise os campos destacados para continuar.
              </Text>
            ) : null}

            <Pressable
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.botao,
                styles.botaoLargo,
                pressed && styles.pressionado,
              ]}
              onPress={confirmar}
            >
              <Text style={styles.botaoTexto}>Confirmar rematrícula</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

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

  botaoVoltar: {
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

  cabecalhoIcone: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
  },

  // Conteúdo
  conteudo: {
    width: "100%",
    maxWidth: 440,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  secao: {
    marginBottom: 20,
  },

  secaoTitulo: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1.2,
    marginBottom: 10,
    marginLeft: 3,
  },

  cartao: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D5DEF1",
    borderRadius: 16,
    padding: 16,
  },

  // Informações somente leitura
  infoLinha: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    paddingVertical: 7,
  },

  infoRotulo: {
    color: "#7486A8",
    fontSize: 13,
  },

  infoValor: {
    flexShrink: 1,
    color: "#0B1B44",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "right",
  },

  // Campos
  campo: {
    marginBottom: 14,
  },

  label: {
    color: "#202E50",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 7,
  },

  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: "#D5DEF1",
    borderRadius: 12,
    backgroundColor: "#F7F8FC",
    paddingHorizontal: 14,
    color: "#0B1B44",
    fontSize: 15,
  },

  inputErro: {
    borderColor: "#E5252A",
    backgroundColor: "#FFF5F5",
  },

  erro: {
    color: "#E5252A",
    fontSize: 12,
    marginTop: 6,
  },

  erroGeral: {
    color: "#E5252A",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 12,
  },

  // Opções (chips)
  opcoes: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  chip: {
    minHeight: 40,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D5DEF1",
    backgroundColor: "#F7F8FC",
    alignItems: "center",
    justifyContent: "center",
  },

  chipAtivo: {
    backgroundColor: "#1D4ED8",
    borderColor: "#1D4ED8",
  },

  chipTexto: {
    color: "#475569",
    fontSize: 13,
    fontWeight: "500",
  },

  chipTextoAtivo: {
    color: "#FFFFFF",
  },

  // Caixas de confirmação
  caixaLinha: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minHeight: 44,
  },

  caixa: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "#B8C5E3",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  caixaMarcada: {
    backgroundColor: "#1D4ED8",
    borderColor: "#1D4ED8",
  },

  caixaTexto: {
    flex: 1,
    color: "#202E50",
    fontSize: 14,
    lineHeight: 20,
  },

  // Botão
  botao: {
    minHeight: 52,
    borderRadius: 16,
    backgroundColor: "#1D4ED8",
    alignItems: "center",
    justifyContent: "center",
  },

  botaoLargo: {
    alignSelf: "stretch",
  },

  botaoTexto: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
  },

  pressionado: {
    opacity: 0.75,
  },

  // Tela de sucesso
  sucessoArea: {
    flex: 1,
    width: "100%",
    maxWidth: 440,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  sucessoIcone: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
  },

  sucessoTitulo: {
    color: "#0B1B44",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
  },

  sucessoTexto: {
    color: "#7486A8",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 24,
  },

  sucessoCartao: {
    alignSelf: "stretch",
    marginBottom: 24,
  },

  statusLinha: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 7,
  },

  statusSelo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: "#FFF4CC",
  },

  statusTexto: {
    color: "#B45309",
    fontSize: 12,
    fontWeight: "600",
  },
});

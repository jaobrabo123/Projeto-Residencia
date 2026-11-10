import { useRef, useState } from 'react';
import type { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { TextInputProps } from 'react-native';

// ---------------------------------------------------------------------------
// Configuração
// ---------------------------------------------------------------------------

// Substitua pela sua URL do Formspree
const FORMSPREE_URL = 'https://formspree.io/f/SEU_CODIGO_AQUI';

const GENEROS = ['Feminino', 'Masculino', 'Outro', 'Prefiro não informar'];
const CORES_RACAS = ['Branca', 'Preta', 'Parda', 'Amarela', 'Indígena', 'Não declarada'];
const PARENTESCOS = ['Mãe', 'Pai', 'Avó/Avô', 'Tio/Tia', 'Tutor legal', 'Outro'];
const SERIES = [
  'Pré I', 'Pré II', '1º ano', '2º ano', '3º ano', '4º ano', '5º ano',
  '6º ano', '7º ano', '8º ano', '9º ano', 'EJA',
];
const TURNOS = ['Manhã', 'Tarde'];
const SITUACOES = ['Novo na rede', 'Transferido', 'Renovação'];
const VACINACAO = ['Em dia', 'Pendente', 'Não sei'];
const SIM_NAO = ['Sim', 'Não'];
const DOCUMENTOS = [
  'Certidão de nascimento ou RG do aluno',
  'Comprovante de residência',
  'Histórico escolar ou declaração de transferência',
  'Carteira de vacinação',
  'Documento com foto do responsável',
  'Laudo médico (se houver)',
];

// ---------------------------------------------------------------------------
// Tipos e estado inicial
// ---------------------------------------------------------------------------

type Dados = {
  // Aluno
  aluno_nome: string;
  aluno_nascimento: string;
  aluno_genero: string;
  aluno_cor_raca: string;
  aluno_cpf: string;
  aluno_certidao: string;
  aluno_naturalidade: string;
  aluno_nacionalidade: string;
  // Filiação
  filiacao_mae: string;
  filiacao_pai: string;
  // Endereço
  end_cep: string;
  end_rua: string;
  end_numero: string;
  end_bairro: string;
  end_cidade: string;
  // Responsável
  resp_nome: string;
  resp_parentesco: string;
  resp_cpf: string;
  resp_rg: string;
  resp_telefone: string;
  resp_telefone_emergencia: string;
  resp_email: string;
  // Dados escolares
  acad_ano_letivo: string;
  acad_serie: string;
  acad_turno: string;
  acad_situacao: string;
  acad_escola_origem: string;
  acad_ultima_serie: string;
  // Necessidades especiais
  nee_possui: string;
  nee_descricao: string;
  nee_laudo: string;
  nee_aee: string;
  // Saúde
  saude_alergias: string;
  saude_medicamentos: string;
  saude_emergencia: string;
  saude_vacinacao: string;
  // Transporte
  transporte_escolar: string;
  // Documentos e consentimentos
  documentos: string[];
  auto_imagem: string;
  consentimento_lgpd: boolean;
  declaracao_veracidade: boolean;
};

type CampoTexto = {
  [K in keyof Dados]: Dados[K] extends string ? K : never;
}[keyof Dados];

type Erros = Partial<Record<keyof Dados, string>>;

const DADOS_VAZIOS: Dados = {
  aluno_nome: '',
  aluno_nascimento: '',
  aluno_genero: '',
  aluno_cor_raca: '',
  aluno_cpf: '',
  aluno_certidao: '',
  aluno_naturalidade: '',
  aluno_nacionalidade: 'Brasileira',
  filiacao_mae: '',
  filiacao_pai: '',
  end_cep: '',
  end_rua: '',
  end_numero: '',
  end_bairro: '',
  end_cidade: '',
  resp_nome: '',
  resp_parentesco: '',
  resp_cpf: '',
  resp_rg: '',
  resp_telefone: '',
  resp_telefone_emergencia: '',
  resp_email: '',
  acad_ano_letivo: '',
  acad_serie: '',
  acad_turno: '',
  acad_situacao: '',
  acad_escola_origem: '',
  acad_ultima_serie: '',
  nee_possui: '',
  nee_descricao: '',
  nee_laudo: '',
  nee_aee: '',
  saude_alergias: '',
  saude_medicamentos: '',
  saude_emergencia: '',
  saude_vacinacao: '',
  transporte_escolar: '',
  documentos: [],
  auto_imagem: '',
  consentimento_lgpd: false,
  declaracao_veracidade: false,
};

// ---------------------------------------------------------------------------
// Etapas: título e campos que pertencem a cada uma
// ---------------------------------------------------------------------------

type Etapa = { titulo: string; campos: (keyof Dados)[] };

const ETAPAS: Etapa[] = [
  {
    titulo: 'Aluno',
    campos: [
      'aluno_nome', 'aluno_nascimento', 'aluno_genero', 'aluno_cor_raca', 'aluno_cpf',
      'aluno_certidao', 'aluno_naturalidade', 'aluno_nacionalidade', 'filiacao_mae', 'filiacao_pai',
    ],
  },
  {
    titulo: 'Endereço',
    campos: ['end_cep', 'end_rua', 'end_numero', 'end_bairro', 'end_cidade'],
  },
  {
    titulo: 'Responsável',
    campos: [
      'resp_nome', 'resp_parentesco', 'resp_cpf', 'resp_rg',
      'resp_telefone', 'resp_telefone_emergencia', 'resp_email',
    ],
  },
  {
    titulo: 'Dados escolares',
    campos: [
      'acad_ano_letivo', 'acad_serie', 'acad_turno', 'acad_situacao',
      'acad_escola_origem', 'acad_ultima_serie',
    ],
  },
  {
    titulo: 'Saúde e necessidades',
    campos: [
      'nee_possui', 'nee_descricao', 'nee_laudo', 'nee_aee', 'saude_alergias',
      'saude_medicamentos', 'saude_emergencia', 'saude_vacinacao', 'transporte_escolar',
    ],
  },
  {
    titulo: 'Documentos e consentimentos',
    campos: ['documentos', 'auto_imagem', 'consentimento_lgpd', 'declaracao_veracidade'],
  },
];

function errosDaEtapa(todos: Erros, campos: (keyof Dados)[]): Erros {
  const resultado: Erros = {};
  campos.forEach((campo) => {
    if (todos[campo]) resultado[campo] = todos[campo];
  });
  return resultado;
}

// ---------------------------------------------------------------------------
// Máscaras e validações
// ---------------------------------------------------------------------------

const soDigitos = (texto: string) => texto.replace(/\D/g, '');

function mascaraData(texto: string) {
  const n = soDigitos(texto).slice(0, 8);
  if (n.length <= 2) return n;
  if (n.length <= 4) return `${n.slice(0, 2)}/${n.slice(2)}`;
  return `${n.slice(0, 2)}/${n.slice(2, 4)}/${n.slice(4)}`;
}

function mascaraCpf(texto: string) {
  const n = soDigitos(texto).slice(0, 11);
  if (n.length <= 3) return n;
  if (n.length <= 6) return `${n.slice(0, 3)}.${n.slice(3)}`;
  if (n.length <= 9) return `${n.slice(0, 3)}.${n.slice(3, 6)}.${n.slice(6)}`;
  return `${n.slice(0, 3)}.${n.slice(3, 6)}.${n.slice(6, 9)}-${n.slice(9)}`;
}

function mascaraCep(texto: string) {
  const n = soDigitos(texto).slice(0, 8);
  return n.length <= 5 ? n : `${n.slice(0, 5)}-${n.slice(5)}`;
}

function mascaraTelefone(texto: string) {
  const n = soDigitos(texto).slice(0, 11);
  if (n.length <= 2) return n;
  if (n.length <= 7) return `(${n.slice(0, 2)}) ${n.slice(2)}`;
  return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`;
}

function dataValida(texto: string) {
  const m = texto.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return false;
  const dia = Number(m[1]);
  const mes = Number(m[2]);
  const ano = Number(m[3]);
  const data = new Date(ano, mes - 1, dia);
  return (
    data.getFullYear() === ano &&
    data.getMonth() === mes - 1 &&
    data.getDate() === dia &&
    data <= new Date()
  );
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

const emailValido = (texto: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(texto.trim());

function validar(d: Dados): Erros {
  const e: Erros = {};
  const obrigatorio = (campo: CampoTexto, msg = 'Campo obrigatório.') => {
    if (!d[campo].trim()) e[campo] = msg;
  };

  // Aluno
  if (d.aluno_nome.trim().split(' ').filter(Boolean).length < 2) {
    e.aluno_nome = 'Informe o nome completo.';
  }
  if (!dataValida(d.aluno_nascimento)) e.aluno_nascimento = 'Data inválida (DD/MM/AAAA).';
  obrigatorio('aluno_genero', 'Selecione uma opção.');
  obrigatorio('aluno_cor_raca', 'Selecione uma opção.');
  if (d.aluno_cpf && !cpfValido(d.aluno_cpf)) e.aluno_cpf = 'CPF inválido.';
  obrigatorio('aluno_certidao', 'Informe o número da certidão de nascimento.');
  obrigatorio('aluno_naturalidade');
  obrigatorio('aluno_nacionalidade');
  obrigatorio('filiacao_mae', 'Informe o nome da mãe (como consta na certidão).');

  // Endereço
  if (soDigitos(d.end_cep).length !== 8) e.end_cep = 'CEP inválido.';
  obrigatorio('end_rua');
  obrigatorio('end_numero');
  obrigatorio('end_bairro');
  obrigatorio('end_cidade');

  // Responsável
  if (d.resp_nome.trim().length < 3) e.resp_nome = 'Informe o nome do responsável.';
  obrigatorio('resp_parentesco', 'Selecione o parentesco.');
  if (!cpfValido(d.resp_cpf)) e.resp_cpf = 'CPF inválido.';
  obrigatorio('resp_rg');
  if (soDigitos(d.resp_telefone).length < 10) e.resp_telefone = 'Telefone inválido.';
  if (soDigitos(d.resp_telefone_emergencia).length < 10) {
    e.resp_telefone_emergencia = 'Informe um telefone de emergência válido.';
  }
  if (!emailValido(d.resp_email)) e.resp_email = 'E-mail inválido.';

  // Dados escolares
  if (!/^\d{4}$/.test(d.acad_ano_letivo.trim())) e.acad_ano_letivo = 'Informe o ano (ex.: 2027).';
  obrigatorio('acad_serie', 'Selecione a série.');
  obrigatorio('acad_turno', 'Selecione o turno.');
  obrigatorio('acad_situacao', 'Selecione a situação.');
  if (d.acad_situacao === 'Transferido') {
    obrigatorio('acad_escola_origem', 'Informe a escola de origem.');
    obrigatorio('acad_ultima_serie', 'Informe a última série cursada.');
  }

  // Necessidades especiais, saúde e transporte
  obrigatorio('nee_possui', 'Selecione Sim ou Não.');
  if (d.nee_possui === 'Sim') {
    obrigatorio('nee_descricao', 'Descreva a necessidade.');
    obrigatorio('nee_laudo', 'Selecione Sim ou Não.');
    obrigatorio('nee_aee', 'Selecione Sim ou Não.');
  }
  obrigatorio('saude_vacinacao', 'Selecione uma opção.');
  obrigatorio('transporte_escolar', 'Selecione Sim ou Não.');

  // Consentimentos
  obrigatorio('auto_imagem', 'Selecione Sim ou Não.');
  if (!d.consentimento_lgpd) e.consentimento_lgpd = 'O consentimento é obrigatório.';
  if (!d.declaracao_veracidade) e.declaracao_veracidade = 'A declaração é obrigatória.';

  return e;
}

// Protocolo gerado no próprio app. Em produção, o ideal é o back-end gerar.
function gerarProtocolo(ano: string) {
  const sufixo = Math.floor(100000 + Math.random() * 900000);
  return `PRE-${ano}-${sufixo}`;
}

// ---------------------------------------------------------------------------
// Componentes de apoio
// ---------------------------------------------------------------------------

function Secao({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <View style={styles.secao}>
      <Text style={styles.secaoTitulo}>{titulo}</Text>
      {children}
    </View>
  );
}

function Campo({ label, erro, children }: { label: string; erro?: string; children: ReactNode }) {
  return (
    <View style={styles.campo}>
      <Text style={styles.label}>{label}</Text>
      {children}
      {erro ? <Text style={styles.erro}>{erro}</Text> : null}
    </View>
  );
}

function Entrada({ label, erro, ...props }: { label: string; erro?: string } & TextInputProps) {
  return (
    <Campo label={label} erro={erro}>
      <TextInput
        {...props}
        style={[styles.input, props.multiline && styles.textArea, erro ? styles.inputErro : null]}
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
              onPress={() => onChange(opcao)}
              style={[styles.chip, ativa && styles.chipAtivo]}>
              <Text style={[styles.chipTexto, ativa && styles.chipTextoAtivo]}>{opcao}</Text>
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
      <Pressable style={styles.caixaLinha} onPress={onPress}>
        <View style={[styles.caixa, marcado && styles.caixaMarcada]}>
          {marcado ? <Text style={styles.caixaCheck}>✓</Text> : null}
        </View>
        <Text style={styles.caixaTexto}>{texto}</Text>
      </Pressable>
      {erro ? <Text style={styles.erro}>{erro}</Text> : null}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Tela
// ---------------------------------------------------------------------------

export default function Formulario() {
  const [dados, setDados] = useState<Dados>(DADOS_VAZIOS);
  const [erros, setErros] = useState<Erros>({});
  const [etapa, setEtapa] = useState(0);
  const [mensagemErro, setMensagemErro] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [protocolo, setProtocolo] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  const ultimaEtapa = etapa === ETAPAS.length - 1;

  const irParaTopo = () => scrollRef.current?.scrollTo({ y: 0, animated: true });

  const atualizar = <K extends keyof Dados>(campo: K, valor: Dados[K]) => {
    setDados((atual) => ({ ...atual, [campo]: valor }));
    if (erros[campo]) setErros((atual) => ({ ...atual, [campo]: undefined }));
  };

  const alternarDocumento = (doc: string) => {
    setDados((atual) => ({
      ...atual,
      documentos: atual.documentos.includes(doc)
        ? atual.documentos.filter((item) => item !== doc)
        : [...atual.documentos, doc],
    }));
  };

  const voltar = () => {
    setMensagemErro('');
    setEtapa((atual) => Math.max(0, atual - 1));
    irParaTopo();
  };

  const avancar = () => {
    const daEtapa = errosDaEtapa(validar(dados), ETAPAS[etapa].campos);
    setErros(daEtapa);
    if (Object.keys(daEtapa).length > 0) {
      setMensagemErro('Corrija os campos destacados em vermelho.');
      irParaTopo();
      return;
    }
    setMensagemErro('');
    setEtapa((atual) => atual + 1);
    irParaTopo();
  };

  const enviar = async () => {
    const todos = validar(dados);

    // Se algo ficou pendente em qualquer etapa, volta para a primeira com erro
    if (Object.keys(todos).length > 0) {
      const indice = ETAPAS.findIndex(
        (e) => Object.keys(errosDaEtapa(todos, e.campos)).length > 0,
      );
      setErros(todos);
      setEtapa(indice);
      setMensagemErro(`Há campos pendentes na etapa "${ETAPAS[indice].titulo}".`);
      irParaTopo();
      return;
    }

    setMensagemErro('');
    setEnviando(true);
    const novoProtocolo = gerarProtocolo(dados.acad_ano_letivo.trim());

    try {
      const resposta = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ protocolo: novoProtocolo, ...dados }),
      });

      if (resposta.ok) {
        setProtocolo(novoProtocolo);
        setDados(DADOS_VAZIOS);
        setErros({});
        setEtapa(0);
        irParaTopo();
      } else {
        setMensagemErro('Ocorreu um problema ao enviar. Tente novamente.');
      }
    } catch {
      setMensagemErro('Sem conexão com a internet ou erro no servidor.');
    } finally {
      setEnviando(false);
    }
  };

  // Tela de confirmação após o envio
  if (protocolo) {
    return (
      <View style={styles.confirmacao}>
        <Text style={styles.confirmacaoTitulo}>Pré-matrícula enviada!</Text>
        <Text style={styles.confirmacaoTexto}>Guarde o número do protocolo:</Text>
        <Text style={styles.protocolo}>{protocolo}</Text>
        <Text style={styles.confirmacaoTexto}>
          A escola entrará em contato para confirmar a matrícula e conferir os documentos.
        </Text>
        <Pressable style={styles.botao} onPress={() => setProtocolo('')}>
          <Text style={styles.botaoTexto}>Nova pré-matrícula</Text>
        </Pressable>
      </View>
    );
  }

  const progresso = ((etapa + 1) / ETAPAS.length) * 100;

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        ref={scrollRef}
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.titulo}>Ficha de Pré-Matrícula</Text>

        <View style={styles.progressoBloco}>
          <Text style={styles.progressoTexto}>
            Etapa {etapa + 1} de {ETAPAS.length} — {ETAPAS[etapa].titulo}
          </Text>
          <View style={styles.progressoTrilho}>
            <View style={[styles.progressoBarra, { width: `${progresso}%` }]} />
          </View>
        </View>

        {mensagemErro ? <Text style={styles.banner}>{mensagemErro}</Text> : null}

        {/* ETAPA 1 — ALUNO */}
        {etapa === 0 && (
          <>
            <Secao titulo="Dados do Aluno">
              <Entrada
                label="Nome completo"
                erro={erros.aluno_nome}
                value={dados.aluno_nome}
                onChangeText={(t) => atualizar('aluno_nome', t)}
                placeholder="Ex.: João Silva"
                autoCapitalize="words"
              />
              <Entrada
                label="Data de nascimento"
                erro={erros.aluno_nascimento}
                value={dados.aluno_nascimento}
                onChangeText={(t) => atualizar('aluno_nascimento', mascaraData(t))}
                placeholder="DD/MM/AAAA"
                keyboardType="numeric"
                maxLength={10}
              />
              <Opcoes
                label="Gênero"
                erro={erros.aluno_genero}
                opcoes={GENEROS}
                valor={dados.aluno_genero}
                onChange={(v) => atualizar('aluno_genero', v)}
              />
              <Opcoes
                label="Cor/raça"
                erro={erros.aluno_cor_raca}
                opcoes={CORES_RACAS}
                valor={dados.aluno_cor_raca}
                onChange={(v) => atualizar('aluno_cor_raca', v)}
              />
              <Entrada
                label="CPF do aluno (opcional)"
                erro={erros.aluno_cpf}
                value={dados.aluno_cpf}
                onChangeText={(t) => atualizar('aluno_cpf', mascaraCpf(t))}
                placeholder="000.000.000-00"
                keyboardType="numeric"
                maxLength={14}
              />
              <Entrada
                label="Nº da certidão de nascimento"
                erro={erros.aluno_certidao}
                value={dados.aluno_certidao}
                onChangeText={(t) => atualizar('aluno_certidao', soDigitos(t).slice(0, 32))}
                keyboardType="numeric"
              />
              <Entrada
                label="Naturalidade (cidade/UF)"
                erro={erros.aluno_naturalidade}
                value={dados.aluno_naturalidade}
                onChangeText={(t) => atualizar('aluno_naturalidade', t)}
                placeholder="Ex.: Aracaju/SE"
              />
              <Entrada
                label="Nacionalidade"
                erro={erros.aluno_nacionalidade}
                value={dados.aluno_nacionalidade}
                onChangeText={(t) => atualizar('aluno_nacionalidade', t)}
              />
            </Secao>

            <Secao titulo="Filiação">
              <Entrada
                label="Nome da mãe"
                erro={erros.filiacao_mae}
                value={dados.filiacao_mae}
                onChangeText={(t) => atualizar('filiacao_mae', t)}
                autoCapitalize="words"
              />
              <Entrada
                label="Nome do pai (se constar na certidão)"
                value={dados.filiacao_pai}
                onChangeText={(t) => atualizar('filiacao_pai', t)}
                autoCapitalize="words"
              />
            </Secao>
          </>
        )}

        {/* ETAPA 2 — ENDEREÇO */}
        {etapa === 1 && (
          <Secao titulo="Endereço">
            <Entrada
              label="CEP"
              erro={erros.end_cep}
              value={dados.end_cep}
              onChangeText={(t) => atualizar('end_cep', mascaraCep(t))}
              placeholder="00000-000"
              keyboardType="numeric"
              maxLength={9}
            />
            <Entrada
              label="Rua/Avenida"
              erro={erros.end_rua}
              value={dados.end_rua}
              onChangeText={(t) => atualizar('end_rua', t)}
            />
            <Entrada
              label="Número"
              erro={erros.end_numero}
              value={dados.end_numero}
              onChangeText={(t) => atualizar('end_numero', t)}
            />
            <Entrada
              label="Bairro"
              erro={erros.end_bairro}
              value={dados.end_bairro}
              onChangeText={(t) => atualizar('end_bairro', t)}
            />
            <Entrada
              label="Cidade"
              erro={erros.end_cidade}
              value={dados.end_cidade}
              onChangeText={(t) => atualizar('end_cidade', t)}
            />
          </Secao>
        )}

        {/* ETAPA 3 — RESPONSÁVEL */}
        {etapa === 2 && (
          <Secao titulo="Dados do Responsável">
            <Entrada
              label="Nome do responsável"
              erro={erros.resp_nome}
              value={dados.resp_nome}
              onChangeText={(t) => atualizar('resp_nome', t)}
              autoCapitalize="words"
            />
            <Opcoes
              label="Parentesco com o aluno"
              erro={erros.resp_parentesco}
              opcoes={PARENTESCOS}
              valor={dados.resp_parentesco}
              onChange={(v) => atualizar('resp_parentesco', v)}
            />
            <Entrada
              label="CPF do responsável"
              erro={erros.resp_cpf}
              value={dados.resp_cpf}
              onChangeText={(t) => atualizar('resp_cpf', mascaraCpf(t))}
              placeholder="000.000.000-00"
              keyboardType="numeric"
              maxLength={14}
            />
            <Entrada
              label="RG do responsável"
              erro={erros.resp_rg}
              value={dados.resp_rg}
              onChangeText={(t) => atualizar('resp_rg', t)}
            />
            <Entrada
              label="Telefone (celular)"
              erro={erros.resp_telefone}
              value={dados.resp_telefone}
              onChangeText={(t) => atualizar('resp_telefone', mascaraTelefone(t))}
              placeholder="(00) 00000-0000"
              keyboardType="phone-pad"
              maxLength={15}
            />
            <Entrada
              label="Telefone de emergência (outra pessoa)"
              erro={erros.resp_telefone_emergencia}
              value={dados.resp_telefone_emergencia}
              onChangeText={(t) => atualizar('resp_telefone_emergencia', mascaraTelefone(t))}
              placeholder="(00) 00000-0000"
              keyboardType="phone-pad"
              maxLength={15}
            />
            <Entrada
              label="E-mail principal"
              erro={erros.resp_email}
              value={dados.resp_email}
              onChangeText={(t) => atualizar('resp_email', t)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </Secao>
        )}

        {/* ETAPA 4 — DADOS ESCOLARES */}
        {etapa === 3 && (
          <Secao titulo="Dados Escolares">
            <Entrada
              label="Ano letivo da matrícula"
              erro={erros.acad_ano_letivo}
              value={dados.acad_ano_letivo}
              onChangeText={(t) => atualizar('acad_ano_letivo', soDigitos(t).slice(0, 4))}
              placeholder="Ex.: 2027"
              keyboardType="numeric"
              maxLength={4}
            />
            <Opcoes
              label="Série/ano pretendido"
              erro={erros.acad_serie}
              opcoes={SERIES}
              valor={dados.acad_serie}
              onChange={(v) => atualizar('acad_serie', v)}
            />
            <Opcoes
              label="Turno desejado"
              erro={erros.acad_turno}
              opcoes={TURNOS}
              valor={dados.acad_turno}
              onChange={(v) => atualizar('acad_turno', v)}
            />
            <Opcoes
              label="Situação do aluno"
              erro={erros.acad_situacao}
              opcoes={SITUACOES}
              valor={dados.acad_situacao}
              onChange={(v) => atualizar('acad_situacao', v)}
            />
            <Entrada
              label={
                dados.acad_situacao === 'Transferido'
                  ? 'Escola de origem'
                  : 'Escola de origem (se houver)'
              }
              erro={erros.acad_escola_origem}
              value={dados.acad_escola_origem}
              onChangeText={(t) => atualizar('acad_escola_origem', t)}
            />
            <Entrada
              label={
                dados.acad_situacao === 'Transferido'
                  ? 'Última série cursada'
                  : 'Última série cursada (se houver)'
              }
              erro={erros.acad_ultima_serie}
              value={dados.acad_ultima_serie}
              onChangeText={(t) => atualizar('acad_ultima_serie', t)}
            />
          </Secao>
        )}

        {/* ETAPA 5 — SAÚDE E NECESSIDADES */}
        {etapa === 4 && (
          <>
            <Secao titulo="Necessidades Especiais">
              <Opcoes
                label="O aluno possui deficiência, TEA, altas habilidades ou outra necessidade?"
                erro={erros.nee_possui}
                opcoes={SIM_NAO}
                valor={dados.nee_possui}
                onChange={(v) => atualizar('nee_possui', v)}
              />
              {dados.nee_possui === 'Sim' ? (
                <>
                  <Entrada
                    label="Descreva a necessidade"
                    erro={erros.nee_descricao}
                    value={dados.nee_descricao}
                    onChangeText={(t) => atualizar('nee_descricao', t)}
                    multiline
                    numberOfLines={3}
                  />
                  <Opcoes
                    label="Possui laudo?"
                    erro={erros.nee_laudo}
                    opcoes={SIM_NAO}
                    valor={dados.nee_laudo}
                    onChange={(v) => atualizar('nee_laudo', v)}
                  />
                  <Opcoes
                    label="Precisa de atendimento educacional especializado (AEE)?"
                    erro={erros.nee_aee}
                    opcoes={SIM_NAO}
                    valor={dados.nee_aee}
                    onChange={(v) => atualizar('nee_aee', v)}
                  />
                </>
              ) : null}
            </Secao>

            <Secao titulo="Saúde">
              <Entrada
                label="Alergias ou doenças crônicas"
                value={dados.saude_alergias}
                onChangeText={(t) => atualizar('saude_alergias', t)}
                multiline
                numberOfLines={3}
                placeholder="Nenhuma ou listar..."
              />
              <Entrada
                label="Medicamentos de uso contínuo"
                value={dados.saude_medicamentos}
                onChangeText={(t) => atualizar('saude_medicamentos', t)}
                multiline
                numberOfLines={3}
                placeholder="Nenhum ou listar..."
              />
              <Entrada
                label="Em caso de emergência, o que a escola deve fazer?"
                value={dados.saude_emergencia}
                onChangeText={(t) => atualizar('saude_emergencia', t)}
                multiline
                numberOfLines={3}
                placeholder="Ex.: ligar para o responsável e levar à UPA mais próxima"
              />
              <Opcoes
                label="Situação da vacinação"
                erro={erros.saude_vacinacao}
                opcoes={VACINACAO}
                valor={dados.saude_vacinacao}
                onChange={(v) => atualizar('saude_vacinacao', v)}
              />
            </Secao>

            <Secao titulo="Transporte">
              <Opcoes
                label="O aluno usa transporte escolar?"
                erro={erros.transporte_escolar}
                opcoes={SIM_NAO}
                valor={dados.transporte_escolar}
                onChange={(v) => atualizar('transporte_escolar', v)}
              />
            </Secao>
          </>
        )}

        {/* ETAPA 6 — DOCUMENTOS E CONSENTIMENTOS */}
        {etapa === 5 && (
          <>
            <Secao titulo="Documentos que serão entregues">
              {DOCUMENTOS.map((doc) => (
                <Caixa
                  key={doc}
                  texto={doc}
                  marcado={dados.documentos.includes(doc)}
                  onPress={() => alternarDocumento(doc)}
                />
              ))}
            </Secao>

            <Secao titulo="Consentimentos">
              <Opcoes
                label="Autoriza o uso de imagem do aluno em atividades da escola?"
                erro={erros.auto_imagem}
                opcoes={SIM_NAO}
                valor={dados.auto_imagem}
                onChange={(v) => atualizar('auto_imagem', v)}
              />
              <Caixa
                texto="Autorizo o tratamento dos dados pessoais do aluno e do responsável pela escola, para fins de matrícula e gestão escolar, conforme a LGPD."
                marcado={dados.consentimento_lgpd}
                erro={erros.consentimento_lgpd}
                onPress={() => atualizar('consentimento_lgpd', !dados.consentimento_lgpd)}
              />
              <Caixa
                texto="Declaro que as informações prestadas são verdadeiras."
                marcado={dados.declaracao_veracidade}
                erro={erros.declaracao_veracidade}
                onPress={() => atualizar('declaracao_veracidade', !dados.declaracao_veracidade)}
              />
            </Secao>
          </>
        )}

        <View style={styles.navegacao}>
          {etapa > 0 ? (
            <Pressable
              style={[styles.botao, styles.botaoSecundario]}
              onPress={voltar}
              disabled={enviando}>
              <Text style={styles.botaoSecundarioTexto}>Voltar</Text>
            </Pressable>
          ) : null}

          <Pressable
            style={[styles.botao, styles.botaoPrincipal, enviando && styles.botaoDesativado]}
            onPress={ultimaEtapa ? enviar : avancar}
            disabled={enviando}>
            <Text style={styles.botaoTexto}>
              {ultimaEtapa ? (enviando ? 'Enviando...' : 'Enviar pré-matrícula') : 'Próximo'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: '#f4f7f6' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: 16,
    marginTop: 20,
  },
  progressoBloco: { marginBottom: 20, gap: 8 },
  progressoTexto: { fontSize: 14, fontWeight: '600', color: '#2c3e50', textAlign: 'center' },
  progressoTrilho: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#dfe6e4',
    overflow: 'hidden',
  },
  progressoBarra: { height: 8, borderRadius: 4, backgroundColor: '#27ae60' },
  banner: {
    backgroundColor: '#fdecea',
    color: '#b71c1c',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  secao: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  secaoTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: '#2c3e50',
    color: '#fff',
    padding: 8,
    borderRadius: 4,
    marginBottom: 15,
    overflow: 'hidden',
  },
  campo: { marginBottom: 15 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#fff',
  },
  inputErro: { borderColor: '#d32f2f' },
  textArea: { height: 80, textAlignVertical: 'top' },
  erro: { color: '#d32f2f', fontSize: 12, marginTop: 4 },
  opcoes: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  chipAtivo: { backgroundColor: '#2c3e50', borderColor: '#2c3e50' },
  chipTexto: { color: '#333' },
  chipTextoAtivo: { color: '#fff', fontWeight: '600' },
  caixaLinha: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  caixa: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  caixaMarcada: { backgroundColor: '#27ae60', borderColor: '#27ae60' },
  caixaCheck: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  caixaTexto: { flex: 1, color: '#333', fontSize: 14 },
  navegacao: { flexDirection: 'row', gap: 12, marginTop: 10 },
  botao: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoPrincipal: { flex: 1, backgroundColor: '#27ae60' },
  botaoSecundario: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#2c3e50',
    paddingHorizontal: 24,
  },
  botaoDesativado: { opacity: 0.6 },
  botaoTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  botaoSecundarioTexto: { color: '#2c3e50', fontSize: 16, fontWeight: 'bold' },
  confirmacao: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    gap: 14,
    backgroundColor: '#f4f7f6',
  },
  confirmacaoTitulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
  },
  confirmacaoTexto: { fontSize: 15, color: '#333', textAlign: 'center' },
  protocolo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#27ae60',
    textAlign: 'center',
    letterSpacing: 1,
  },
});

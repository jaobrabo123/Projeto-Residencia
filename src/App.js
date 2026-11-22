import React, { useState, useMemo } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

// ---------- 1. CORES (azul e branco) ----------
// Para mudar o visual do app inteiro, é só mexer aqui.
const COR = {
  azul: '#1E5BD8',        // azul principal
  azulEscuro: '#123C94',  // azul para textos importantes
  azulClaro: '#E8F0FE',   // azul bem claro (fundos)
  azulMedio: '#BFD3F8',   // bordas e detalhes
  branco: '#FFFFFF',
  fundo: '#F4F8FF',       // fundo da tela (branco azulado)
};

// ---------- 2. DADOS ----------
const HORARIOS = [
  { inicio: '07:00', fim: '07:50' },
  { inicio: '07:50', fim: '08:40' },
  { inicio: '08:40', fim: '09:30' },
  { inicio: '09:30', fim: '09:50' }, // intervalo
  { inicio: '09:50', fim: '10:40' },
  { inicio: '10:40', fim: '11:30' },
  { inicio: '11:30', fim: '12:20' },
];

// Grade da semana: a matéria de cada horário, na mesma ordem de cima.
const GRADE = {
  Seg: ['Português', 'Português', 'Matemática', 'Intervalo', 'História', 'Geografia', 'Redação'],
  Ter: ['Matemática', 'Matemática', 'Ciências', 'Intervalo', 'Ed. Física', 'Ens. Religioso', 'Projeto de Vida'],
  Qua: ['Português', 'Inglês', 'Geografia', 'Intervalo', 'Ciências', 'Ed. Física', 'Literatura'],
  Qui: ['Matemática', 'Matemática', 'Português', 'Intervalo', 'História', 'Ciências', 'Estudos Orientados'],
  Sex: ['História', 'Geografia', 'Inglês', 'Intervalo', 'Tecnologia / Robótica', 'Artes', 'Atualidades / Cidadania'],
};

const DIAS = Object.keys(GRADE);

// ---------- 3. FUNÇÕES AUXILIARES ----------
// Transforma "07:50" em minutos desde meia-noite (470), para poder comparar horas.
function paraMinutos(texto) {
  const [h, m] = texto.split(':').map(Number);
  return h * 60 + m;
}

// Descobre o dia de hoje na grade (fim de semana abre na segunda).
function diaDeHoje() {
  const indice = new Date().getDay(); // 0 = domingo ... 6 = sábado
  return DIAS[indice - 1] || DIAS[0];
}

// ---------- 4. TELA ----------
export default function TelaHorarios() {
  const hoje = diaDeHoje();
  const [diaSelecionado, setDiaSelecionado] = useState(hoje);

  const aulas = useMemo(
    () =>
      HORARIOS.map((horario, i) => ({
        ...horario,
        materia: GRADE[diaSelecionado][i],
        ehIntervalo: GRADE[diaSelecionado][i] === 'Intervalo',
      })),
    [diaSelecionado]
  );

  const agora = new Date();
  const minutosAgora = agora.getHours() * 60 + agora.getMinutes();
  const estaNoDiaDeHoje = diaSelecionado === hoje;

  return (
    <SafeAreaView style={estilos.tela}>
      {/* Topo azul */}
      <View style={estilos.cabecalho}>
        <Text style={estilos.titulo}>Horário de aulas</Text>
        <Text style={estilos.subtitulo}>Manhã · 07:00 às 12:20</Text>

        {/* Botões dos dias */}
        <View style={estilos.dias}>
          {DIAS.map((dia) => {
            const ativo = dia === diaSelecionado;
            return (
              <TouchableOpacity
                key={dia}
                onPress={() => setDiaSelecionado(dia)}
                style={[estilos.botaoDia, ativo && estilos.botaoDiaAtivo]}
              >
                <Text style={[estilos.textoDia, ativo && estilos.textoDiaAtivo]}>
                  {dia}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Lista de aulas */}
      <ScrollView contentContainerStyle={estilos.lista}>
        {aulas.map((aula) => {
          const emAndamento =
            estaNoDiaDeHoje &&
            minutosAgora >= paraMinutos(aula.inicio) &&
            minutosAgora < paraMinutos(aula.fim);

          return (
            <View
              key={aula.inicio}
              style={[
                estilos.cartao,
                aula.ehIntervalo && estilos.cartaoIntervalo,
                emAndamento && estilos.cartaoAtual,
              ]}
            >
              <View style={estilos.colunaHora}>
                <Text style={[estilos.hora, emAndamento && estilos.textoBranco]}>
                  {aula.inicio}
                </Text>
                <Text style={[estilos.horaFim, emAndamento && estilos.textoBrancoSuave]}>
                  {aula.fim}
                </Text>
              </View>

              <View style={[estilos.faixa, emAndamento && estilos.faixaAtual]} />

              <View style={estilos.info}>
                <Text
                  style={[
                    estilos.materia,
                    aula.ehIntervalo && estilos.materiaIntervalo,
                    emAndamento && estilos.textoBranco,
                  ]}
                >
                  {aula.materia}
                </Text>
                {emAndamento && <Text style={estilos.agora}>Acontecendo agora</Text>}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------- 5. ESTILOS ----------
const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: COR.fundo },

  cabecalho: {
    backgroundColor: COR.azul,
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 18,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  titulo: { fontSize: 28, fontWeight: '700', color: COR.branco },
  subtitulo: { fontSize: 14, color: COR.azulMedio, marginTop: 4 },

  dias: { flexDirection: 'row', gap: 8, marginTop: 18 },
  botaoDia: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
  },
  botaoDiaAtivo: { backgroundColor: COR.branco },
  textoDia: { fontSize: 15, fontWeight: '600', color: COR.branco },
  textoDiaAtivo: { color: COR.azul },

  lista: { padding: 16, gap: 10 },
  cartao: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COR.branco,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: COR.azulMedio,
  },
  cartaoIntervalo: {
    backgroundColor: COR.azulClaro,
    borderColor: COR.azulClaro,
    paddingVertical: 8,
  },
  cartaoAtual: { backgroundColor: COR.azul, borderColor: COR.azul },

  colunaHora: { width: 52 },
  hora: { fontSize: 15, fontWeight: '700', color: COR.azulEscuro },
  horaFim: { fontSize: 12, color: '#7C93C0', marginTop: 2 },

  faixa: {
    width: 4,
    alignSelf: 'stretch',
    borderRadius: 2,
    marginHorizontal: 12,
    backgroundColor: COR.azul,
  },
  faixaAtual: { backgroundColor: COR.branco },

  info: { flex: 1 },
  materia: { fontSize: 17, fontWeight: '600', color: COR.azulEscuro },
  materiaIntervalo: { fontSize: 15, fontWeight: '500', color: '#5B7BB8' },
  agora: { fontSize: 12, color: COR.azulMedio, fontWeight: '600', marginTop: 4 },

  textoBranco: { color: COR.branco },
  textoBrancoSuave: { color: COR.azulMedio },
});
import { ChevronDown } from "lucide-react-native";
import type { ReactNode } from "react";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

// Cartão expansível de uma disciplina.
// Compartilhado entre Boletim (notas) e Faltas/Frequência, que no wireframe
// usam a mesma lista por disciplina: muda só o destaque e o conteúdo aberto.

export type Destaque = {
  valor: string;
  rotulo: string;
  cor: string;
};

export type Etiqueta = {
  texto: string;
  cor: string;
  fundo: string;
};

type Props = {
  nome: string;
  subtitulo?: string;
  destaque: Destaque;
  etiqueta?: Etiqueta;
  // Conteúdo mostrado ao abrir o cartão.
  children?: ReactNode;
  inicialmenteAberto?: boolean;
};

export function CartaoDisciplina({
  nome,
  subtitulo,
  destaque,
  etiqueta,
  children,
  inicialmenteAberto = false,
}: Props) {
  const [aberto, setAberto] = useState(inicialmenteAberto);
  const expansivel = children != null;

  return (
    <View style={styles.cartao}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={expansivel ? { expanded: aberto } : undefined}
        accessibilityLabel={`${nome}, ${destaque.rotulo} ${destaque.valor}${
          etiqueta ? `, ${etiqueta.texto}` : ""
        }`}
        disabled={!expansivel}
        onPress={() => setAberto(!aberto)}
        style={({ pressed }) => [styles.linha, pressed && styles.pressionado]}
      >
        <View style={[styles.barraCor, { backgroundColor: destaque.cor }]} />

        <View style={styles.texto}>
          <Text style={styles.nome} numberOfLines={1}>
            {nome}
          </Text>
          {subtitulo ? (
            <Text style={styles.subtitulo} numberOfLines={1}>
              {subtitulo}
            </Text>
          ) : null}
          {etiqueta ? (
            <View style={[styles.etiqueta, { backgroundColor: etiqueta.fundo }]}>
              <Text style={[styles.etiquetaTexto, { color: etiqueta.cor }]}>
                {etiqueta.texto}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.destaque}>
          <Text style={[styles.destaqueValor, { color: destaque.cor }]}>
            {destaque.valor}
          </Text>
          <Text style={styles.destaqueRotulo}>{destaque.rotulo}</Text>
        </View>

        {expansivel ? (
          <View style={aberto ? styles.setaAberta : undefined}>
            <ChevronDown size={18} color="#7486A8" />
          </View>
        ) : null}
      </Pressable>

      {expansivel && aberto ? (
        <View style={styles.detalhe}>{children}</View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  cartao: {
    marginBottom: 8,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D5DEF1",
    overflow: "hidden",
  },

  linha: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minHeight: 64,
    paddingVertical: 12,
    paddingLeft: 12,
    paddingRight: 14,
  },

  pressionado: {
    opacity: 0.75,
  },

  barraCor: {
    width: 4,
    alignSelf: "stretch",
    borderRadius: 2,
  },

  texto: {
    flex: 1,
    minWidth: 0,
  },

  nome: {
    color: "#0B1B44",
    fontSize: 14,
    fontWeight: "bold",
  },

  subtitulo: {
    color: "#7486A8",
    fontSize: 12,
    marginTop: 3,
  },

  etiqueta: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 6,
  },

  etiquetaTexto: {
    fontSize: 11,
    fontWeight: "600",
  },

  destaque: {
    alignItems: "flex-end",
  },

  destaqueValor: {
    fontSize: 20,
    fontWeight: "bold",
  },

  destaqueRotulo: {
    color: "#7486A8",
    fontSize: 11,
    marginTop: 2,
  },

  setaAberta: {
    transform: [{ rotate: "180deg" }],
  },

  detalhe: {
    borderTopWidth: 1,
    borderTopColor: "#E3E9F5",
    backgroundColor: "#F8FAFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});

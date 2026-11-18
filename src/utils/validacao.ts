// Validação da matrícula ou CPF.
// Usada no login e na recuperação de senha.
export function validarIdentificacao(valor: string): string | null {
  const texto = valor.trim();

  if (!texto) {
    return "Informe sua matrícula ou CPF.";
  }

  // Aceita matrícula numérica ou CPF completo no formato 000.000.000-00.
  // O tamanho da matrícula e a validade do cadastro dependem da escola.
  if (!/^\d+$/.test(texto) && !/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(texto)) {
    return "Use apenas números na matrícula ou CPF. Para CPF formatado, use 000.000.000-00.";
  }

  return null;
}


import * as Yup from 'yup';

export const uniformRequestItemSchema = Yup.object().shape({
  tipoUniforme: Yup.string().required("O tipo do uniforme é obrigatório"),
  tamanhoUniforme: Yup.string().required("O tamanho do uniforme é obrigatório"),
  quantidade: Yup.number()
    .required("A quantidade é obrigatória")
    .min(1, "A quantidade deve ser pelo menos 1")
    .integer("A quantidade deve ser um número inteiro"),
});

export const uniformRequestSchema = Yup.object().shape({
  uniformeItens: Yup.array()
    .of(uniformRequestItemSchema)
    .min(1, "Adicione pelo menos um item de uniforme"),
  observacoes: Yup.string(),
});

export const vacationRequestSchema = Yup.object().shape({
  dataInicio: Yup.string().required("A data de início é obrigatória"),
  dataFim: Yup.string().required("A data de fim é obrigatória"),
  observacoes: Yup.string(),
});

export const advanceRequestSchema = Yup.object().shape({
  advance_amount: Yup.number()
    .required("O valor do adiantamento é obrigatório")
    .positive("O valor deve ser positivo"),
  advance_reason: Yup.string().required("O motivo do adiantamento é obrigatório"),
  observacoes: Yup.string(),
});

export const documentRequestSchema = Yup.object().shape({
  dataInicio: Yup.string().required("A data é obrigatória"),
  observacoes: Yup.string().required("A descrição do documento é obrigatória"),
});

export async function validateRequest(tipo: string, data: any) {
  let schema;
  
  switch (tipo) {
    case 'uniforme':
      schema = uniformRequestSchema;
      break;
    case 'ferias':
      schema = vacationRequestSchema;
      break;
    case 'adiantamento':
      schema = advanceRequestSchema;
      break;
    case 'documento':
      schema = documentRequestSchema;
      break;
    default:
      throw new Error("Tipo de solicitação inválido");
  }
  
  try {
    await schema.validate(data, { abortEarly: false });
    return { isValid: true, errors: null };
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      const errors = error.inner.reduce((acc: Record<string, string>, curr) => {
        if (curr.path) {
          acc[curr.path] = curr.message;
        }
        return acc;
      }, {});
      
      return { isValid: false, errors };
    }
    throw error;
  }
}

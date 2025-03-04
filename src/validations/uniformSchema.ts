
import * as Yup from 'yup';

export const uniformSchema = Yup.object().shape({
  type: Yup.string().required("O tipo do uniforme é obrigatório"),
  size: Yup.string().required("O tamanho do uniforme é obrigatório"),
  quantity: Yup.number()
    .required("A quantidade é obrigatória")
    .min(0, "A quantidade não pode ser negativa")
    .integer("A quantidade deve ser um número inteiro"),
  min_quantity: Yup.number()
    .required("A quantidade mínima é obrigatória")
    .min(0, "A quantidade mínima não pode ser negativa")
    .integer("A quantidade mínima deve ser um número inteiro"),
});

export async function validateUniform(data: any) {
  try {
    await uniformSchema.validate(data, { abortEarly: false });
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

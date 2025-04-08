export const AI_PROMPTS = {
  DESTINATION_DESCRIPTION: (destinationName: string): string => `
    Faça um resumo sobre ${destinationName} enfatizando o
    porque este lugar é incrível. Utilize uma linguagem 
    informal de até 100 caracteres no máximo em cada parágrafo. 
    Crie 2 parágrafos neste resumo. O texto deve ser escrito em português do Brasil.`,
  PHOTO_DESCRIPTION: 'Gere uma descrição em português do brasil de até 100 caracteres para a seguinte imagem',
} as const;
export const AI_PROMPTS = {
  DESTINATION_DESCRIPTION_TEXT: (destinationName: string): string => `
    Faça um resumo sobre ${destinationName} enfatizando o porque este lugar é incrível. 
    Utilize uma linguagem informal de até 100 caracteres no máximo em cada parágrafo. 
    Crie 2 parágrafos neste resumo.
    Substitua a quebra de linha por um duplo \n
    O texto deve ser escrito em português do Brasil.
  `,
  DESTINATION_DESCRIPTION_TITLE: (text: string): string => `
    Crie e escolha um título com no máximo 50 caracteres para o seguinte texto: ${text}
    Quero que o resultado deste prompt seja apenas o titulo escolhido.
  `,
  DESTINATION_DESCRIPTION_SUBTITLE: (text: string): string => `
    Crie e escolha um subtítulo com no máximo 100 caracteres para o seguinte texto: ${text}
    Quero que o resultado deste prompt seja apenas o titulo escolhido.
  `,
  PHOTO_DESCRIPTION: 'Gere uma descrição em português do brasil de até 100 caracteres para a seguinte imagem',
} as const;
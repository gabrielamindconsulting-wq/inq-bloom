export type AgeGroup = "P1" | "P2" | "P3" | "P4" | "P5" | "P6" | "P7" | "P8" | "P9" | "P10" | "P11";

export const AGE_GROUP_LABELS: Record<AgeGroup, string> = {
  P1: "P1 — 0 a 3 meses",
  P2: "P2 — 4 a 6 meses",
  P3: "P3 — 7 a 9 meses",
  P4: "P4 — 10 a 12 meses",
  P5: "P5 — 13 a 15 meses",
  P6: "P6 — 16 a 18 meses",
  P7: "P7 — 19 meses a 3 anos",
  P8: "P8 — 3 anos (36 meses)",
  P9: "P9 — 4 anos (48 meses)",
  P10: "P10 — 5 anos (60 meses)",
  P11: "P11 — 6 anos (72 meses)",
};

export type Domain =
  | "sensoriomotor"
  | "funcao_manual"
  | "comunicacao"
  | "linguagem"
  | "cognitivo"
  | "socioemocional";

export const DOMAIN_LABELS: Record<Domain, string> = {
  sensoriomotor: "Desenvolvimento Sensoriomotor",
  funcao_manual: "Função Manual",
  comunicacao: "Comunicação",
  linguagem: "Linguagem e Audição",
  cognitivo: "Cognitivo",
  socioemocional: "Socioemocional",
};

export const DOMAIN_ICONS: Record<Domain, string> = {
  sensoriomotor: "🦾",
  funcao_manual: "✋",
  comunicacao: "💬",
  linguagem: "🔊",
  cognitivo: "🧠",
  socioemocional: "❤️",
};

export interface Question {
  id: string;
  domain: Domain;
  text: string;
  positiveAnswer: boolean; // true = "Sim" is the expected/healthy answer
}

export interface AgeGroupQuestions {
  ageGroup: AgeGroup;
  questions: Question[];
}

function q(id: string, domain: Domain, text: string, positiveAnswer: boolean): Question {
  return { id, domain, text, positiveAnswer };
}

export const SCREENING_QUESTIONS: AgeGroupQuestions[] = [
  {
    ageGroup: "P1",
    questions: [
      q("P1-1", "sensoriomotor", "Apresenta o sorriso social até o final do primeiro trimestre?", true),
      q("P1-2", "sensoriomotor", "Apresenta o olhar vago com pouco interesse?", false),
      q("P1-3", "sensoriomotor", "Observa e acompanha os movimentos dos objetos e/ou das coisas?", true),
      q("P1-4", "sensoriomotor", "Ao menor ruído realiza movimentos de sobressalto ou susto?", false),
      q("P1-5", "sensoriomotor", "Apresenta movimentos involuntários?", false),
      q("P1-6", "sensoriomotor", "Apresenta movimentos circulares das mãos (atetose/movimentos contorcionais)?", false),
      q("P1-7", "sensoriomotor", "Apresenta tremores das extremidades (mãos e pés)?", false),
      q("P1-8", "sensoriomotor", "Apresenta algum grau de controle de cabeça até o final do primeiro trimestre?", true),
      q("P1-9", "funcao_manual", "Apresenta exacerbação do reflexo de sucção?", false),
      q("P1-10", "funcao_manual", "Mantém sempre as mãos fechadas?", false),
      q("P1-11", "funcao_manual", "Leva a mão à boca?", true),
      q("P1-12", "comunicacao", "Responde ou reage aos sons?", true),
    ],
  },
  {
    ageGroup: "P2",
    questions: [
      q("P2-1", "sensoriomotor", "Apresenta até o final do segundo trimestre hipotonia do eixo do corpo (muito mole)?", false),
      q("P2-2", "sensoriomotor", "Apresenta deficiência ou falta de controle da cabeça?", false),
      q("P2-3", "sensoriomotor", "Apresenta hipertonia de membros (rigidez dos membros)?", false),
      q("P2-4", "sensoriomotor", "Demonstra falta de interesse ou é extremamente lento na movimentação?", false),
      q("P2-5", "sensoriomotor", "Apresenta movimentos involuntários?", false),
      q("P2-6", "sensoriomotor", "Empurra com as pernas quando os pés estão encostados na parede ou superfície dura?", true),
      q("P2-7", "sensoriomotor", "Apresenta movimentos bruscos, tipo: choque, tremor ou descarga?", false),
      q("P2-8", "funcao_manual", "Apresenta dificuldade em levar objetos/brinquedos à boca?", false),
      q("P2-9", "comunicacao", "Vira a cabeça para localizar sons?", true),
      q("P2-10", "comunicacao", "Apresenta o sorriso social?", true),
      q("P2-11", "comunicacao", "Reage quando chamado pelo próprio nome?", true),
      q("P2-12", "linguagem", "Emite ou reage aos sons?", true),
      q("P2-13", "socioemocional", "Observa o movimento de objetos, coisas e/ou pessoas?", true),
      q("P2-14", "socioemocional", "Tenta pegar objetos e/ou brinquedos que estão ao alcance?", true),
      q("P2-15", "socioemocional", "Demonstra afeto por seus cuidadores?", true),
      q("P2-16", "socioemocional", "Rola ou se movimenta em alguma direção?", true),
    ],
  },
  {
    ageGroup: "P3",
    questions: [
      q("P3-1", "sensoriomotor", "Apresenta pernas moles com dificuldade de suportar o peso quando colocado de pé (hipotonia)?", false),
      q("P3-2", "sensoriomotor", "Apresenta pernas duras ou dificuldade de dobrar (hipertonia)?", false),
      q("P3-3", "sensoriomotor", "É capaz de se manter sentado?", true),
      q("P3-4", "sensoriomotor", "Persiste em manter as mãos fechadas e os polegares voltados para as palmas?", false),
      q("P3-5", "funcao_manual", "Transfere objetos e/ou brinquedos de uma mão para a outra?", true),
      q("P3-6", "comunicacao", "Responde ao próprio nome?", true),
      q("P3-7", "comunicacao", "Balbucia ou vocaliza?", true),
      q("P3-8", "linguagem", "Apresenta incapacidade de localizar sons e/ou ruídos?", false),
      q("P3-9", "socioemocional", "Apresenta pouco sorriso social?", false),
      q("P3-10", "socioemocional", "Demonstra interesse durante a leitura de um adulto?", true),
      q("P3-11", "socioemocional", "Demonstra interesse pela brincadeira \"Cadê o bebê?/Achou\"?", true),
      q("P3-12", "socioemocional", "Olha para onde você aponta?", true),
      q("P3-13", "socioemocional", "Participa de alguma brincadeira envolvendo dar e receber objetos?", true),
    ],
  },
  {
    ageGroup: "P4",
    questions: [
      q("P4-1", "sensoriomotor", "Perdeu habilidades que já havia adquirido?", false),
      q("P4-2", "sensoriomotor", "Engatinha?", true),
      q("P4-3", "sensoriomotor", "Consegue ficar de pé com apoio?", true),
      q("P4-4", "sensoriomotor", "Permanece muito tempo parado ou com os olhos parados?", false),
      q("P4-5", "sensoriomotor", "Apresenta movimentos anormais?", false),
      q("P4-6", "funcao_manual", "Procura por objetos e/ou brinquedos que viu serem escondidos?", true),
      q("P4-7", "comunicacao", "Aprendeu gestos como: balançar a cabeça dizendo não e acenar dando tchau?", true),
      q("P4-8", "comunicacao", "Aponta para objetos/brinquedos/pessoas?", true),
      q("P4-9", "linguagem", "Fala sílabas ou balbucia?", true),
      q("P4-10", "socioemocional", "Apresenta tentativa de dialogar com o cuidador com quem mais interage?", true),
      q("P4-11", "socioemocional", "Encontra-se psiquicamente irritado ou inerte, com sorriso social pobre?", false),
    ],
  },
  {
    ageGroup: "P5",
    questions: [
      q("P5-1", "sensoriomotor", "Perdeu habilidades que já havia conquistado?", false),
      q("P5-2", "sensoriomotor", "Consegue andar?", true),
      q("P5-3", "funcao_manual", "Aponta para objetos quando nomeados?", true),
      q("P5-4", "funcao_manual", "Sabe a utilidade dos objetos?", true),
      q("P5-5", "comunicacao", "Faz imitação?", true),
      q("P5-6", "comunicacao", "Aprende novas palavras?", true),
      q("P5-7", "comunicacao", "Apresenta um vocabulário de no mínimo 6 palavras com função?", true),
      q("P5-8", "linguagem", "Percebe sons no ambiente?", true),
      q("P5-9", "socioemocional", "Liga ou percebe se os pais/cuidadores saem ou retornam?", true),
      q("P5-10", "socioemocional", "Aponta para mostrar coisas para outras pessoas?", true),
      q("P5-11", "socioemocional", "Possui jogo simbólico?", true),
    ],
  },
  {
    ageGroup: "P6",
    questions: [
      q("P6-1", "sensoriomotor", "Perdeu habilidades que já havia adquirido?", false),
      q("P6-2", "sensoriomotor", "Consegue seguir comandos simples?", true),
      q("P6-3", "sensoriomotor", "Consegue andar/caminhar com firmeza?", true),
      q("P6-4", "funcao_manual", "Conhece a utilidade e a função de objetos e brinquedos?", true),
      q("P6-5", "funcao_manual", "Sabe o que fazer com objetos comuns (escova, telefone, garfo, colher)?", true),
      q("P6-6", "comunicacao", "Imita sons, gestos, expressões e palavras?", true),
      q("P6-7", "comunicacao", "Usa frases de 2 palavras (ex: \"beber água\")?", true),
      q("P6-8", "comunicacao", "Fala alguma palavra?", true),
      q("P6-9", "linguagem", "Imita ações e palavras?", true),
      q("P6-10", "cognitivo", "Isola-se ou recusa-se a brincar com outras crianças?", false),
      q("P6-11", "cognitivo", "Apresenta gestos e/ou movimentos repetitivos?", false),
      q("P6-12", "cognitivo", "Faz contato visual?", true),
    ],
  },
  {
    ageGroup: "P7",
    questions: [
      q("P7-1", "sensoriomotor", "Consegue correr e mudar de direção sem cair com frequência?", true),
      q("P7-2", "sensoriomotor", "Sobe escadas sem ajuda?", true),
      q("P7-3", "sensoriomotor", "Fica na ponta do pé?", true),
      q("P7-4", "funcao_manual", "Empilha/constrói torres de pelo menos 5 cubos?", true),
      q("P7-5", "funcao_manual", "Consegue virar páginas de um livro?", true),
      q("P7-6", "funcao_manual", "Imita ou copia risco vertical e circular (aos 24 meses)?", true),
      q("P7-7", "comunicacao", "Usa frases de 2 ou mais palavras?", true),
      q("P7-8", "comunicacao", "Seu vocabulário está crescendo progressivamente?", true),
      q("P7-9", "linguagem", "Compreende e executa comandos simples?", true),
      q("P7-10", "cognitivo", "Demonstra jogo simbólico (faz de conta)?", true),
      q("P7-11", "cognitivo", "Reconhece objetos e pessoas familiares?", true),
      q("P7-12", "socioemocional", "Demonstra interesse em brincar com outras crianças?", true),
      q("P7-13", "socioemocional", "Expressa emoções de forma adequada (alegria, choro, frustração)?", true),
    ],
  },
  {
    ageGroup: "P8",
    questions: [
      q("P8-1", "sensoriomotor", "Sobe e desce escadas com um pé em cada degrau?", true),
      q("P8-2", "sensoriomotor", "Corre com facilidade sem cair frequentemente?", true),
      q("P8-3", "sensoriomotor", "Consegue pedalar um triciclo?", true),
      q("P8-4", "sensoriomotor", "Pula com os dois pés?", true),
      q("P8-5", "funcao_manual", "Empilha/constrói uma torre com 10 cubos?", true),
      q("P8-6", "funcao_manual", "Utiliza lápis de cor para desenhar?", true),
      q("P8-7", "funcao_manual", "Consegue virar uma página de cada vez?", true),
      q("P8-8", "comunicacao", "Fala palavras como eu, você, nós em contexto adequado?", true),
      q("P8-9", "comunicacao", "Canta músicas infantis?", true),
      q("P8-10", "comunicacao", "Mantém conversa criando 2 ou 3 frases?", true),
      q("P8-11", "linguagem", "Responde a perguntas simples (Quem?, Onde?, Qual?)?", true),
      q("P8-12", "cognitivo", "Demonstra jogo simbólico elaborado (brinca de casinha, cuida de boneco)?", true),
      q("P8-13", "cognitivo", "Consegue fazer categorias simples (animais, comidas)?", true),
      q("P8-14", "socioemocional", "Demonstra empatia (consola amigos tristes)?", true),
      q("P8-15", "socioemocional", "Consegue separar-se dos pais sem crise intensa?", true),
    ],
  },
  {
    ageGroup: "P9",
    questions: [
      q("P9-1", "sensoriomotor", "Consegue pegar uma bola quicando na maior parte do tempo?", true),
      q("P9-2", "sensoriomotor", "Pula e fica sobre um pé só por pelo menos 2 segundos?", true),
      q("P9-3", "sensoriomotor", "Sobe escadas alternando os pés?", true),
      q("P9-4", "funcao_manual", "Risca dentro dos limites de linhas?", true),
      q("P9-5", "funcao_manual", "Começa a utilizar tesoura?", true),
      q("P9-6", "funcao_manual", "Consegue abotoar e desabotoar (às vezes com auxílio)?", true),
      q("P9-7", "funcao_manual", "Estabeleceu dominância manual (mão preferida definida)?", true),
      q("P9-8", "comunicacao", "Fala o seu primeiro e último nome e quantos anos tem?", true),
      q("P9-9", "comunicacao", "Conta histórias (mesmo que fantasiosas)?", true),
      q("P9-10", "comunicacao", "Fala entre 500 e 1000 palavras?", true),
      q("P9-11", "linguagem", "Relata fatos ocorridos no passado?", true),
      q("P9-12", "linguagem", "Usa tempos verbais (presente, passado, futuro)?", true),
      q("P9-13", "cognitivo", "Compreende conceitos de quantidade (mais, menos, igual)?", true),
      q("P9-14", "cognitivo", "Reconhece cores e formas?", true),
      q("P9-15", "socioemocional", "Brinca cooperativamente com outras crianças?", true),
      q("P9-16", "socioemocional", "Demonstra imaginação criativa nas brincadeiras?", true),
    ],
  },
  {
    ageGroup: "P10",
    questions: [
      q("P10-1", "sensoriomotor", "Consegue ficar em pé sobre um pé só por 10 segundos ou mais?", true),
      q("P10-2", "sensoriomotor", "Pula para frente pelo menos 10 vezes sem cair?", true),
      q("P10-3", "sensoriomotor", "Consegue dar cambalhotas?", true),
      q("P10-4", "funcao_manual", "A preensão dos objetos é similar à de um adulto?", true),
      q("P10-5", "funcao_manual", "Consegue amarrar os sapatos e abotoar botões?", true),
      q("P10-6", "funcao_manual", "Copia objetos com modelo (letras, números, desenhos)?", true),
      q("P10-7", "funcao_manual", "Identifica a mão dominante para escrever?", true),
      q("P10-8", "comunicacao", "Fala palavras com clareza e é compreendido por estranhos?", true),
      q("P10-9", "comunicacao", "Conta histórias com início, meio e fim?", true),
      q("P10-10", "linguagem", "Usa frases complexas e gramaticalmente corretas?", true),
      q("P10-11", "linguagem", "Compreende e responde perguntas abstratas?", true),
      q("P10-12", "cognitivo", "Reconhece letras do alfabeto?", true),
      q("P10-13", "cognitivo", "Conta até 10 objetos?", true),
      q("P10-14", "cognitivo", "Compreende conceitos de tempo (ontem, hoje, amanhã)?", true),
      q("P10-15", "socioemocional", "Demonstra autocontrole em situações frustrantes?", true),
      q("P10-16", "socioemocional", "Tem amigos preferidos e busca sua companhia?", true),
    ],
  },
  {
    ageGroup: "P11",
    questions: [
      q("P11-1", "sensoriomotor", "Salta e gira em um pé só com bom equilíbrio?", true),
      q("P11-2", "sensoriomotor", "Anda de bicicleta com equilíbrio?", true),
      q("P11-3", "sensoriomotor", "Realiza sua higiene com autonomia (banho, escovação)?", true),
      q("P11-4", "sensoriomotor", "Se veste e despe sozinha com autonomia?", true),
      q("P11-5", "funcao_manual", "Usa tesoura, pincéis, canetas e lápis com destreza?", true),
      q("P11-6", "funcao_manual", "Consegue copiar desenhos complexos e letras/números?", true),
      q("P11-7", "funcao_manual", "Consegue enfiar uma linha na agulha?", true),
      q("P11-8", "comunicacao", "Consegue pronunciar todos os sons da língua com clareza?", true),
      q("P11-9", "comunicacao", "Elabora frases complexas e gramaticalmente corretas?", true),
      q("P11-10", "comunicacao", "Reconta histórias de forma sequencial e coesa?", true),
      q("P11-11", "linguagem", "Diz o mês e dia de seu aniversário?", true),
      q("P11-12", "linguagem", "Possui bom vocabulário e adequa ao contexto?", true),
      q("P11-13", "cognitivo", "Reconhece e escreve letras e números?", true),
      q("P11-14", "cognitivo", "Compreende regras de jogos e as segue?", true),
      q("P11-15", "cognitivo", "Demonstra raciocínio lógico básico?", true),
      q("P11-16", "socioemocional", "Demonstra empatia e respeita sentimentos alheios?", true),
      q("P11-17", "socioemocional", "Resolve conflitos com palavras (não agressão física)?", true),
      q("P11-18", "socioemocional", "Adapta-se bem ao ambiente escolar?", true),
    ],
  },
];

export function getQuestionsForAgeGroup(ageGroup: AgeGroup): Question[] {
  return SCREENING_QUESTIONS.find((g) => g.ageGroup === ageGroup)?.questions ?? [];
}

export function getQuestionsByDomain(questions: Question[]): Record<Domain, Question[]> {
  const result: Partial<Record<Domain, Question[]>> = {};
  for (const q of questions) {
    if (!result[q.domain]) result[q.domain] = [];
    result[q.domain]!.push(q);
  }
  return result as Record<Domain, Question[]>;
}

export function isAlert(question: Question, answer: boolean): boolean {
  return question.positiveAnswer !== answer;
}

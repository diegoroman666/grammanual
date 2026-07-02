import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookOpen, faListUl, faClock, faMapMarkerAlt, faQuestion,
  faGraduationCap, faSearch, faChevronDown, faChevronUp,
  faLink, faSitemap, faCodeBranch, faExchangeAlt, faCogs
} from '@fortawesome/free-solid-svg-icons';
import { levelMeta } from '../data/pruebaData';
import './Teoria.css';

// ─── Data ────────────────────────────────────────────────────────────────────

const irregularVerbs = [
  { base: 'be',         past: 'was / were', participle: 'been',      meaning: 'ser / estar' },
  { base: 'begin',      past: 'began',      participle: 'begun',     meaning: 'comenzar' },
  { base: 'break',      past: 'broke',      participle: 'broken',    meaning: 'romper' },
  { base: 'bring',      past: 'brought',    participle: 'brought',   meaning: 'traer' },
  { base: 'buy',        past: 'bought',     participle: 'bought',    meaning: 'comprar' },
  { base: 'catch',      past: 'caught',     participle: 'caught',    meaning: 'atrapar' },
  { base: 'choose',     past: 'chose',      participle: 'chosen',    meaning: 'elegir' },
  { base: 'come',       past: 'came',       participle: 'come',      meaning: 'venir' },
  { base: 'do',         past: 'did',        participle: 'done',      meaning: 'hacer' },
  { base: 'drink',      past: 'drank',      participle: 'drunk',     meaning: 'beber' },
  { base: 'drive',      past: 'drove',      participle: 'driven',    meaning: 'conducir' },
  { base: 'eat',        past: 'ate',        participle: 'eaten',     meaning: 'comer' },
  { base: 'fall',       past: 'fell',       participle: 'fallen',    meaning: 'caer' },
  { base: 'feel',       past: 'felt',       participle: 'felt',      meaning: 'sentir' },
  { base: 'find',       past: 'found',      participle: 'found',     meaning: 'encontrar' },
  { base: 'fly',        past: 'flew',       participle: 'flown',     meaning: 'volar' },
  { base: 'forget',     past: 'forgot',     participle: 'forgotten', meaning: 'olvidar' },
  { base: 'get',        past: 'got',        participle: 'gotten',    meaning: 'obtener' },
  { base: 'give',       past: 'gave',       participle: 'given',     meaning: 'dar' },
  { base: 'go',         past: 'went',       participle: 'gone',      meaning: 'ir' },
  { base: 'grow',       past: 'grew',       participle: 'grown',     meaning: 'crecer' },
  { base: 'have',       past: 'had',        participle: 'had',       meaning: 'tener' },
  { base: 'hear',       past: 'heard',      participle: 'heard',     meaning: 'oír' },
  { base: 'keep',       past: 'kept',       participle: 'kept',      meaning: 'mantener' },
  { base: 'know',       past: 'knew',       participle: 'known',     meaning: 'saber / conocer' },
  { base: 'leave',      past: 'left',       participle: 'left',      meaning: 'dejar / salir' },
  { base: 'lose',       past: 'lost',       participle: 'lost',      meaning: 'perder' },
  { base: 'make',       past: 'made',       participle: 'made',      meaning: 'hacer / fabricar' },
  { base: 'meet',       past: 'met',        participle: 'met',       meaning: 'conocer / reunirse' },
  { base: 'put',        past: 'put',        participle: 'put',       meaning: 'poner' },
  { base: 'read',       past: 'read',       participle: 'read',      meaning: 'leer' },
  { base: 'run',        past: 'ran',        participle: 'run',       meaning: 'correr' },
  { base: 'say',        past: 'said',       participle: 'said',      meaning: 'decir' },
  { base: 'see',        past: 'saw',        participle: 'seen',      meaning: 'ver' },
  { base: 'sell',       past: 'sold',       participle: 'sold',      meaning: 'vender' },
  { base: 'send',       past: 'sent',       participle: 'sent',      meaning: 'enviar' },
  { base: 'sleep',      past: 'slept',      participle: 'slept',     meaning: 'dormir' },
  { base: 'speak',      past: 'spoke',      participle: 'spoken',    meaning: 'hablar' },
  { base: 'spend',      past: 'spent',      participle: 'spent',     meaning: 'gastar / pasar (tiempo)' },
  { base: 'swim',       past: 'swam',       participle: 'swum',      meaning: 'nadar' },
  { base: 'take',       past: 'took',       participle: 'taken',     meaning: 'tomar' },
  { base: 'teach',      past: 'taught',     participle: 'taught',    meaning: 'enseñar' },
  { base: 'tell',       past: 'told',       participle: 'told',      meaning: 'contar / decir' },
  { base: 'think',      past: 'thought',    participle: 'thought',   meaning: 'pensar' },
  { base: 'understand', past: 'understood', participle: 'understood',meaning: 'entender' },
  { base: 'wake',       past: 'woke',       participle: 'woken',     meaning: 'despertar' },
  { base: 'wear',       past: 'wore',       participle: 'worn',      meaning: 'llevar puesto' },
  { base: 'win',        past: 'won',        participle: 'won',       meaning: 'ganar' },
  { base: 'write',      past: 'wrote',      participle: 'written',   meaning: 'escribir' },
];

const regularVerbs = [
  { base: 'answer',  past: 'answered',  meaning: 'responder' },
  { base: 'ask',     past: 'asked',     meaning: 'preguntar' },
  { base: 'call',    past: 'called',    meaning: 'llamar' },
  { base: 'clean',   past: 'cleaned',   meaning: 'limpiar' },
  { base: 'close',   past: 'closed',    meaning: 'cerrar' },
  { base: 'cook',    past: 'cooked',    meaning: 'cocinar' },
  { base: 'dance',   past: 'danced',    meaning: 'bailar' },
  { base: 'finish',  past: 'finished',  meaning: 'terminar' },
  { base: 'help',    past: 'helped',    meaning: 'ayudar' },
  { base: 'jump',    past: 'jumped',    meaning: 'saltar' },
  { base: 'like',    past: 'liked',     meaning: 'gustar' },
  { base: 'listen',  past: 'listened',  meaning: 'escuchar' },
  { base: 'live',    past: 'lived',     meaning: 'vivir' },
  { base: 'love',    past: 'loved',     meaning: 'amar' },
  { base: 'open',    past: 'opened',    meaning: 'abrir' },
  { base: 'play',    past: 'played',    meaning: 'jugar / tocar' },
  { base: 'start',   past: 'started',   meaning: 'empezar' },
  { base: 'study',   past: 'studied',   meaning: 'estudiar' },
  { base: 'talk',    past: 'talked',    meaning: 'hablar' },
  { base: 'travel',  past: 'traveled',  meaning: 'viajar' },
  { base: 'use',     past: 'used',      meaning: 'usar' },
  { base: 'visit',   past: 'visited',   meaning: 'visitar' },
  { base: 'walk',    past: 'walked',    meaning: 'caminar' },
  { base: 'want',    past: 'wanted',    meaning: 'querer' },
  { base: 'watch',   past: 'watched',   meaning: 'mirar / ver' },
  { base: 'work',    past: 'worked',    meaning: 'trabajar' },
];

const adverbs = [
  { word: 'Always',       percent: 100, translation: 'siempre',        example: 'She always wakes up early.' },
  { word: 'Usually',      percent: 80,  translation: 'usualmente',     example: 'He usually has coffee in the morning.' },
  { word: 'Frequently',   percent: 70,  translation: 'frecuentemente', example: 'They frequently visit the museum.' },
  { word: 'Often',        percent: 60,  translation: 'a menudo',       example: 'I often read before bed.' },
  { word: 'Sometimes',    percent: 40,  translation: 'a veces',        example: 'We sometimes eat outside.' },
  { word: 'Occasionally', percent: 25,  translation: 'ocasionalmente', example: 'She occasionally forgets her keys.' },
  { word: 'Rarely',       percent: 15,  translation: 'raramente',      example: 'He rarely misses class.' },
  { word: 'Seldom',       percent: 10,  translation: 'pocas veces',    example: 'They seldom argue.' },
  { word: 'Hardly ever',  percent: 5,   translation: 'casi nunca',     example: 'I hardly ever watch TV.' },
  { word: 'Never',        percent: 0,   translation: 'nunca',          example: 'She never lies.' },
];

const placePhrases = [
  { phrase: 'here',           spanish: 'aquí',              example: 'Come here, please.' },
  { phrase: 'there',          spanish: 'allí / allá',       example: 'The book is over there.' },
  { phrase: 'at home',        spanish: 'en casa',           example: 'She stays at home on Sundays.' },
  { phrase: 'at school',      spanish: 'en la escuela',     example: 'The kids are at school.' },
  { phrase: 'at work',        spanish: 'en el trabajo',     example: 'He is at work right now.' },
  { phrase: 'in the kitchen', spanish: 'en la cocina',      example: 'Dinner is ready in the kitchen.' },
  { phrase: 'in the office',  spanish: 'en la oficina',     example: 'We have a meeting in the office.' },
  { phrase: 'on the table',   spanish: 'sobre la mesa',     example: 'Your keys are on the table.' },
  { phrase: 'on the floor',   spanish: 'en el suelo',       example: 'The cat is sleeping on the floor.' },
  { phrase: 'next to',        spanish: 'al lado de',        example: 'Sit next to me.' },
  { phrase: 'in front of',    spanish: 'frente a',          example: 'The park is in front of the school.' },
  { phrase: 'behind',         spanish: 'detrás de',         example: 'The car is behind the house.' },
  { phrase: 'between',        spanish: 'entre',             example: 'The shop is between the bank and the park.' },
  { phrase: 'near',           spanish: 'cerca de',          example: 'We live near the beach.' },
  { phrase: 'far from',       spanish: 'lejos de',          example: 'The airport is far from here.' },
  { phrase: 'upstairs',       spanish: 'arriba',            example: 'My room is upstairs.' },
  { phrase: 'downstairs',     spanish: 'abajo',             example: 'The kitchen is downstairs.' },
];

const timePhrases = [
  { phrase: 'now',              spanish: 'ahora',              example: 'I am studying now.' },
  { phrase: 'today',            spanish: 'hoy',                example: 'Today is Monday.' },
  { phrase: 'yesterday',        spanish: 'ayer',               example: 'I saw her yesterday.' },
  { phrase: 'tomorrow',         spanish: 'mañana',             example: 'We leave tomorrow.' },
  { phrase: 'last week',        spanish: 'la semana pasada',   example: 'They traveled last week.' },
  { phrase: 'last month',       spanish: 'el mes pasado',      example: 'She started last month.' },
  { phrase: 'last year',        spanish: 'el año pasado',      example: 'We moved last year.' },
  { phrase: 'next week',        spanish: 'la próxima semana',  example: 'Call me next week.' },
  { phrase: 'next month',       spanish: 'el próximo mes',     example: 'The exam is next month.' },
  { phrase: 'in the morning',   spanish: 'en la mañana',       example: 'I exercise in the morning.' },
  { phrase: 'in the afternoon', spanish: 'en la tarde',        example: 'We meet in the afternoon.' },
  { phrase: 'at night',         spanish: 'en la noche',        example: 'He works at night.' },
  { phrase: 'every day',        spanish: 'cada día',           example: 'She reads every day.' },
  { phrase: 'every week',       spanish: 'cada semana',        example: 'They play soccer every week.' },
  { phrase: 'on weekends',      spanish: 'los fines de semana', example: 'We rest on weekends.' },
  { phrase: 'ago',              spanish: 'hace (tiempo)',       example: 'We met two years ago.' },
  { phrase: 'soon',             spanish: 'pronto',              example: 'I will be there soon.' },
  { phrase: 'already',          spanish: 'ya',                  example: 'She has already eaten.' },
  { phrase: 'yet',              spanish: 'todavía / aún',       example: 'Have you finished yet?' },
  { phrase: 'still',            spanish: 'todavía',             example: 'He is still waiting.' },
];

const wQuestions = [
  {
    word: 'What',    spanish: '¿Qué? / ¿Cuál?',
    use: 'Preguntar sobre cosas o acciones',
    structure: 'What + aux + sujeto + verbo?',
    examples: [
      { q: 'What are you doing?',       a: '¿Qué estás haciendo?' },
      { q: 'What is your name?',        a: '¿Cuál es tu nombre?' },
      { q: 'What do you want to eat?',  a: '¿Qué quieres comer?' },
    ],
  },
  {
    word: 'Who',     spanish: '¿Quién? / ¿Quiénes?',
    use: 'Preguntar sobre personas',
    structure: 'Who + verbo + complemento?',
    examples: [
      { q: 'Who is she?',           a: '¿Quién es ella?' },
      { q: 'Who called you?',       a: '¿Quién te llamó?' },
      { q: 'Who do you live with?', a: '¿Con quién vives?' },
    ],
  },
  {
    word: 'Where',   spanish: '¿Dónde?',
    use: 'Preguntar sobre lugares',
    structure: 'Where + aux + sujeto + verbo?',
    examples: [
      { q: 'Where do you live?',   a: '¿Dónde vives?' },
      { q: 'Where is the park?',   a: '¿Dónde está el parque?' },
      { q: 'Where are you going?', a: '¿A dónde vas?' },
    ],
  },
  {
    word: 'When',    spanish: '¿Cuándo?',
    use: 'Preguntar sobre tiempo',
    structure: 'When + aux + sujeto + verbo?',
    examples: [
      { q: 'When did you arrive?',     a: '¿Cuándo llegaste?' },
      { q: 'When is your birthday?',   a: '¿Cuándo es tu cumpleaños?' },
      { q: 'When will she come back?', a: '¿Cuándo regresará ella?' },
    ],
  },
  {
    word: 'Why',     spanish: '¿Por qué?',
    use: 'Preguntar razones o causas',
    structure: 'Why + aux + sujeto + verbo?',
    examples: [
      { q: 'Why are you late?',         a: '¿Por qué llegas tarde?' },
      { q: 'Why did he leave?',         a: '¿Por qué se fue él?' },
      { q: 'Why do you study English?', a: '¿Por qué estudias inglés?' },
    ],
  },
  {
    word: 'Which',   spanish: '¿Cuál? / ¿Cuáles?',
    use: 'Elegir entre opciones específicas',
    structure: 'Which + sustantivo + aux + sujeto + verbo?',
    examples: [
      { q: 'Which book do you prefer?', a: '¿Cuál libro prefieres?' },
      { q: 'Which color is that?',      a: '¿Cuál color es ese?' },
      { q: 'Which team won?',           a: '¿Cuál equipo ganó?' },
    ],
  },
  {
    word: 'How',         spanish: '¿Cómo?',
    use: 'Preguntar sobre manera o estado',
    structure: 'How + aux + sujeto + verbo?',
    examples: [
      { q: 'How are you?',       a: '¿Cómo estás?' },
      { q: 'How did you do it?', a: '¿Cómo lo hiciste?' },
      { q: 'How does it work?',  a: '¿Cómo funciona?' },
    ],
  },
  {
    word: 'How much', spanish: '¿Cuánto? (incontable)',
    use: 'Cantidad de cosas no contables o precios',
    structure: 'How much + sustantivo + aux + sujeto?',
    examples: [
      { q: 'How much does it cost?',       a: '¿Cuánto cuesta?' },
      { q: 'How much water do you drink?', a: '¿Cuánta agua tomas?' },
      { q: 'How much time do we have?',    a: '¿Cuánto tiempo tenemos?' },
    ],
  },
  {
    word: 'How many', spanish: '¿Cuántos? / ¿Cuántas? (contable)',
    use: 'Cantidad de cosas contables',
    structure: 'How many + sustantivo plural + aux + sujeto?',
    examples: [
      { q: 'How many people are there?',     a: '¿Cuántas personas hay?' },
      { q: 'How many classes do you have?',  a: '¿Cuántas clases tienes?' },
      { q: 'How many siblings do you have?', a: '¿Cuántos hermanos tienes?' },
    ],
  },
  {
    word: 'How long', spanish: '¿Por cuánto tiempo?',
    use: 'Duración de una acción',
    structure: 'How long + aux + sujeto + verbo?',
    examples: [
      { q: 'How long have you been here?', a: '¿Cuánto tiempo llevas aquí?' },
      { q: 'How long did the movie last?', a: '¿Cuánto duró la película?' },
      { q: 'How long does it take?',       a: '¿Cuánto tiempo tarda?' },
    ],
  },
];

const connectors = [
  {
    category: 'Adición', tag: 'addition',
    items: [
      { word: 'and',         meaning: 'y',                  example: 'I like coffee and tea.' },
      { word: 'also',        meaning: 'también',            example: 'She also speaks French.' },
      { word: 'in addition', meaning: 'además',             example: 'In addition, the price is low.' },
      { word: 'furthermore', meaning: 'es más / además',    example: 'Furthermore, he is reliable.' },
      { word: 'moreover',    meaning: 'es más',             example: 'Moreover, she is talented.' },
      { word: 'besides',     meaning: 'además de eso',      example: 'Besides, it is completely free.' },
      { word: 'as well as',  meaning: 'así como / además de', example: 'He speaks English as well as French.' },
    ],
  },
  {
    category: 'Contraste', tag: 'contrast',
    items: [
      { word: 'but',              meaning: 'pero',                  example: 'I am tired but happy.' },
      { word: 'however',          meaning: 'sin embargo',           example: 'However, she disagreed.' },
      { word: 'although',         meaning: 'aunque',                example: 'Although it was late, she stayed.' },
      { word: 'even though',      meaning: 'a pesar de que',        example: 'Even though it rained, we went out.' },
      { word: 'nevertheless',     meaning: 'no obstante',           example: 'Nevertheless, he continued.' },
      { word: 'on the other hand', meaning: 'por otro lado',        example: 'On the other hand, prices are high.' },
      { word: 'despite / in spite of', meaning: 'a pesar de',      example: 'Despite the cold, she went running.' },
      { word: 'while / whereas',  meaning: 'mientras que / aunque', example: 'She likes coffee, whereas he prefers tea.' },
    ],
  },
  {
    category: 'Causa', tag: 'cause',
    items: [
      { word: 'because',    meaning: 'porque',               example: 'I stayed because it was raining.' },
      { word: 'since',      meaning: 'ya que / puesto que',  example: 'Since you are here, let\'s start.' },
      { word: 'as',         meaning: 'dado que / como',      example: 'As she was tired, she left early.' },
      { word: 'due to',     meaning: 'debido a',             example: 'Due to the storm, flights were cancelled.' },
      { word: 'because of', meaning: 'a causa de',           example: 'Because of the traffic, we were late.' },
      { word: 'owing to',   meaning: 'debido a (formal)',    example: 'Owing to illness, he missed the meeting.' },
    ],
  },
  {
    category: 'Resultado', tag: 'result',
    items: [
      { word: 'so',            meaning: 'así que / entonces',  example: 'It was late, so I left.' },
      { word: 'therefore',     meaning: 'por lo tanto',        example: 'Therefore, we must act now.' },
      { word: 'as a result',   meaning: 'como resultado',      example: 'As a result, sales increased.' },
      { word: 'consequently',  meaning: 'consecuentemente',    example: 'Consequently, he lost his job.' },
      { word: 'thus',          meaning: 'así / de este modo',  example: 'Thus, the problem was resolved.' },
      { word: 'hence',         meaning: 'de ahí que (formal)', example: 'He was ill, hence the delay.' },
    ],
  },
  {
    category: 'Secuencia', tag: 'sequence',
    items: [
      { word: 'first / firstly',  meaning: 'primero',          example: 'First, preheat the oven.' },
      { word: 'then',             meaning: 'luego / entonces',  example: 'Then, add the ingredients.' },
      { word: 'next',             meaning: 'a continuación',    example: 'Next, mix everything together.' },
      { word: 'after that',       meaning: 'después de eso',    example: 'After that, wait 10 minutes.' },
      { word: 'subsequently',     meaning: 'posteriormente',    example: 'Subsequently, results improved.' },
      { word: 'finally / lastly', meaning: 'finalmente',        example: 'Finally, serve and enjoy.' },
    ],
  },
  {
    category: 'Condición', tag: 'condition',
    items: [
      { word: 'if',            meaning: 'si',                      example: 'If you study, you will pass.' },
      { word: 'unless',        meaning: 'a menos que',             example: 'Unless you hurry, you\'ll be late.' },
      { word: 'as long as',    meaning: 'siempre y cuando',        example: 'You can go as long as you call.' },
      { word: 'provided that', meaning: 'con tal de que (formal)', example: 'Provided that it\'s safe, proceed.' },
      { word: 'in case',       meaning: 'en caso de que',          example: 'Take an umbrella in case it rains.' },
    ],
  },
  {
    category: 'Ejemplo / Conclusión', tag: 'example',
    items: [
      { word: 'for example / for instance', meaning: 'por ejemplo',     example: 'For example, dogs are loyal.' },
      { word: 'such as',                    meaning: 'como / tal como',  example: 'Languages such as English spread fast.' },
      { word: 'in conclusion / to sum up',  meaning: 'en conclusión',    example: 'In conclusion, we must change now.' },
      { word: 'in summary / overall',       meaning: 'en resumen',       example: 'Overall, the results are positive.' },
      { word: 'in other words',             meaning: 'en otras palabras', example: 'In other words, it didn\'t work.' },
    ],
  },
];

const prepositionRules = {
  time: [
    {
      prep: 'AT',
      rule: 'Horas exactas, momentos precisos del día, fiestas',
      cases: [
        { label: 'Horas',        examples: ['at 3 PM', 'at 7:30 AM', 'at midnight', 'at noon'] },
        { label: 'Momentos',     examples: ['at night', 'at the weekend (BrE)', 'at lunchtime'] },
        { label: 'Fiestas',      examples: ['at Christmas', 'at Easter', 'at Thanksgiving'] },
      ],
    },
    {
      prep: 'ON',
      rule: 'Días de la semana, fechas concretas, días especiales',
      cases: [
        { label: 'Días',         examples: ['on Monday', 'on Friday', 'on weekdays', 'on weekends'] },
        { label: 'Fechas',       examples: ['on June 15th', 'on December 25th'] },
        { label: 'Días especiales', examples: ['on my birthday', "on New Year's Day", 'on the last day'] },
      ],
    },
    {
      prep: 'IN',
      rule: 'Meses, años, décadas, siglos, estaciones, períodos del día',
      cases: [
        { label: 'Meses',        examples: ['in March', 'in December', 'in August'] },
        { label: 'Años / décadas', examples: ['in 2020', 'in the 1990s', 'in the 21st century'] },
        { label: 'Estaciones',   examples: ['in summer', 'in winter', 'in spring'] },
        { label: 'Períodos',     examples: ['in the morning', 'in the afternoon', 'in the evening'] },
      ],
    },
  ],
  place: [
    {
      prep: 'AT',
      rule: 'Puntos específicos, establecimientos, eventos',
      cases: [
        { label: 'Puntos',       examples: ['at the door', 'at the corner', 'at the top'] },
        { label: 'Lugares',      examples: ['at school', 'at work', 'at home', 'at the station'] },
        { label: 'Eventos',      examples: ['at a concert', 'at a party', 'at the meeting'] },
      ],
    },
    {
      prep: 'ON',
      rule: 'Superficies, medios de transporte con ruedas, calles',
      cases: [
        { label: 'Superficies',  examples: ['on the table', 'on the wall', 'on the floor', 'on the ceiling'] },
        { label: 'Transporte',   examples: ['on the bus', 'on the train', 'on the plane', 'on a ship'] },
        { label: 'Calles',       examples: ['on Main Street', 'on the road', 'on the highway'] },
      ],
    },
    {
      prep: 'IN',
      rule: 'Espacios cerrados, ciudades, países, habitaciones',
      cases: [
        { label: 'Espacios',     examples: ['in the room', 'in the box', 'in the car', 'in the building'] },
        { label: 'Ciudades/Países', examples: ['in London', 'in Spain', 'in the USA', 'in the north'] },
        { label: 'Habitaciones', examples: ['in the kitchen', 'in the office', 'in the garden'] },
      ],
    },
  ],
};

const conditionals = [
  {
    type: 'Zero Conditional',
    number: '0',
    use: 'Verdades generales, hechos científicos, situaciones que siempre ocurren',
    structure: 'If / When + presente simple  →  presente simple',
    note: 'Ambas cláusulas van en presente simple.',
    examples: [
      { cond: 'If you heat water to 100°C,', result: 'it boils.', es: 'Si calientas agua a 100°C, hierve.' },
      { cond: 'If you mix red and blue,',    result: 'you get purple.', es: 'Si mezclas rojo y azul, obtienes morado.' },
      { cond: 'If it rains,',                result: 'the ground gets wet.', es: 'Si llueve, el suelo se moja.' },
    ],
  },
  {
    type: 'First Conditional',
    number: '1',
    use: 'Situaciones reales y posibles en el futuro',
    structure: 'If + presente simple  →  will + verbo base',
    note: 'La cláusula con "if" NO usa "will".',
    examples: [
      { cond: 'If she studies hard,',   result: 'she will pass the exam.', es: 'Si estudia duro, pasará el examen.' },
      { cond: 'If it rains tomorrow,',  result: 'we will stay home.', es: 'Si llueve mañana, nos quedaremos en casa.' },
      { cond: 'If you call me,',        result: 'I will answer.', es: 'Si me llamas, responderé.' },
    ],
  },
  {
    type: 'Second Conditional',
    number: '2',
    use: 'Situaciones hipotéticas o poco probables en el presente/futuro',
    structure: 'If + pasado simple  →  would + verbo base',
    note: 'Con "be" se usa "were" para todas las personas (I/he/she were).',
    examples: [
      { cond: 'If I had a car,',     result: 'I would drive to work.', es: 'Si tuviera un carro, manejaría al trabajo.' },
      { cond: 'If she were rich,',   result: 'she would travel the world.', es: 'Si fuera rica, viajaría por el mundo.' },
      { cond: 'If I spoke Japanese,', result: 'I would move to Tokyo.', es: 'Si hablara japonés, me iría a Tokio.' },
    ],
  },
  {
    type: 'Third Conditional',
    number: '3',
    use: 'Situaciones hipotéticas en el pasado (ya no pueden cambiar)',
    structure: 'If + past perfect  →  would have + participio',
    note: 'Expresa arrepentimiento o situaciones que no ocurrieron.',
    examples: [
      { cond: 'If she had studied more,',   result: 'she would have passed.', es: 'Si hubiera estudiado más, habría pasado.' },
      { cond: 'If I had known,',            result: 'I would have told you.', es: 'Si lo hubiera sabido, te lo habría dicho.' },
      { cond: 'If they had left earlier,',  result: 'they would have arrived on time.', es: 'Si hubieran salido antes, habrían llegado.' },
    ],
  },
];

const passiveVoice = [
  {
    tense: 'Presente simple',
    structure: 'am / is / are  +  past participle',
    activeEx: 'The teacher corrects the tests.',
    passiveEx: 'The tests are corrected by the teacher.',
    es: 'Los exámenes son corregidos por el maestro.',
  },
  {
    tense: 'Pasado simple',
    structure: 'was / were  +  past participle',
    activeEx: 'They built the bridge in 1990.',
    passiveEx: 'The bridge was built in 1990.',
    es: 'El puente fue construido en 1990.',
  },
  {
    tense: 'Futuro simple',
    structure: 'will be  +  past participle',
    activeEx: 'Someone will deliver the package.',
    passiveEx: 'The package will be delivered.',
    es: 'El paquete será entregado.',
  },
  {
    tense: 'Presente perfecto',
    structure: 'has / have been  +  past participle',
    activeEx: 'They have finished the project.',
    passiveEx: 'The project has been finished.',
    es: 'El proyecto ha sido terminado.',
  },
  {
    tense: 'Presente continuo',
    structure: 'am / is / are  +  being  +  past participle',
    activeEx: 'The mechanic is fixing the car.',
    passiveEx: 'The car is being fixed by the mechanic.',
    es: 'El carro está siendo arreglado.',
  },
  {
    tense: 'Pasado continuo',
    structure: 'was / were  +  being  +  past participle',
    activeEx: 'They were painting the house.',
    passiveEx: 'The house was being painted.',
    es: 'La casa estaba siendo pintada.',
  },
];

const modalVerbs = [
  {
    modal: 'can',
    negative: "can't / cannot",
    pastForm: 'could',
    uses: ['Habilidad presente', 'Posibilidad', 'Permiso informal'],
    examples: [
      { en: 'She can speak three languages.', es: 'Ella puede hablar tres idiomas.' },
      { en: 'It can be very cold here.',       es: 'Puede hacer mucho frío aquí.' },
      { en: 'Can I use your phone?',           es: '¿Puedo usar tu teléfono?' },
    ],
  },
  {
    modal: 'could',
    negative: "couldn't / could not",
    pastForm: '(pasado de can)',
    uses: ['Habilidad pasada', 'Posibilidad débil', 'Petición formal y cortés'],
    examples: [
      { en: 'I could run fast when I was young.', es: 'Podía correr rápido de joven.' },
      { en: 'It could rain later.',                es: 'Podría llover más tarde.' },
      { en: 'Could you help me, please?',          es: '¿Podría ayudarme, por favor?' },
    ],
  },
  {
    modal: 'should',
    negative: "shouldn't / should not",
    pastForm: 'should have + pp',
    uses: ['Consejo / recomendación', 'Obligación moral', 'Expectativa o probabilidad'],
    examples: [
      { en: 'You should exercise every day.', es: 'Deberías ejercitarte cada día.' },
      { en: 'She should apologize.',           es: 'Ella debería disculparse.' },
      { en: 'The report should be ready.',     es: 'El informe debería estar listo.' },
    ],
  },
  {
    modal: 'must',
    negative: "mustn't / must not",
    pastForm: 'had to',
    uses: ['Obligación fuerte', 'Deducción lógica (certeza)', 'Prohibición (en negativo)'],
    examples: [
      { en: 'You must wear a seatbelt.',     es: 'Debes usar el cinturón de seguridad.' },
      { en: 'She must be tired.',            es: 'Ella debe estar cansada.' },
      { en: "You mustn't smoke here.",       es: 'No debes fumar aquí.' },
    ],
  },
  {
    modal: 'may',
    negative: 'may not',
    pastForm: 'might have + pp',
    uses: ['Permiso formal', 'Posibilidad (50%)'],
    examples: [
      { en: 'May I come in?',        es: '¿Puedo entrar? (permiso formal)' },
      { en: 'It may snow tonight.',  es: 'Podría nevar esta noche.' },
      { en: 'She may not attend.',   es: 'Puede que ella no asista.' },
    ],
  },
  {
    modal: 'might',
    negative: 'might not',
    pastForm: 'might have + pp',
    uses: ['Posibilidad débil (30–40%)', 'Sugerencia tentativa'],
    examples: [
      { en: 'It might rain later.',          es: 'Quizás llueva más tarde.' },
      { en: 'We might go to the beach.',     es: 'Puede que vayamos a la playa.' },
      { en: 'You might want to call first.', es: 'Quizás quieras llamar primero.' },
    ],
  },
  {
    modal: 'would',
    negative: "wouldn't / would not",
    pastForm: 'would have + pp',
    uses: ['Condicional (2nd & 3rd)', 'Petición formal y educada', 'Hábitos pasados'],
    examples: [
      { en: 'I would travel more if I had time.', es: 'Viajaría más si tuviera tiempo.' },
      { en: 'Would you like some coffee?',         es: '¿Le gustaría un café?' },
      { en: 'We would go camping every summer.',   es: 'Íbamos de camping cada verano.' },
    ],
  },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

const IrregularVerbsSection = () => {
  const [search, setSearch] = useState('');
  const filtered = irregularVerbs.filter(v =>
    v.base.startsWith(search.toLowerCase()) ||
    v.past.includes(search.toLowerCase()) ||
    v.participle.includes(search.toLowerCase()) ||
    v.meaning.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="teoria-section">
      <div className="section-intro">
        <p>Los verbos irregulares <strong>no siguen la regla de agregar -ed</strong>. Deben memorizarse.</p>
        <div className="formula-box">
          <span>Base</span><span className="arrow">→</span>
          <span className="col-label cyan">Pasado simple</span><span className="arrow">→</span>
          <span className="col-label gold">Participio pasado</span>
        </div>
      </div>
      <div className="search-bar">
        <FontAwesomeIcon icon={faSearch} />
        <input type="text" placeholder="Buscar verbo o significado..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div className="verb-table-wrapper">
        <table className="verb-table">
          <thead><tr><th>Forma base</th><th>Pasado simple</th><th>Participio pasado</th><th>Significado</th></tr></thead>
          <tbody>
            {filtered.map((v, i) => (
              <tr key={i}>
                <td className="base-form">{v.base}</td>
                <td className="past-form">{v.past}</td>
                <td className="participle-form">{v.participle}</td>
                <td className="meaning-form">{v.meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="no-results">No se encontraron verbos.</p>}
      </div>
    </div>
  );
};

const RegularVerbsSection = () => {
  const [search, setSearch] = useState('');
  const filtered = regularVerbs.filter(v =>
    v.base.startsWith(search.toLowerCase()) || v.meaning.includes(search.toLowerCase())
  );
  return (
    <div className="teoria-section">
      <div className="section-intro">
        <p>Los verbos regulares forman pasado y participio agregando <strong>-ed</strong> o <strong>-d</strong>.</p>
        <div className="formula-box">
          <span>Verbo base</span><span>+</span>
          <span className="col-label cyan">-ed / -d</span><span>=</span>
          <span className="col-label gold">Pasado = Participio</span>
        </div>
      </div>
      <div className="search-bar">
        <FontAwesomeIcon icon={faSearch} />
        <input type="text" placeholder="Buscar verbo o significado..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div className="verb-table-wrapper">
        <table className="verb-table">
          <thead><tr><th>Forma base</th><th>Pasado / Participio</th><th>Significado</th></tr></thead>
          <tbody>
            {filtered.map((v, i) => (
              <tr key={i}>
                <td className="base-form">{v.base}</td>
                <td className="past-form">{v.past}</td>
                <td className="meaning-form">{v.meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="no-results">No se encontraron verbos.</p>}
      </div>
    </div>
  );
};

const AdverbsSection = () => (
  <div className="teoria-section">
    <div className="section-intro">
      <p>Indican <strong>con qué frecuencia</strong> ocurre una acción. Van <strong>antes del verbo principal</strong> y después del verbo "to be".</p>
      <div className="formula-box">
        <span>Sujeto</span><span className="col-label cyan">+ adverbio +</span><span>verbo principal</span>
      </div>
    </div>
    <div className="adverb-list">
      {adverbs.map((a, i) => (
        <div key={i} className="adverb-card">
          <div className="adverb-header">
            <span className="adverb-word">{a.word}</span>
            <span className="adverb-translation">{a.translation}</span>
            <span className="adverb-percent">{a.percent}%</span>
          </div>
          <div className="adverb-bar-bg">
            <div className="adverb-bar" style={{ width: `${a.percent === 0 ? 2 : a.percent}%` }} />
          </div>
          <p className="adverb-example">{a.example}</p>
        </div>
      ))}
    </div>
  </div>
);

const PlaceSection = () => (
  <div className="teoria-section">
    <div className="section-intro">
      <p>Responde <strong>Where? (¿Dónde?)</strong>. Generalmente va al final de la oración.</p>
      <div className="formula-box"><span>Sujeto + verbo</span><span className="col-label cyan">+ lugar</span></div>
    </div>
    <div className="phrase-grid">
      {placePhrases.map((p, i) => (
        <div key={i} className="phrase-card">
          <span className="phrase-english">{p.phrase}</span>
          <span className="phrase-spanish">{p.spanish}</span>
          <p className="phrase-example">{p.example}</p>
        </div>
      ))}
    </div>
  </div>
);

const TimeSection = () => (
  <div className="teoria-section">
    <div className="section-intro">
      <p>Responde <strong>When? (¿Cuándo?)</strong>. Puede ir al inicio o al final de la oración.</p>
      <div className="formula-box">
        <span className="col-label cyan">Tiempo</span><span>+ sujeto + verbo  |  Sujeto + verbo +</span>
        <span className="col-label gold">tiempo</span>
      </div>
    </div>
    <div className="phrase-grid">
      {timePhrases.map((p, i) => (
        <div key={i} className="phrase-card">
          <span className="phrase-english">{p.phrase}</span>
          <span className="phrase-spanish">{p.spanish}</span>
          <p className="phrase-example">{p.example}</p>
        </div>
      ))}
    </div>
  </div>
);

const WQuestionsSection = () => {
  const [open, setOpen] = useState(null);
  return (
    <div className="teoria-section">
      <div className="section-intro">
        <p>Preguntas que inician con palabras interrogativas. Estructura general:</p>
        <div className="formula-box">
          <span className="col-label gold">W-word</span><span>+ auxiliar + sujeto + verbo base?</span>
        </div>
      </div>
      <div className="wq-list">
        {wQuestions.map((q, i) => (
          <div key={i} className={`wq-card ${open === i ? 'expanded' : ''}`}>
            <button className="wq-header" onClick={() => setOpen(open === i ? null : i)}>
              <div className="wq-title">
                <span className="wq-word">{q.word}</span>
                <span className="wq-spanish">{q.spanish}</span>
              </div>
              <div className="wq-right">
                <span className="wq-use">{q.use}</span>
                <FontAwesomeIcon icon={open === i ? faChevronUp : faChevronDown} />
              </div>
            </button>
            {open === i && (
              <div className="wq-body">
                <div className="wq-structure">
                  <span className="structure-label">Estructura:</span>
                  <code>{q.structure}</code>
                </div>
                <div className="wq-examples">
                  {q.examples.map((ex, j) => (
                    <div key={j} className="wq-example-row">
                      <span className="wq-q">{ex.q}</span>
                      <span className="wq-a">{ex.a}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const ConnectorsSection = () => {
  const [open, setOpen] = useState(null);
  return (
    <div className="teoria-section">
      <div className="section-intro">
        <p>Los <strong>conectores</strong> (linking words) unen ideas y dan cohesión al discurso. Son esenciales en escritura académica y profesional.</p>
        <div className="formula-box">
          <span>Oración 1</span><span className="col-label gold">+ conector +</span><span>Oración 2</span>
        </div>
      </div>
      <div className="wq-list">
        {connectors.map((cat, i) => (
          <div key={i} className={`wq-card ${open === i ? 'expanded' : ''}`}>
            <button className="wq-header" onClick={() => setOpen(open === i ? null : i)}>
              <div className="wq-title">
                <span className="wq-word connector-cat">{cat.category}</span>
                <span className="wq-spanish">{cat.items.length} conectores</span>
              </div>
              <FontAwesomeIcon icon={open === i ? faChevronUp : faChevronDown} />
            </button>
            {open === i && (
              <div className="wq-body">
                <div className="connector-grid">
                  {cat.items.map((item, j) => (
                    <div key={j} className="connector-item">
                      <span className="connector-word">{item.word}</span>
                      <span className="connector-meaning">{item.meaning}</span>
                      <p className="connector-example">{item.example}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const PrepositionsSection = () => {
  const [view, setView] = useState('time');
  const data = prepositionRules[view];
  return (
    <div className="teoria-section">
      <div className="section-intro">
        <p>Las preposiciones <strong>in / on / at</strong> son las más comunes y difíciles. Su uso depende del contexto de tiempo o lugar.</p>
      </div>
      <div className="prep-toggle">
        <button className={`prep-tab ${view === 'time' ? 'active' : ''}`} onClick={() => setView('time')}>
          <FontAwesomeIcon icon={faClock} /> Tiempo
        </button>
        <button className={`prep-tab ${view === 'place' ? 'active' : ''}`} onClick={() => setView('place')}>
          <FontAwesomeIcon icon={faMapMarkerAlt} /> Lugar
        </button>
      </div>
      <div className="prep-cards">
        {data.map((p, i) => (
          <div key={i} className="prep-card">
            <div className="prep-header">
              <span className="prep-badge">{p.prep}</span>
              <span className="prep-rule">{p.rule}</span>
            </div>
            <div className="prep-cases">
              {p.cases.map((c, j) => (
                <div key={j} className="prep-case">
                  <span className="prep-case-label">{c.label}</span>
                  <div className="prep-examples">
                    {c.examples.map((ex, k) => (
                      <span key={k} className="prep-example-chip">{ex}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ConditionalsSection = () => {
  const [open, setOpen] = useState(null);
  return (
    <div className="teoria-section">
      <div className="section-intro">
        <p>Las <strong>oraciones condicionales</strong> expresan situaciones hipotéticas y sus consecuencias. Hay 4 tipos principales.</p>
      </div>
      <div className="cond-list">
        {conditionals.map((c, i) => (
          <div key={i} className={`cond-card cond-${i} ${open === i ? 'expanded' : ''}`}>
            <button className="cond-header" onClick={() => setOpen(open === i ? null : i)}>
              <div className="cond-title">
                <span className="cond-number">{c.number}</span>
                <div>
                  <div className="cond-type">{c.type}</div>
                  <div className="cond-use">{c.use}</div>
                </div>
              </div>
              <FontAwesomeIcon icon={open === i ? faChevronUp : faChevronDown} />
            </button>
            {open === i && (
              <div className="cond-body">
                <div className="wq-structure">
                  <span className="structure-label">Estructura:</span>
                  <code>{c.structure}</code>
                </div>
                {c.note && <p className="cond-note">{c.note}</p>}
                <div className="cond-examples">
                  {c.examples.map((ex, j) => (
                    <div key={j} className="cond-example-row">
                      <div className="cond-sentence">
                        <span className="cond-if">{ex.cond}</span>
                        <span className="cond-res">{ex.result}</span>
                      </div>
                      <span className="cond-es">{ex.es}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const PassiveVoiceSection = () => (
  <div className="teoria-section">
    <div className="section-intro">
      <p>La <strong>voz pasiva</strong> pone el énfasis en la acción o el objeto, no en quien la realiza. Se forma con <strong>to be + participio pasado</strong>.</p>
      <div className="formula-box">
        <span className="col-label gold">Objeto</span>
        <span>+ to be +</span>
        <span className="col-label cyan">past participle</span>
        <span>+ (by + agente)</span>
      </div>
    </div>
    <div className="passive-list">
      {passiveVoice.map((p, i) => (
        <div key={i} className="passive-card">
          <div className="passive-tense">{p.tense}</div>
          <div className="passive-structure">
            <code>{p.structure}</code>
          </div>
          <div className="passive-examples">
            <div className="passive-row">
              <span className="passive-label active-label">Activa</span>
              <span className="passive-text">{p.activeEx}</span>
            </div>
            <div className="passive-row">
              <span className="passive-label passive-label-tag">Pasiva</span>
              <span className="passive-text gold">{p.passiveEx}</span>
            </div>
            <div className="passive-row">
              <span className="passive-label es-label">ES</span>
              <span className="passive-text secondary">{p.es}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ModalVerbsSection = () => {
  const [open, setOpen] = useState(null);
  return (
    <div className="teoria-section">
      <div className="section-intro">
        <p>Los <strong>verbos modales</strong> modifican al verbo principal para expresar posibilidad, obligación, permiso o habilidad. <strong>No llevan -s en tercera persona</strong> y van seguidos de verbo en forma base.</p>
        <div className="formula-box">
          <span>Sujeto</span>
          <span className="col-label gold">+ modal +</span>
          <span className="col-label cyan">verbo base</span>
          <span>(sin to)</span>
        </div>
      </div>
      <div className="wq-list">
        {modalVerbs.map((m, i) => (
          <div key={i} className={`wq-card ${open === i ? 'expanded' : ''}`}>
            <button className="wq-header" onClick={() => setOpen(open === i ? null : i)}>
              <div className="wq-title">
                <span className="wq-word">{m.modal}</span>
                <span className="modal-neg">{m.negative}</span>
              </div>
              <div className="wq-right">
                <div className="modal-uses-preview">
                  {m.uses.slice(0, 2).map((u, j) => <span key={j} className="modal-use-chip">{u}</span>)}
                </div>
                <FontAwesomeIcon icon={open === i ? faChevronUp : faChevronDown} />
              </div>
            </button>
            {open === i && (
              <div className="wq-body">
                <div className="modal-meta">
                  <span className="modal-past-label">Pasado / equivalente:</span>
                  <code className="modal-past-code">{m.pastForm}</code>
                </div>
                <div className="modal-uses-full">
                  {m.uses.map((u, j) => <span key={j} className="modal-use-full">{u}</span>)}
                </div>
                <div className="wq-examples">
                  {m.examples.map((ex, j) => (
                    <div key={j} className="wq-example-row">
                      <span className="wq-q">{ex.en}</span>
                      <span className="wq-a">{ex.es}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────

// Orden pedagógico: cada tema se agrupa en el nivel donde se introduce por
// primera vez en la Ruta de Aprendizaje (ver `modules` en pruebaData.js),
// para que Teoría se recorra en el mismo orden cronológico que el curso.
const tabs = [
  { id: 'regular',     label: 'Verbos regulares',         icon: faListUl,      level: 'beginner' },
  { id: 'irregular',   label: 'Verbos irregulares',       icon: faListUl,      level: 'beginner' },
  { id: 'adverbs',     label: 'Adverbios de frecuencia',  icon: faClock,       level: 'beginner' },
  { id: 'place',       label: 'Complemento de lugar',     icon: faMapMarkerAlt, level: 'beginner' },
  { id: 'time',        label: 'Complemento de tiempo',    icon: faClock,       level: 'beginner' },
  { id: 'wquestions',  label: 'W Questions',              icon: faQuestion,    level: 'beginner' },
  { id: 'prepositions',label: 'Preposiciones',            icon: faSitemap,     level: 'intermediate' },
  { id: 'modals',      label: 'Verbos modales',           icon: faCogs,        level: 'intermediate' },
  { id: 'connectors',  label: 'Conectores',               icon: faLink,        level: 'intermediate' },
  { id: 'conditionals',label: 'Condicionales',            icon: faCodeBranch,  level: 'expert' },
  { id: 'passive',     label: 'Voz pasiva',               icon: faExchangeAlt, level: 'expert' },
];

const Teoria = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.tab || 'regular');

  useEffect(() => {
    if (location.state?.tab) setActiveTab(location.state.tab);
  }, [location.state]);

  const renderContent = () => {
    switch (activeTab) {
      case 'irregular':    return <IrregularVerbsSection />;
      case 'regular':      return <RegularVerbsSection />;
      case 'adverbs':      return <AdverbsSection />;
      case 'place':        return <PlaceSection />;
      case 'time':         return <TimeSection />;
      case 'wquestions':   return <WQuestionsSection />;
      case 'connectors':   return <ConnectorsSection />;
      case 'prepositions': return <PrepositionsSection />;
      case 'conditionals': return <ConditionalsSection />;
      case 'passive':      return <PassiveVoiceSection />;
      case 'modals':       return <ModalVerbsSection />;
      default:             return null;
    }
  };

  const activeTabData = tabs.find(t => t.id === activeTab);

  return (
    <div className="teoria-container">
      <div className="teoria-header">
        <h1><FontAwesomeIcon icon={faGraduationCap} /> Teoría Gramatical</h1>
        <p>Consulta las reglas y listas esenciales del inglés</p>
      </div>

      <div className="teoria-tabs-groups">
        {Object.entries(levelMeta).map(([levelKey, meta]) => (
          <div key={levelKey} className="teoria-tab-group" style={{ '--group-color': meta.color }}>
            <span className="teoria-tab-group-label">{meta.emoji} {meta.label}</span>
            <div className="teoria-tabs">
              {tabs.filter(t => t.level === levelKey).map(tab => (
                <button
                  key={tab.id}
                  className={`teoria-tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <FontAwesomeIcon icon={tab.icon} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="teoria-content">
        <div className="content-title">
          <FontAwesomeIcon icon={activeTabData.icon} />
          <h2>{activeTabData.label}</h2>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default Teoria;

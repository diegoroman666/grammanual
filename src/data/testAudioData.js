// src/data/testAudioData.js
// ─────────────────────────────────────────────────────────────────────────────
// TEST AUDIO — Comprensión auditiva evaluada
//
// 3 pruebas · 10 ejercicios de audio cada una · 5 preguntas por audio (150 total)
//
// Reglas de examen (implementadas en el componente TestAudio.jsx):
//   • El audio se puede escuchar como MÁXIMO 2 veces.
//   • Cada ejercicio usa una VOZ distinta (voiceKind + pitch/rate rotan).
//   • La transcripción en inglés y su traducción NO se muestran hasta que el
//     alumno responde las 5 preguntas del ejercicio.
//   • Entre las alternativas hay palabras MAL ESCRITAS a propósito para que el
//     alumno aprenda a identificar la forma correcta.
//   • Cada explicación es teórica e involucra el concepto gramatical evaluado
//     (adverbios de frecuencia, complementos de lugar, hora, etc.).
//
// Estructura de cada pregunta:
//   { q, options:[4], answer, concept, explanation }
//   - answer: string EXACTO (debe coincidir con una de las options)
//   - concept: etiqueta del tema gramatical (se muestra como "píldora")
// ─────────────────────────────────────────────────────────────────────────────

// voiceKind: pista para elegir la voz (variante de inglés). El componente busca
// una voz real del dispositivo que coincida y, si no la encuentra, rota entre las
// disponibles. pitch/rate añaden variedad aunque haya una sola voz instalada.
const V = {
  usF:  { voiceKind: 'en-US', gender: 'female', pitch: 1.15, rate: 0.9 },
  usM:  { voiceKind: 'en-US', gender: 'male',   pitch: 0.85, rate: 0.9 },
  gbF:  { voiceKind: 'en-GB', gender: 'female', pitch: 1.2,  rate: 0.88 },
  gbM:  { voiceKind: 'en-GB', gender: 'male',   pitch: 0.8,  rate: 0.86 },
  auF:  { voiceKind: 'en-AU', gender: 'female', pitch: 1.05, rate: 0.92 },
  auM:  { voiceKind: 'en-AU', gender: 'male',   pitch: 0.9,  rate: 0.9  },
};

export const tests = [
  // ═══════════════════════════════════════════════════════════════════════════
  // PRUEBA 1 · BÁSICO — Rutinas, profesiones, horas y frecuencia
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'test-1',
    order: 1,
    level: 'Básico',
    emoji: '🌱',
    title: 'Prueba 1 · Rutinas y profesiones',
    description: 'Profesiones, horarios, tiempo libre y adverbios de frecuencia.',
    exercises: [
      {
        id: 't1-e1',
        speaker: 'Laura',
        ...V.usF,
        audioText:
          "Hi, my name is Laura. I am a teacher at a primary school. I usually wake up at six o'clock in the morning. In my free time, I like to paint and read novels. I always have lunch in the school garden with the other teachers. On weekends, I never work; I visit my grandmother.",
        translation:
          "Hola, mi nombre es Laura. Soy profesora en una escuela primaria. Normalmente me levanto a las seis de la mañana. En mi tiempo libre, me gusta pintar y leer novelas. Siempre almuerzo en el jardín de la escuela con los otros profesores. Los fines de semana nunca trabajo; visito a mi abuela.",
        questions: [
          {
            q: '¿Qué profesión tiene Laura?',
            options: ['Teacher', 'Teecher', 'Teatcher', 'Techer'],
            answer: 'Teacher',
            concept: 'Vocabulario · profesiones',
            explanation:
              'En el audio dice "I am a teacher". La forma correcta se escribe teacher; "teecher", "teatcher" y "techer" son errores ortográficos comunes que debes descartar.',
          },
          {
            q: '¿Qué le gusta hacer en su tiempo libre?',
            options: ['Paint and read', 'Paynt and reed', 'Pint and red', 'Peint and raed'],
            answer: 'Paint and read',
            concept: 'Verbos de gusto (like to + verbo)',
            explanation:
              'Dice "I like to paint and read novels". Tras "like to" va el verbo en infinitivo. Las otras opciones están mal escritas (paynt/pint, reed/red).',
          },
          {
            q: '¿A qué hora se levanta Laura?',
            options: ["At six o'clock", "At seven o'clock", "At nine o'clock", "At five o'clock"],
            answer: "At six o'clock",
            concept: 'La hora (at + hora)',
            explanation:
              'Dice "I wake up at six o\'clock". Para una hora puntual usamos la preposición "at": at six o\'clock = a las seis.',
          },
          {
            q: '¿Con qué frecuencia almuerza en el jardín de la escuela?',
            options: ['Always', 'Usually', 'Never', 'Sometimes'],
            answer: 'Always',
            concept: 'Adverbios de frecuencia',
            explanation:
              'Dice "I always have lunch in the school garden". "Always" (siempre) es el adverbio de frecuencia de mayor intensidad (100%). Va delante del verbo principal.',
          },
          {
            q: '¿Dónde almuerza normalmente?',
            options: ['In the school garden', 'At the restaurant', 'In her car', 'At the library'],
            answer: 'In the school garden',
            concept: 'Complemento de lugar (in)',
            explanation:
              'Dice "in the school garden". El complemento de lugar responde a "¿dónde?"; con espacios delimitados usamos "in" (in the garden).',
          },
        ],
      },
      {
        id: 't1-e2',
        speaker: 'Mark',
        ...V.usM,
        audioText:
          "Hello, I'm Mark and I work as a doctor in a big hospital. I often start my shift at eight in the morning. I rarely take a break before noon because there are many patients. After work, I usually go to the gym near my house. I sometimes play the guitar to relax at night.",
        translation:
          "Hola, soy Mark y trabajo como médico en un hospital grande. A menudo empiezo mi turno a las ocho de la mañana. Rara vez tomo un descanso antes del mediodía porque hay muchos pacientes. Después del trabajo, normalmente voy al gimnasio cerca de mi casa. A veces toco la guitarra para relajarme por la noche.",
        questions: [
          {
            q: '¿Cuál es la profesión de Mark?',
            options: ['Doctor', 'Docter', 'Doktor', 'Dokter'],
            answer: 'Doctor',
            concept: 'Vocabulario · profesiones',
            explanation:
              'Dice "I work as a doctor". La forma correcta es doctor; "docter", "doktor" y "docter" están mal escritas.',
          },
          {
            q: '¿A qué hora empieza su turno normalmente?',
            options: ['At eight', 'At nine', 'At noon', 'At ten'],
            answer: 'At eight',
            concept: 'La hora (at + hora)',
            explanation:
              'Dice "I often start my shift at eight in the morning". Usamos "at" para la hora exacta.',
          },
          {
            q: '¿Con qué frecuencia toma un descanso antes del mediodía?',
            options: ['Rarely', 'Always', 'Often', 'Usually'],
            answer: 'Rarely',
            concept: 'Adverbios de frecuencia',
            explanation:
              'Dice "I rarely take a break before noon". "Rarely" (rara vez) indica una frecuencia muy baja, cercana al 10%.',
          },
          {
            q: '¿A dónde va después del trabajo?',
            options: ['To the gym', 'To the gymn', 'To the jim', 'To the gymm'],
            answer: 'To the gym',
            concept: 'Complemento de lugar + dirección (to)',
            explanation:
              'Dice "I usually go to the gym". Con verbos de movimiento (go) usamos "to" para indicar destino. La grafía correcta es gym; gymn/jim/gymm son errores.',
          },
          {
            q: '¿Qué hace a veces para relajarse en la noche?',
            options: ['Play the guitar', 'Play the gitar', 'Play the guittar', 'Play the guitarr'],
            answer: 'Play the guitar',
            concept: 'Adverbio "sometimes" + actividad',
            explanation:
              'Dice "I sometimes play the guitar". "Sometimes" (a veces) es frecuencia media. La palabra correcta es guitar; las demás están mal escritas.',
          },
        ],
      },
      {
        id: 't1-e3',
        speaker: 'Sophie',
        ...V.gbF,
        audioText:
          "My name is Sophie and I am a nurse. I work at night, so I usually go to bed at ten in the morning. I always drink a cup of tea before I sleep. In my free time, I love to swim at the local pool. I visit my parents every Sunday afternoon.",
        translation:
          "Mi nombre es Sophie y soy enfermera. Trabajo de noche, así que normalmente me acuesto a las diez de la mañana. Siempre bebo una taza de té antes de dormir. En mi tiempo libre, me encanta nadar en la piscina del barrio. Visito a mis padres todos los domingos por la tarde.",
        questions: [
          {
            q: '¿Cuál es la profesión de Sophie?',
            options: ['Nurse', 'Nurce', 'Nerse', 'Nursse'],
            answer: 'Nurse',
            concept: 'Vocabulario · profesiones',
            explanation: 'Dice "I am a nurse". La forma correcta es nurse; nurce/nerse/nursse son errores.',
          },
          {
            q: '¿A qué hora se acuesta normalmente?',
            options: ['At ten in the morning', 'At ten at night', 'At eight in the morning', 'At noon'],
            answer: 'At ten in the morning',
            concept: 'La hora + parte del día',
            explanation:
              'Dice "I usually go to bed at ten in the morning". Como trabaja de noche, se acuesta de mañana. "in the morning" precisa la parte del día.',
          },
          {
            q: '¿Con qué frecuencia bebe té antes de dormir?',
            options: ['Always', 'Never', 'Rarely', 'Sometimes'],
            answer: 'Always',
            concept: 'Adverbios de frecuencia',
            explanation: 'Dice "I always drink a cup of tea". "Always" = siempre (100%).',
          },
          {
            q: '¿Qué le encanta hacer en su tiempo libre?',
            options: ['Swim', 'Swimm', 'Swin', 'Sweem'],
            answer: 'Swim',
            concept: 'Verbo de gusto (love to + verbo)',
            explanation:
              'Dice "I love to swim". Tras "love to" va el verbo en infinitivo. La grafía correcta es swim.',
          },
          {
            q: '¿Dónde nada Sophie?',
            options: ['At the local pool', 'At the beach', 'In the river', 'At the gym'],
            answer: 'At the local pool',
            concept: 'Complemento de lugar (at)',
            explanation:
              'Dice "swim at the local pool". Usamos "at" para un punto o lugar concreto de referencia (at the pool).',
          },
        ],
      },
      {
        id: 't1-e4',
        speaker: 'Diego',
        ...V.usM,
        audioText:
          "Hi there, I'm Diego. I am a chef in an Italian restaurant. I never arrive late; I usually get to the kitchen at four in the afternoon. My favourite dish to cook is fresh pasta. On my day off, I often ride my bicycle in the park. I sometimes cook for my friends at home.",
        translation:
          "Hola, soy Diego. Soy cocinero en un restaurante italiano. Nunca llego tarde; normalmente llego a la cocina a las cuatro de la tarde. Mi plato favorito para cocinar es la pasta fresca. En mi día libre, a menudo ando en bicicleta en el parque. A veces cocino para mis amigos en casa.",
        questions: [
          {
            q: '¿Cuál es la profesión de Diego?',
            options: ['Chef', 'Chevf', 'Cheff', 'Shef'],
            answer: 'Chef',
            concept: 'Vocabulario · profesiones',
            explanation: 'Dice "I am a chef". La forma correcta es chef; cheff/shef/chevf son errores.',
          },
          {
            q: '¿Con qué frecuencia llega tarde?',
            options: ['Never', 'Always', 'Usually', 'Often'],
            answer: 'Never',
            concept: 'Adverbios de frecuencia',
            explanation:
              'Dice "I never arrive late". "Never" (nunca) es la frecuencia mínima (0%). Ojo: en inglés no se duplica la negación.',
          },
          {
            q: '¿A qué hora llega a la cocina?',
            options: ['At four in the afternoon', 'At four in the morning', 'At noon', 'At six in the evening'],
            answer: 'At four in the afternoon',
            concept: 'La hora + parte del día',
            explanation: 'Dice "at four in the afternoon". "in the afternoon" = por la tarde.',
          },
          {
            q: '¿Dónde anda en bicicleta?',
            options: ['In the park', 'In the parc', 'At the park', 'On the park'],
            answer: 'In the park',
            concept: 'Complemento de lugar (in the park)',
            explanation:
              'Dice "ride my bicycle in the park". Con "park" la preposición fija es "in the park". La grafía correcta es park (no "parc").',
          },
          {
            q: '¿Dónde cocina a veces para sus amigos?',
            options: ['At home', 'At house', 'In home', 'On home'],
            answer: 'At home',
            concept: 'Complemento de lugar (expresión fija: at home)',
            explanation:
              'Dice "cook for my friends at home". "At home" es una expresión fija (sin artículo). No se dice "in home" ni "at house".',
          },
        ],
      },
      {
        id: 't1-e5',
        speaker: 'Emma',
        ...V.auF,
        audioText:
          "Hello, my name is Emma and I am a student. I study biology at university. I usually wake up at seven and I always take the bus to class. I rarely eat breakfast because I don't have time. In the evening, I often study at the library with my classmates.",
        translation:
          "Hola, me llamo Emma y soy estudiante. Estudio biología en la universidad. Normalmente me levanto a las siete y siempre tomo el autobús para ir a clase. Rara vez desayuno porque no tengo tiempo. Por la noche, a menudo estudio en la biblioteca con mis compañeros.",
        questions: [
          {
            q: '¿Qué estudia Emma?',
            options: ['Biology', 'Biologi', 'Byology', 'Biollogy'],
            answer: 'Biology',
            concept: 'Vocabulario · materias',
            explanation: 'Dice "I study biology". La grafía correcta es biology.',
          },
          {
            q: '¿A qué hora se levanta?',
            options: ['At seven', 'At seaven', 'At eleven', 'At nine'],
            answer: 'At seven',
            concept: 'La hora (at + hora)',
            explanation: 'Dice "I wake up at seven". "at seven" = a las siete. "seaven" está mal escrito.',
          },
          {
            q: '¿Con qué frecuencia toma el autobús a clase?',
            options: ['Always', 'Never', 'Rarely', 'Sometimes'],
            answer: 'Always',
            concept: 'Adverbios de frecuencia',
            explanation: 'Dice "I always take the bus". "Always" = siempre.',
          },
          {
            q: '¿Con qué frecuencia desayuna?',
            options: ['Rarely', 'Always', 'Usually', 'Often'],
            answer: 'Rarely',
            concept: 'Adverbios de frecuencia',
            explanation:
              'Dice "I rarely eat breakfast". "Rarely" (rara vez) indica frecuencia muy baja. Se refuerza con la razón: "I don\'t have time".',
          },
          {
            q: '¿Dónde estudia por la noche?',
            options: ['At the library', 'At the librery', 'In the libary', 'At the librady'],
            answer: 'At the library',
            concept: 'Complemento de lugar (at)',
            explanation:
              'Dice "study at the library". Usamos "at" para el lugar. La grafía correcta es library.',
          },
        ],
      },
      {
        id: 't1-e6',
        speaker: 'James',
        ...V.gbM,
        audioText:
          "Good morning, I'm James, a firefighter. My job is dangerous but I love it. I always wear my uniform and helmet. I usually work three days a week. On my free days, I often go fishing at the lake with my brother. I never smoke because it is bad for my health.",
        translation:
          "Buenos días, soy James, bombero. Mi trabajo es peligroso pero me encanta. Siempre uso mi uniforme y casco. Normalmente trabajo tres días a la semana. En mis días libres, a menudo voy a pescar al lago con mi hermano. Nunca fumo porque es malo para mi salud.",
        questions: [
          {
            q: '¿Cuál es la profesión de James?',
            options: ['Firefighter', 'Firefigther', 'Firfighter', 'Firefigter'],
            answer: 'Firefighter',
            concept: 'Vocabulario · profesiones',
            explanation: 'Dice "a firefighter". La grafía correcta es firefighter; el grupo "-ghter" se escribe así.',
          },
          {
            q: '¿Con qué frecuencia usa su uniforme y casco?',
            options: ['Always', 'Never', 'Rarely', 'Sometimes'],
            answer: 'Always',
            concept: 'Adverbios de frecuencia',
            explanation: 'Dice "I always wear my uniform and helmet". "Always" = siempre.',
          },
          {
            q: '¿Cuántos días a la semana trabaja normalmente?',
            options: ['Three days', 'Tree days', 'Free days', 'Thre days'],
            answer: 'Three days',
            concept: 'Números',
            explanation:
              'Dice "I usually work three days a week". La grafía correcta del número es three; "tree" es un árbol y "free" es libre/gratis.',
          },
          {
            q: '¿Dónde va a pescar?',
            options: ['At the lake', 'At the lac', 'In the lake', 'On the lake'],
            answer: 'At the lake',
            concept: 'Complemento de lugar (at)',
            explanation: 'Dice "go fishing at the lake". La grafía correcta es lake y se usa "at".',
          },
          {
            q: '¿Con qué frecuencia fuma?',
            options: ['Never', 'Always', 'Often', 'Usually'],
            answer: 'Never',
            concept: 'Adverbios de frecuencia',
            explanation: 'Dice "I never smoke". "Never" (nunca) = 0% de frecuencia.',
          },
        ],
      },
      {
        id: 't1-e7',
        speaker: 'Olivia',
        ...V.usF,
        audioText:
          "Hi, I'm Olivia and I work as a dentist. My clinic opens at nine in the morning. I usually see about ten patients a day. I always tell my patients to brush their teeth twice a day. In my free time, I like to grow flowers in my garden. I rarely watch television.",
        translation:
          "Hola, soy Olivia y trabajo como dentista. Mi clínica abre a las nueve de la mañana. Normalmente atiendo a unos diez pacientes al día. Siempre les digo a mis pacientes que se cepillen los dientes dos veces al día. En mi tiempo libre, me gusta cultivar flores en mi jardín. Rara vez veo televisión.",
        questions: [
          {
            q: '¿Cuál es la profesión de Olivia?',
            options: ['Dentist', 'Dentiste', 'Dintist', 'Dentst'],
            answer: 'Dentist',
            concept: 'Vocabulario · profesiones',
            explanation: 'Dice "a dentist". La grafía correcta es dentist.',
          },
          {
            q: '¿A qué hora abre su clínica?',
            options: ['At nine in the morning', 'At nine at night', 'At ten in the morning', 'At noon'],
            answer: 'At nine in the morning',
            concept: 'La hora + parte del día',
            explanation: 'Dice "opens at nine in the morning". "at nine in the morning" = a las nueve de la mañana.',
          },
          {
            q: '¿Cuántas veces al día deben cepillarse los dientes, según ella?',
            options: ['Twice a day', 'Twise a day', 'Twice a day.', 'Twaice a day'],
            answer: 'Twice a day',
            concept: 'Frecuencia con "times a day"',
            explanation:
              'Dice "brush their teeth twice a day". "Twice" = dos veces; "once/twice/three times a day" expresan cuántas veces se hace algo. La grafía correcta es twice.',
          },
          {
            q: '¿Qué le gusta hacer en su tiempo libre?',
            options: ['Grow flowers', 'Grow flauers', 'Groe flowers', 'Grow flowes'],
            answer: 'Grow flowers',
            concept: 'like to + verbo',
            explanation: 'Dice "I like to grow flowers". La grafía correcta es flowers.',
          },
          {
            q: '¿Con qué frecuencia ve televisión?',
            options: ['Rarely', 'Always', 'Usually', 'Often'],
            answer: 'Rarely',
            concept: 'Adverbios de frecuencia',
            explanation: 'Dice "I rarely watch television". "Rarely" = rara vez (frecuencia baja).',
          },
        ],
      },
      {
        id: 't1-e8',
        speaker: 'Noah',
        ...V.auM,
        audioText:
          "Hey, my name is Noah. I am a bus driver in the city. I start work very early, at five thirty in the morning. I usually drink two coffees before I leave home. I never use my phone while I drive. On weekends, I often play football with my kids in the backyard.",
        translation:
          "Hola, me llamo Noah. Soy conductor de autobús en la ciudad. Empiezo a trabajar muy temprano, a las cinco y media de la mañana. Normalmente me tomo dos cafés antes de salir de casa. Nunca uso el teléfono mientras conduzco. Los fines de semana, a menudo juego al fútbol con mis hijos en el patio.",
        questions: [
          {
            q: '¿Cuál es la profesión de Noah?',
            options: ['Bus driver', 'Bus driwer', 'Bus dryver', 'Buss driver'],
            answer: 'Bus driver',
            concept: 'Vocabulario · profesiones',
            explanation: 'Dice "I am a bus driver". La grafía correcta es bus driver.',
          },
          {
            q: '¿A qué hora empieza a trabajar?',
            options: ['At five thirty', 'At five fifteen', 'At nine thirty', 'At five forty'],
            answer: 'At five thirty',
            concept: 'La hora (horas y minutos)',
            explanation:
              'Dice "at five thirty in the morning". "five thirty" = las cinco y treinta (5:30).',
          },
          {
            q: '¿Con qué frecuencia usa el teléfono mientras conduce?',
            options: ['Never', 'Always', 'Sometimes', 'Usually'],
            answer: 'Never',
            concept: 'Adverbios de frecuencia',
            explanation: 'Dice "I never use my phone while I drive". "Never" = nunca.',
          },
          {
            q: '¿Cuántos cafés toma normalmente antes de salir?',
            options: ['Two', 'To', 'Too', 'Tow'],
            answer: 'Two',
            concept: 'Números (homófonos)',
            explanation:
              'Dice "two coffees". El número se escribe two; "to", "too" y "tow" suenan parecido pero significan otra cosa.',
          },
          {
            q: '¿Dónde juega al fútbol con sus hijos?',
            options: ['In the backyard', 'In the backyar', 'At the backyard', 'On the backyard'],
            answer: 'In the backyard',
            concept: 'Complemento de lugar (in)',
            explanation:
              'Dice "in the backyard". Con un espacio delimitado usamos "in". La grafía correcta es backyard.',
          },
        ],
      },
      {
        id: 't1-e9',
        speaker: 'Ava',
        ...V.gbF,
        audioText:
          "Hello, I'm Ava, a librarian. I work at the city library. I always keep the books in order. I usually have my lunch at one o'clock. I rarely speak loudly because the library must be quiet. In my free time, I like to write short stories at a café near my house.",
        translation:
          "Hola, soy Ava, bibliotecaria. Trabajo en la biblioteca de la ciudad. Siempre mantengo los libros en orden. Normalmente almuerzo a la una. Rara vez hablo fuerte porque la biblioteca debe estar en silencio. En mi tiempo libre, me gusta escribir cuentos en una cafetería cerca de mi casa.",
        questions: [
          {
            q: '¿Cuál es la profesión de Ava?',
            options: ['Librarian', 'Librerian', 'Libraryan', 'Librarien'],
            answer: 'Librarian',
            concept: 'Vocabulario · profesiones',
            explanation:
              'Dice "a librarian". La grafía correcta es librarian; "librerian", "libraryan" y "librarien" son errores muy parecidos que debes descartar.',
          },
          {
            q: '¿Con qué frecuencia mantiene los libros en orden?',
            options: ['Always', 'Never', 'Rarely', 'Sometimes'],
            answer: 'Always',
            concept: 'Adverbios de frecuencia',
            explanation: 'Dice "I always keep the books in order". "Always" = siempre.',
          },
          {
            q: '¿A qué hora almuerza?',
            options: ["At one o'clock", "At two o'clock", "At noon", "At three o'clock"],
            answer: "At one o'clock",
            concept: 'La hora (at + hora)',
            explanation: 'Dice "at one o\'clock". "at one" = a la una.',
          },
          {
            q: '¿Con qué frecuencia habla fuerte?',
            options: ['Rarely', 'Always', 'Usually', 'Often'],
            answer: 'Rarely',
            concept: 'Adverbios de frecuencia',
            explanation:
              'Dice "I rarely speak loudly". "Rarely" (rara vez) porque la biblioteca debe estar en silencio.',
          },
          {
            q: '¿Dónde escribe cuentos en su tiempo libre?',
            options: ['At a café', 'At a cafee', 'In a caffe', 'On a café'],
            answer: 'At a café',
            concept: 'Complemento de lugar (at)',
            explanation: 'Dice "write short stories at a café". Usamos "at" para un local concreto.',
          },
        ],
      },
      {
        id: 't1-e10',
        speaker: 'Lucas',
        ...V.usM,
        audioText:
          "Hi, I'm Lucas and I am a farmer. I live in the countryside. I always get up before sunrise, at four in the morning. I usually feed the animals first and then I work in the fields. I never take holidays in summer because it is the busy season. I sometimes sell vegetables at the market on Saturdays.",
        translation:
          "Hola, soy Lucas y soy agricultor. Vivo en el campo. Siempre me levanto antes del amanecer, a las cuatro de la mañana. Normalmente primero alimento a los animales y luego trabajo en los campos. Nunca tomo vacaciones en verano porque es la temporada de mayor trabajo. A veces vendo verduras en el mercado los sábados.",
        questions: [
          {
            q: '¿Cuál es la profesión de Lucas?',
            options: ['Farmer', 'Farmmer', 'Farmar', 'Framer'],
            answer: 'Farmer',
            concept: 'Vocabulario · profesiones',
            explanation:
              'Dice "I am a farmer". La grafía correcta es farmer; cuidado con "framer" (que es otra palabra: enmarcador).',
          },
          {
            q: '¿A qué hora se levanta?',
            options: ['At four in the morning', 'At four in the afternoon', 'At noon', 'At six in the morning'],
            answer: 'At four in the morning',
            concept: 'La hora + parte del día',
            explanation: 'Dice "at four in the morning". "in the morning" = de la mañana.',
          },
          {
            q: '¿Con qué frecuencia se levanta antes del amanecer?',
            options: ['Always', 'Never', 'Rarely', 'Sometimes'],
            answer: 'Always',
            concept: 'Adverbios de frecuencia',
            explanation: 'Dice "I always get up before sunrise". "Always" = siempre.',
          },
          {
            q: '¿Con qué frecuencia toma vacaciones en verano?',
            options: ['Never', 'Always', 'Usually', 'Often'],
            answer: 'Never',
            concept: 'Adverbios de frecuencia',
            explanation:
              'Dice "I never take holidays in summer". "Never" = nunca, porque es la temporada de mayor trabajo.',
          },
          {
            q: '¿Dónde vende verduras los sábados?',
            options: ['At the market', 'At the merket', 'In the marcket', 'On the market'],
            answer: 'At the market',
            concept: 'Complemento de lugar (at)',
            explanation: 'Dice "sell vegetables at the market". Usamos "at" y la grafía correcta es market.',
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PRUEBA 2 · INTERMEDIO — Direcciones, lugares, compras y planes
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'test-2',
    order: 2,
    level: 'Intermedio',
    emoji: '🚀',
    title: 'Prueba 2 · Lugares y planes',
    description: 'Direcciones, complementos de lugar, compras, horarios y planes.',
    exercises: [
      {
        id: 't2-e1',
        speaker: 'Guide',
        ...V.gbF,
        audioText:
          "Excuse me, could you tell me where the museum is? Of course. Go straight ahead for two blocks, then turn left at the bank. The museum is on your right, next to the park. It usually opens at ten in the morning and closes at six. Entry is free on Sundays.",
        translation:
          "Disculpe, ¿podría decirme dónde está el museo? Por supuesto. Siga recto dos cuadras, luego gire a la izquierda en el banco. El museo está a su derecha, junto al parque. Normalmente abre a las diez de la mañana y cierra a las seis. La entrada es gratis los domingos.",
        questions: [
          {
            q: '¿Cuántas cuadras hay que seguir recto?',
            options: ['Two blocks', 'To blocks', 'Two bloks', 'Two block'],
            answer: 'Two blocks',
            concept: 'Direcciones · números y plural',
            explanation:
              'Dice "for two blocks". La grafía correcta es two blocks (plural con -s). "to blocks" y "blok" están mal.',
          },
          {
            q: '¿Dónde hay que girar a la izquierda?',
            options: ['At the bank', 'At the banc', 'In the bank', 'On the bank'],
            answer: 'At the bank',
            concept: 'Complemento de lugar (at) en direcciones',
            explanation:
              'Dice "turn left at the bank". En indicaciones usamos "at" para el punto de referencia. La grafía correcta es bank.',
          },
          {
            q: '¿Dónde está el museo respecto al parque?',
            options: ['Next to the park', 'Next too the park', 'Next to the parck', 'Next to the parc'],
            answer: 'Next to the park',
            concept: 'Preposiciones de lugar (next to)',
            explanation:
              '"Next to" significa "junto a / al lado de". Dice "next to the park". "Next too" y "next" están mal escritos.',
          },
          {
            q: '¿A qué hora abre normalmente el museo?',
            options: ['At ten in the morning', 'At six in the morning', 'At ten at night', 'At noon'],
            answer: 'At ten in the morning',
            concept: 'La hora + parte del día',
            explanation: 'Dice "opens at ten in the morning".',
          },
          {
            q: '¿Qué día es gratis la entrada?',
            options: ['On Sundays', 'On Sundais', 'In Sundays', 'At Sundays'],
            answer: 'On Sundays',
            concept: 'Preposición de tiempo (on + día)',
            explanation:
              'Dice "free on Sundays". Con los días de la semana usamos "on" (on Sunday, on Mondays). La grafía correcta es Sundays.',
          },
        ],
      },
      {
        id: 't2-e2',
        speaker: 'Waiter',
        ...V.usM,
        audioText:
          "Welcome to Green Garden. Are you ready to order? Yes, I would like a vegetable soup and a grilled chicken sandwich. And to drink? A glass of orange juice, please. Would you like anything for dessert? Yes, I will have a slice of chocolate cake. Perfect, your table number is fifteen.",
        translation:
          "Bienvenido a Green Garden. ¿Está listo para ordenar? Sí, quisiera una sopa de verduras y un sándwich de pollo a la parrilla. ¿Y para beber? Un vaso de jugo de naranja, por favor. ¿Desea algo de postre? Sí, tomaré una porción de pastel de chocolate. Perfecto, su número de mesa es el quince.",
        questions: [
          {
            q: '¿Qué sopa pidió el cliente?',
            options: ['Vegetable soup', 'Vegetible soup', 'Vegetable sup', 'Vegatable soup'],
            answer: 'Vegetable soup',
            concept: 'Vocabulario · comida',
            explanation: 'Dice "a vegetable soup". La grafía correcta es vegetable soup.',
          },
          {
            q: '¿Qué pidió para beber?',
            options: ['Orange juice', 'Orange juise', 'Orange juce', 'Ornge juice'],
            answer: 'Orange juice',
            concept: 'Vocabulario · bebidas',
            explanation: 'Dice "a glass of orange juice". La grafía correcta es orange juice.',
          },
          {
            q: '¿Qué eligió de postre?',
            options: ['Chocolate cake', 'Chocolat cake', 'ChoColate cake', 'Chocolate keik'],
            answer: 'Chocolate cake',
            concept: 'Vocabulario · postres',
            explanation: 'Dice "a slice of chocolate cake". La grafía correcta es chocolate cake.',
          },
          {
            q: '¿Cuál es el número de la mesa?',
            options: ['Fifteen', 'Fiveteen', 'Fiften', 'Fithteen'],
            answer: 'Fifteen',
            concept: 'Números',
            explanation:
              'Dice "table number is fifteen". La grafía correcta del 15 es fifteen; "fiveteen"/"fiften" son errores.',
          },
          {
            q: '¿Cómo estaba preparado el pollo del sándwich?',
            options: ['Grilled', 'Griled', 'Grilld', 'Grelled'],
            answer: 'Grilled',
            concept: 'Vocabulario · cocción',
            explanation:
              'Dice "grilled chicken sandwich". "Grilled" = a la parrilla; la grafía correcta lleva doble l.',
          },
        ],
      },
      {
        id: 't2-e3',
        speaker: 'Announcer',
        ...V.gbM,
        audioText:
          "Attention shoppers. Today only, all winter clothing is fifty percent off on the second floor. Shoes and accessories are thirty percent off. The offer is available until the store closes at nine tonight. Do not forget to visit the food court on the ground floor. Thank you for shopping with us.",
        translation:
          "Atención, compradores. Solo por hoy, toda la ropa de invierno tiene un cincuenta por ciento de descuento en el segundo piso. Los zapatos y accesorios tienen un treinta por ciento de descuento. La oferta está disponible hasta que la tienda cierre a las nueve esta noche. No olviden visitar la zona de comidas en la planta baja. Gracias por comprar con nosotros.",
        questions: [
          {
            q: '¿Qué descuento tiene la ropa de invierno?',
            options: ['Fifty percent', 'Fivety percent', 'Fifty percen', 'Fifty persent'],
            answer: 'Fifty percent',
            concept: 'Números y porcentajes',
            explanation:
              'Dice "fifty percent off". La grafía correcta es fifty percent (50%). Cuidado con "persent" y "percen".',
          },
          {
            q: '¿En qué piso está la ropa de invierno?',
            options: ['On the second floor', 'On the second flor', 'In the second floor', 'At the second floor'],
            answer: 'On the second floor',
            concept: 'Complemento de lugar (on + floor)',
            explanation:
              'Dice "on the second floor". Con pisos/plantas se usa "on the ... floor". La grafía correcta es floor.',
          },
          {
            q: '¿Qué descuento tienen los zapatos y accesorios?',
            options: ['Thirty percent', 'Thirteen percent', 'Thurty percent', 'Thirty persent'],
            answer: 'Thirty percent',
            concept: 'Números',
            explanation:
              'Dice "thirty percent off" (30%). Ojo con confundir thirty (30) y thirteen (13).',
          },
          {
            q: '¿A qué hora cierra la tienda?',
            options: ['At nine tonight', 'At nine tonigth', 'At five tonight', 'At noon'],
            answer: 'At nine tonight',
            concept: 'La hora',
            explanation: 'Dice "closes at nine tonight". La grafía correcta es tonight.',
          },
          {
            q: '¿Dónde está la zona de comidas?',
            options: ['On the ground floor', 'On the gound floor', 'In the ground floor', 'At the ground floor'],
            answer: 'On the ground floor',
            concept: 'Complemento de lugar (on + floor)',
            explanation:
              'Dice "on the ground floor" = en la planta baja. Con pisos usamos "on the ... floor".',
          },
        ],
      },
      {
        id: 't2-e4',
        speaker: 'Friend',
        ...V.auF,
        audioText:
          "Hey, do you have any plans for the weekend? Not really, why? I was thinking we could go to the new bowling alley downtown on Saturday afternoon. That sounds fun. What time should we meet? Let's meet at two o'clock at the entrance. Great, I will bring my brother too.",
        translation:
          "Oye, ¿tienes planes para el fin de semana? La verdad no, ¿por qué? Estaba pensando que podríamos ir a la nueva bolera del centro el sábado por la tarde. Suena divertido. ¿A qué hora quedamos? Quedemos a las dos en la entrada. Genial, traeré a mi hermano también.",
        questions: [
          {
            q: '¿A dónde quieren ir?',
            options: ['To the bowling alley', 'To the bowling aley', 'To the bowling ally', 'To the boling alley'],
            answer: 'To the bowling alley',
            concept: 'Complemento de lugar + dirección (to)',
            explanation:
              'Dice "go to the new bowling alley". Con "go" usamos "to" para el destino. La grafía correcta es bowling alley.',
          },
          {
            q: '¿Qué día quedan?',
            options: ['On Saturday', 'On Saterday', 'In Saturday', 'At Saturday'],
            answer: 'On Saturday',
            concept: 'Preposición de tiempo (on + día)',
            explanation:
              'Dice "on Saturday afternoon". Con días de la semana usamos "on". La grafía correcta es Saturday.',
          },
          {
            q: '¿En qué parte del día se juntan?',
            options: ['In the afternoon', 'In the afternon', 'On the afternoon', 'At the afternoon'],
            answer: 'In the afternoon',
            concept: 'Preposición de tiempo (in + parte del día)',
            explanation:
              'Dice "Saturday afternoon". Con las partes del día usamos "in the": in the morning/afternoon/evening.',
          },
          {
            q: '¿A qué hora quedan?',
            options: ["At two o'clock", "At twelve o'clock", "At two thirty", "At ten o'clock"],
            answer: "At two o'clock",
            concept: 'La hora (at + hora)',
            explanation: 'Dice "Let\'s meet at two o\'clock". "at two" = a las dos.',
          },
          {
            q: '¿Dónde se encontrarán?',
            options: ['At the entrance', 'At the entrence', 'In the entrance', 'On the entrance'],
            answer: 'At the entrance',
            concept: 'Complemento de lugar (at)',
            explanation:
              'Dice "at the entrance". Usamos "at" para un punto de encuentro. La grafía correcta es entrance.',
          },
        ],
      },
      {
        id: 't2-e5',
        speaker: 'Receptionist',
        ...V.usF,
        audioText:
          "Good afternoon, welcome to Sunrise Hotel. Your room number is three hundred and four, on the third floor. Breakfast is served in the dining room from seven to ten in the morning. The swimming pool is behind the building. Check-out time is at eleven o'clock. Enjoy your stay.",
        translation:
          "Buenas tardes, bienvenido al Hotel Sunrise. El número de su habitación es el trescientos cuatro, en el tercer piso. El desayuno se sirve en el comedor de siete a diez de la mañana. La piscina está detrás del edificio. La hora de salida es a las once. Disfrute su estadía.",
        questions: [
          {
            q: '¿En qué piso está la habitación?',
            options: ['On the third floor', 'On the thirth floor', 'In the third floor', 'On the third flor'],
            answer: 'On the third floor',
            concept: 'Complemento de lugar (on + floor)',
            explanation: 'Dice "on the third floor". Con pisos: "on the ... floor". La grafía correcta es third.',
          },
          {
            q: '¿Dónde se sirve el desayuno?',
            options: ['In the dining room', 'In the dinning room', 'At the dining room', 'On the dining room'],
            answer: 'In the dining room',
            concept: 'Complemento de lugar (in)',
            explanation:
              'Dice "in the dining room". Con habitaciones/espacios cerrados usamos "in". La grafía correcta es dining room (una sola n).',
          },
          {
            q: '¿En qué horario se sirve el desayuno?',
            options: ['From seven to ten', 'From seven to nine', 'From eight to ten', 'From seven to eleven'],
            answer: 'From seven to ten',
            concept: 'Rango de horas (from ... to ...)',
            explanation:
              'Dice "from seven to ten in the morning". "From ... to ..." expresa el rango horario.',
          },
          {
            q: '¿Dónde está la piscina?',
            options: ['Behind the building', 'Behin the building', 'Behind the biulding', 'Behind the buildin'],
            answer: 'Behind the building',
            concept: 'Preposiciones de lugar (behind)',
            explanation:
              '"Behind" = detrás de. Dice "behind the building". Las demás opciones tienen errores ortográficos.',
          },
          {
            q: '¿A qué hora es el check-out?',
            options: ["At eleven o'clock", "At ten o'clock", "At seven o'clock", "At noon"],
            answer: "At eleven o'clock",
            concept: 'La hora',
            explanation: 'Dice "Check-out time is at eleven o\'clock". "at eleven" = a las once.',
          },
        ],
      },
      {
        id: 't2-e6',
        speaker: 'Neighbour',
        ...V.gbM,
        audioText:
          "Hi, I'm your new neighbour. I moved here last week. My flat is on the fourth floor, right above yours. There is a great supermarket around the corner and a pharmacy opposite the station. The bus stop is in front of the bakery. If you need anything, just knock on my door.",
        translation:
          "Hola, soy tu nuevo vecino. Me mudé aquí la semana pasada. Mi departamento está en el cuarto piso, justo encima del tuyo. Hay un supermercado excelente a la vuelta de la esquina y una farmacia frente a la estación. La parada del autobús está enfrente de la panadería. Si necesitas algo, solo toca mi puerta.",
        questions: [
          {
            q: '¿En qué piso está el departamento del vecino?',
            options: ['On the fourth floor', 'On the forth floor', 'On the fourh floor', 'In the fourth floor'],
            answer: 'On the fourth floor',
            concept: 'Complemento de lugar (on + floor)',
            explanation:
              'Dice "on the fourth floor". La grafía correcta del ordinal es fourth; cuidado con "forth" (adelante).',
          },
          {
            q: '¿Dónde está el supermercado?',
            options: ['Around the corner', 'Arround the corner', 'Around the corne', 'Around the korner'],
            answer: 'Around the corner',
            concept: 'Expresión de lugar (around the corner)',
            explanation:
              '"Around the corner" = a la vuelta de la esquina. La grafía correcta es around (una r) y corner.',
          },
          {
            q: '¿Dónde está la farmacia?',
            options: ['Opposite the station', 'Oposite the station', 'Opposite the stacion', 'Opposit the station'],
            answer: 'Opposite the station',
            concept: 'Preposiciones de lugar (opposite)',
            explanation:
              '"Opposite" = frente a / enfrente de. Dice "opposite the station". Lleva doble p y termina en -ite.',
          },
          {
            q: '¿Dónde está la parada del autobús?',
            options: ['In front of the bakery', 'In front off the bakery', 'In fron of the bakery', 'In front of the bakary'],
            answer: 'In front of the bakery',
            concept: 'Preposiciones de lugar (in front of)',
            explanation:
              '"In front of" = enfrente de / delante de. La grafía correcta es front (of, no off) y bakery.',
          },
          {
            q: '¿Cuándo se mudó el vecino?',
            options: ['Last week', 'Last weak', 'Last weeck', 'Lats week'],
            answer: 'Last week',
            concept: 'Expresiones de tiempo pasado',
            explanation:
              'Dice "I moved here last week". "Last week" = la semana pasada. Cuidado con "weak" (débil).',
          },
        ],
      },
      {
        id: 't2-e7',
        speaker: 'Travel agent',
        ...V.usF,
        audioText:
          "Thank you for calling Blue Sky Travel. We have a special offer to Rome for five hundred dollars. The trip includes a hotel near the city centre and breakfast every morning. The flight leaves on Friday at eight in the evening. You will stay for seven nights. Would you like to book it?",
        translation:
          "Gracias por llamar a Blue Sky Travel. Tenemos una oferta especial a Roma por quinientos dólares. El viaje incluye un hotel cerca del centro de la ciudad y desayuno cada mañana. El vuelo sale el viernes a las ocho de la tarde. Se quedará siete noches. ¿Desea reservarlo?",
        questions: [
          {
            q: '¿A qué ciudad es la oferta?',
            options: ['Rome', 'Roma', 'Rrome', 'Rom'],
            answer: 'Rome',
            concept: 'Vocabulario · lugares',
            explanation: 'Dice "a special offer to Rome". En inglés la ciudad se escribe Rome, no "Roma".',
          },
          {
            q: '¿Cuánto cuesta la oferta?',
            options: ['Five hundred dollars', 'Five hundret dollars', 'Five houndred dollars', 'Five hundred dolars'],
            answer: 'Five hundred dollars',
            concept: 'Números grandes',
            explanation:
              'Dice "five hundred dollars" (500). La grafía correcta es hundred y dollars (doble l).',
          },
          {
            q: '¿Dónde está el hotel?',
            options: ['Near the city centre', 'Near the city center', 'Near the city sentre', 'Near the city centr'],
            answer: 'Near the city centre',
            concept: 'Preposiciones de lugar (near)',
            explanation:
              '"Near" = cerca de. En inglés británico se escribe centre (aquí la variante correcta pedida). "Sentre"/"centr" son errores.',
          },
          {
            q: '¿Qué día sale el vuelo?',
            options: ['On Friday', 'On Fryday', 'In Friday', 'At Friday'],
            answer: 'On Friday',
            concept: 'Preposición de tiempo (on + día)',
            explanation:
              'Dice "leaves on Friday". Con días usamos "on". La grafía correcta es Friday.',
          },
          {
            q: '¿A qué hora sale el vuelo?',
            options: ['At eight in the evening', 'At eight in the morning', 'At five in the evening', 'At noon'],
            answer: 'At eight in the evening',
            concept: 'La hora + parte del día',
            explanation: 'Dice "at eight in the evening" = a las ocho de la tarde/noche.',
          },
        ],
      },
      {
        id: 't2-e8',
        speaker: 'Coach',
        ...V.auM,
        audioText:
          "Good morning, team. Practice starts at seven o'clock sharp, so please do not be late. We usually train on the main field, but today we will use the gym because of the rain. Remember to bring water and clean shoes. The match against the Eagles is next Saturday at three in the afternoon.",
        translation:
          "Buenos días, equipo. El entrenamiento empieza a las siete en punto, así que por favor no lleguen tarde. Normalmente entrenamos en la cancha principal, pero hoy usaremos el gimnasio por la lluvia. Recuerden traer agua y zapatos limpios. El partido contra los Eagles es el próximo sábado a las tres de la tarde.",
        questions: [
          {
            q: '¿A qué hora empieza el entrenamiento?',
            options: ["At seven o'clock", "At seven thirty", "At eight o'clock", "At noon"],
            answer: "At seven o'clock",
            concept: 'La hora (at + hora)',
            explanation: 'Dice "Practice starts at seven o\'clock sharp". "sharp" = en punto.',
          },
          {
            q: '¿Dónde entrenan normalmente?',
            options: ['On the main field', 'On the main feild', 'In the main field', 'At the main field'],
            answer: 'On the main field',
            concept: 'Complemento de lugar (on + field)',
            explanation:
              'Dice "on the main field". Con superficies como field/court usamos "on". Cuidado con "feild" (mal escrito).',
          },
          {
            q: '¿Dónde entrenarán hoy?',
            options: ['In the gym', 'In the gymn', 'At the gym', 'On the gym'],
            answer: 'In the gym',
            concept: 'Complemento de lugar (in)',
            explanation:
              'Dice "we will use the gym". Como es un espacio cerrado, "in the gym". La grafía correcta es gym.',
          },
          {
            q: '¿Qué deben traer?',
            options: ['Water and clean shoes', 'Wather and clean shoes', 'Water and clean shooes', 'Watter and clean shoes'],
            answer: 'Water and clean shoes',
            concept: 'Vocabulario',
            explanation: 'Dice "bring water and clean shoes". Grafía correcta: water, shoes.',
          },
          {
            q: '¿Cuándo es el partido contra los Eagles?',
            options: ['Next Saturday at three', 'Next Saturday at two', 'Next Sunday at three', 'Next Saturday at noon'],
            answer: 'Next Saturday at three',
            concept: 'Expresiones de tiempo futuro + hora',
            explanation:
              'Dice "next Saturday at three in the afternoon". "next Saturday" = el próximo sábado.',
          },
        ],
      },
      {
        id: 't2-e9',
        speaker: 'Doctor',
        ...V.gbF,
        audioText:
          "Hello, please come in and sit down. How often do you feel this pain? I feel it almost every day, usually after lunch. I see. You should drink more water and exercise three times a week. Take this medicine twice a day, after meals. Come back in two weeks for a check-up.",
        translation:
          "Hola, por favor pase y siéntese. ¿Con qué frecuencia siente este dolor? Lo siento casi todos los días, normalmente después de almorzar. Ya veo. Debería beber más agua y hacer ejercicio tres veces por semana. Tome este medicamento dos veces al día, después de las comidas. Vuelva en dos semanas para un control.",
        questions: [
          {
            q: '¿Con qué frecuencia siente el paciente el dolor?',
            options: ['Almost every day', 'Almost every days', 'Allmost every day', 'Almost evry day'],
            answer: 'Almost every day',
            concept: 'Adverbios/expresiones de frecuencia',
            explanation:
              'Dice "almost every day". "Every day" (todos los días) es singular: "day", no "days". "Allmost"/"evry" están mal.',
          },
          {
            q: '¿Cuándo siente el dolor normalmente?',
            options: ['After lunch', 'After launch', 'Before lunch', 'After lunche'],
            answer: 'After lunch',
            concept: 'Preposiciones de tiempo (after)',
            explanation:
              'Dice "usually after lunch". "After" = después de. Cuidado con "launch" (lanzamiento), otra palabra.',
          },
          {
            q: '¿Cuántas veces por semana debe hacer ejercicio?',
            options: ['Three times a week', 'Three time a week', 'Tree times a week', 'Three times a weak'],
            answer: 'Three times a week',
            concept: 'Frecuencia (times a week)',
            explanation:
              '"Three times a week" = tres veces por semana. En plural es "times". Cuidado con "weak" (débil).',
          },
          {
            q: '¿Con qué frecuencia debe tomar el medicamento?',
            options: ['Twice a day', 'Twise a day', 'Two times a days', 'Twice a days'],
            answer: 'Twice a day',
            concept: 'Frecuencia (once/twice a day)',
            explanation: '"Twice a day" = dos veces al día. "Day" va en singular tras "a".',
          },
          {
            q: '¿Cuándo debe volver el paciente?',
            options: ['In two weeks', 'In two weaks', 'In too weeks', 'On two weeks'],
            answer: 'In two weeks',
            concept: 'Preposición de tiempo (in + periodo futuro)',
            explanation:
              'Dice "Come back in two weeks". "In + periodo" indica dentro de cuánto tiempo. Grafía correcta: weeks.',
          },
        ],
      },
      {
        id: 't2-e10',
        speaker: 'Station',
        ...V.usM,
        audioText:
          "This is the final call for train number seven to Manchester, departing from platform four at nine forty-five. Passengers must be on board five minutes before departure. The next train to Liverpool leaves from platform two at ten fifteen. Please keep your luggage with you at all times. Thank you.",
        translation:
          "Este es el último llamado para el tren número siete a Manchester, que sale del andén cuatro a las nueve cuarenta y cinco. Los pasajeros deben estar a bordo cinco minutos antes de la salida. El próximo tren a Liverpool sale del andén dos a las diez y cuarto. Por favor, mantenga su equipaje consigo en todo momento. Gracias.",
        questions: [
          {
            q: '¿A qué ciudad va el tren número siete?',
            options: ['Manchester', 'Manchestre', 'Manchester.', 'Machester'],
            answer: 'Manchester',
            concept: 'Vocabulario · lugares',
            explanation: 'Dice "train number seven to Manchester". La grafía correcta es Manchester.',
          },
          {
            q: '¿De qué andén sale el tren a Manchester?',
            options: ['From platform four', 'From platform for', 'From platfor four', 'From plataform four'],
            answer: 'From platform four',
            concept: 'Complemento de lugar (from + platform)',
            explanation:
              'Dice "departing from platform four". "From" indica el punto de salida. La grafía correcta es platform.',
          },
          {
            q: '¿A qué hora sale el tren a Manchester?',
            options: ['At nine forty-five', 'At nine fifteen', 'At ten forty-five', 'At nine fourteen'],
            answer: 'At nine forty-five',
            concept: 'La hora (horas y minutos)',
            explanation: 'Dice "at nine forty-five" (9:45).',
          },
          {
            q: '¿Cuántos minutos antes deben estar a bordo?',
            options: ['Five minutes', 'Five minits', 'Five minuts', 'Fife minutes'],
            answer: 'Five minutes',
            concept: 'Vocabulario · tiempo',
            explanation: 'Dice "five minutes before departure". La grafía correcta es minutes.',
          },
          {
            q: '¿A qué hora sale el próximo tren a Liverpool?',
            options: ['At ten fifteen', 'At ten fifty', 'At nine fifteen', 'At ten fifteen sharp'],
            answer: 'At ten fifteen',
            concept: 'La hora (horas y minutos)',
            explanation: 'Dice "leaves ... at ten fifteen" (10:15).',
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PRUEBA 3 · AVANZADO — Trabajo, experiencias, anuncios y relatos
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'test-3',
    order: 3,
    level: 'Avanzado',
    emoji: '🏆',
    title: 'Prueba 3 · Trabajo y experiencias',
    description: 'Entrevistas, relatos en pasado, anuncios y detalles precisos.',
    exercises: [
      {
        id: 't3-e1',
        speaker: 'Interviewer',
        ...V.gbM,
        audioText:
          "Thank you for coming in today. Can you tell me about your previous experience? Of course. I worked as a marketing assistant for three years. I managed social media campaigns and I always met my deadlines. I usually worked from nine to five, but sometimes I stayed late. I increased online sales by twenty percent.",
        translation:
          "Gracias por venir hoy. ¿Puede contarme sobre su experiencia previa? Por supuesto. Trabajé como asistente de marketing durante tres años. Gestionaba campañas de redes sociales y siempre cumplía mis plazos. Normalmente trabajaba de nueve a cinco, pero a veces me quedaba hasta tarde. Aumenté las ventas en línea en un veinte por ciento.",
        questions: [
          {
            q: '¿Cuál era el puesto anterior de la persona?',
            options: ['Marketing assistant', 'Marketing asistant', 'Marketing assistent', 'Marketting assistant'],
            answer: 'Marketing assistant',
            concept: 'Vocabulario · trabajo',
            explanation: 'Dice "a marketing assistant". Grafía correcta: marketing (una t) y assistant (doble s).',
          },
          {
            q: '¿Cuántos años trabajó allí?',
            options: ['Three years', 'Tree years', 'Three yeares', 'Three year'],
            answer: 'Three years',
            concept: 'Números + plural',
            explanation: 'Dice "for three years". El plural correcto es years.',
          },
          {
            q: '¿Con qué frecuencia cumplía sus plazos?',
            options: ['Always', 'Never', 'Rarely', 'Sometimes'],
            answer: 'Always',
            concept: 'Adverbios de frecuencia',
            explanation: 'Dice "I always met my deadlines". "Always" = siempre.',
          },
          {
            q: '¿En qué horario trabajaba normalmente?',
            options: ['From nine to five', 'From nine to nine', 'From five to nine', 'From nine to four'],
            answer: 'From nine to five',
            concept: 'Rango de horas (from ... to ...)',
            explanation: 'Dice "from nine to five". "From ... to ..." indica el rango horario.',
          },
          {
            q: '¿En cuánto aumentó las ventas en línea?',
            options: ['By twenty percent', 'By twelve percent', 'By twenty persent', 'By twenty percen'],
            answer: 'By twenty percent',
            concept: 'Números y porcentajes',
            explanation:
              'Dice "increased online sales by twenty percent". Ojo con confundir twenty (20) y twelve (12).',
          },
        ],
      },
      {
        id: 't3-e2',
        speaker: 'Traveller',
        ...V.usF,
        audioText:
          "Last summer I travelled to Japan with two friends. We stayed in Tokyo for ten days. We usually woke up early to visit the temples. The food was amazing, especially the fresh sushi. One day, we took the fast train to Kyoto. It was the best trip of my life and I definitely want to go back.",
        translation:
          "El verano pasado viajé a Japón con dos amigos. Nos quedamos en Tokio durante diez días. Normalmente nos levantábamos temprano para visitar los templos. La comida era increíble, especialmente el sushi fresco. Un día, tomamos el tren rápido a Kioto. Fue el mejor viaje de mi vida y definitivamente quiero volver.",
        questions: [
          {
            q: '¿A qué país viajó la persona?',
            options: ['Japan', 'Japon', 'Japam', 'Jappan'],
            answer: 'Japan',
            concept: 'Vocabulario · países',
            explanation: 'Dice "I travelled to Japan". En inglés se escribe Japan, no "Japón".',
          },
          {
            q: '¿Cuántos días se quedaron en Tokio?',
            options: ['Ten days', 'Ten dais', 'Tenn days', 'Ten day'],
            answer: 'Ten days',
            concept: 'Números + plural',
            explanation: 'Dice "for ten days". El plural correcto es days.',
          },
          {
            q: '¿Con qué frecuencia se levantaban temprano?',
            options: ['Usually', 'Never', 'Rarely', 'Once'],
            answer: 'Usually',
            concept: 'Adverbios de frecuencia',
            explanation:
              'Dice "We usually woke up early". "Usually" (normalmente) indica alta frecuencia, algo menor que "always".',
          },
          {
            q: '¿Qué comida menciona especialmente?',
            options: ['Fresh sushi', 'Fresh sushy', 'Fresh sushii', 'Fres sushi'],
            answer: 'Fresh sushi',
            concept: 'Vocabulario · comida',
            explanation: 'Dice "especially the fresh sushi". Grafía correcta: fresh sushi.',
          },
          {
            q: '¿A qué ciudad fueron en tren rápido?',
            options: ['Kyoto', 'Kioto', 'Kyioto', 'Kyotto'],
            answer: 'Kyoto',
            concept: 'Vocabulario · lugares',
            explanation: 'Dice "the fast train to Kyoto". En inglés se escribe Kyoto.',
          },
        ],
      },
      {
        id: 't3-e3',
        speaker: 'Weather',
        ...V.gbF,
        audioText:
          "Here is the weather forecast for tomorrow. In the morning, it will be cloudy and cold, around eight degrees. In the afternoon, we expect heavy rain in the north and strong wind near the coast. In the evening, the sky will clear up. Remember to take an umbrella if you go out.",
        translation:
          "Aquí está el pronóstico del tiempo para mañana. Por la mañana, estará nublado y frío, alrededor de ocho grados. Por la tarde, esperamos lluvia intensa en el norte y viento fuerte cerca de la costa. Por la noche, el cielo se despejará. Recuerde llevar un paraguas si sale.",
        questions: [
          {
            q: '¿Cómo estará el tiempo por la mañana?',
            options: ['Cloudy and cold', 'Cloudi and cold', 'Cloudy and colde', 'Cloudy and could'],
            answer: 'Cloudy and cold',
            concept: 'Vocabulario · clima',
            explanation:
              'Dice "cloudy and cold". Grafía correcta: cloudy, cold. Cuidado con "could" (podría), otra palabra.',
          },
          {
            q: '¿Cuántos grados hará por la mañana?',
            options: ['Around eight degrees', 'Around eigth degrees', 'Around eight degres', 'Around eighty degrees'],
            answer: 'Around eight degrees',
            concept: 'Números',
            explanation:
              'Dice "around eight degrees". Ojo con confundir eight (8) y eighty (80); grafía correcta: degrees.',
          },
          {
            q: '¿Dónde se espera lluvia intensa?',
            options: ['In the north', 'In the nort', 'On the north', 'At the north'],
            answer: 'In the north',
            concept: 'Complemento de lugar (in + punto cardinal)',
            explanation:
              'Dice "heavy rain in the north". Con puntos cardinales/regiones usamos "in the north/south...".',
          },
          {
            q: '¿Dónde habrá viento fuerte?',
            options: ['Near the coast', 'Near the coust', 'Near the coas', 'Neer the coast'],
            answer: 'Near the coast',
            concept: 'Preposiciones de lugar (near)',
            explanation:
              '"Near" = cerca de. Dice "strong wind near the coast". Grafía correcta: coast (no "coust").',
          },
          {
            q: '¿Qué recomienda llevar si sales?',
            options: ['An umbrella', 'An umbrela', 'A umbrella', 'An unbrella'],
            answer: 'An umbrella',
            concept: 'Artículo a/an + vocabulario',
            explanation:
              'Dice "take an umbrella". Usamos "an" ante sonido vocálico (umbrella). Grafía correcta: umbrella.',
          },
        ],
      },
      {
        id: 't3-e4',
        speaker: 'Manager',
        ...V.usM,
        audioText:
          "I sent an email to the whole team on Friday afternoon. The meeting planned for Monday morning has been moved to Wednesday at three because several employees are travelling. Please confirm your attendance by replying before the end of the day. We will meet in the main conference room on the fifth floor.",
        translation:
          "Envié un correo a todo el equipo el viernes por la tarde. La reunión prevista para el lunes por la mañana se ha trasladado al miércoles a las tres porque varios empleados están de viaje. Por favor, confirmen su asistencia respondiendo antes del final del día. Nos reuniremos en la sala de conferencias principal del quinto piso.",
        questions: [
          {
            q: '¿Cuándo envió el correo el gerente?',
            options: ['On Friday afternoon', 'In Friday afternoon', 'On Friday afternon', 'At Friday afternoon'],
            answer: 'On Friday afternoon',
            concept: 'Preposición de tiempo (on + día)',
            explanation: 'Dice "on Friday afternoon". Con días usamos "on".',
          },
          {
            q: '¿Para qué día estaba prevista la reunión originalmente?',
            options: ['Monday morning', 'Monday mornning', 'Munday morning', 'Monday moarning'],
            answer: 'Monday morning',
            concept: 'Vocabulario · días',
            explanation: 'Dice "planned for Monday morning". Grafía correcta: Monday morning.',
          },
          {
            q: '¿A qué día se trasladó la reunión?',
            options: ['To Wednesday', 'To Wensday', 'To Wednesdai', 'To Wedesday'],
            answer: 'To Wednesday',
            concept: 'Vocabulario · días',
            explanation:
              'Dice "moved to Wednesday". Wednesday es una palabra difícil: se escribe con "d" muda (Wed-nes-day).',
          },
          {
            q: '¿A qué hora será la reunión?',
            options: ['At three', 'At two', 'At five', 'At noon'],
            answer: 'At three',
            concept: 'La hora (at + hora)',
            explanation: 'Dice "to Wednesday at three". "at three" = a las tres.',
          },
          {
            q: '¿Dónde se reunirán?',
            options: ['On the fifth floor', 'On the fith floor', 'In the fifth floor', 'On the fifht floor'],
            answer: 'On the fifth floor',
            concept: 'Complemento de lugar (on + floor)',
            explanation:
              'Dice "on the fifth floor". Con pisos usamos "on the ... floor". Grafía correcta: fifth.',
          },
        ],
      },
      {
        id: 't3-e5',
        speaker: 'Volunteer',
        ...V.auF,
        audioText:
          "I volunteer at an animal shelter every weekend. I usually feed the dogs and clean their cages in the morning. In the afternoon, I often take them for a walk in the nearby park. We never use cruel methods; we treat every animal with kindness. Last month, we found homes for twenty cats.",
        translation:
          "Soy voluntaria en un refugio de animales todos los fines de semana. Normalmente alimento a los perros y limpio sus jaulas por la mañana. Por la tarde, a menudo los saco a pasear al parque cercano. Nunca usamos métodos crueles; tratamos a cada animal con amabilidad. El mes pasado, encontramos hogares para veinte gatos.",
        questions: [
          {
            q: '¿Dónde es voluntaria la persona?',
            options: ['At an animal shelter', 'At an animal shelther', 'In an animal shelter', 'At an animal shleter'],
            answer: 'At an animal shelter',
            concept: 'Complemento de lugar (at)',
            explanation:
              'Dice "at an animal shelter". Usamos "at" para el lugar. Grafía correcta: shelter.',
          },
          {
            q: '¿Con qué frecuencia va al refugio?',
            options: ['Every weekend', 'Every weekends', 'Evry weekend', 'Every weeckend'],
            answer: 'Every weekend',
            concept: 'Expresiones de frecuencia (every + tiempo)',
            explanation:
              'Dice "every weekend". Tras "every" el sustantivo va en singular: weekend, no "weekends".',
          },
          {
            q: '¿Cuándo alimenta a los perros?',
            options: ['In the morning', 'On the morning', 'At the morning', 'In the mornning'],
            answer: 'In the morning',
            concept: 'Preposición de tiempo (in + parte del día)',
            explanation: 'Dice "in the morning". Con partes del día usamos "in the".',
          },
          {
            q: '¿Dónde los saca a pasear?',
            options: ['In the nearby park', 'In the nearbi park', 'On the nearby park', 'In the nearby parc'],
            answer: 'In the nearby park',
            concept: 'Complemento de lugar (in the park)',
            explanation: 'Dice "in the nearby park". Con "park" usamos "in the park".',
          },
          {
            q: '¿Para cuántos gatos encontraron hogar el mes pasado?',
            options: ['Twenty cats', 'Twelve cats', 'Twenty catts', 'Twenti cats'],
            answer: 'Twenty cats',
            concept: 'Números + plural',
            explanation:
              'Dice "we found homes for twenty cats". Ojo con confundir twenty (20) y twelve (12).',
          },
        ],
      },
      {
        id: 't3-e6',
        speaker: 'Scientist',
        ...V.gbM,
        audioText:
          "Good afternoon. Today I will talk about our new project on clean energy. We usually test the solar panels on the roof of the laboratory. The results are very promising: energy costs dropped by forty percent. We will present our findings at the conference in Berlin next month. Any questions are welcome at the end.",
        translation:
          "Buenas tardes. Hoy hablaré sobre nuestro nuevo proyecto de energía limpia. Normalmente probamos los paneles solares en el techo del laboratorio. Los resultados son muy prometedores: los costos de energía bajaron un cuarenta por ciento. Presentaremos nuestros hallazgos en la conferencia de Berlín el próximo mes. Cualquier pregunta es bienvenida al final.",
        questions: [
          {
            q: '¿Sobre qué trata el proyecto?',
            options: ['Clean energy', 'Clean enery', 'Clean energi', 'Cleen energy'],
            answer: 'Clean energy',
            concept: 'Vocabulario · ciencia',
            explanation: 'Dice "our new project on clean energy". Grafía correcta: clean energy.',
          },
          {
            q: '¿Dónde prueban los paneles solares?',
            options: ['On the roof', 'On the ruf', 'In the roof', 'At the roof'],
            answer: 'On the roof',
            concept: 'Complemento de lugar (on + superficie)',
            explanation:
              'Dice "on the roof of the laboratory". Sobre una superficie usamos "on". Grafía correcta: roof.',
          },
          {
            q: '¿Cuánto bajaron los costos de energía?',
            options: ['By forty percent', 'By fourty percent', 'By fourteen percent', 'By forty persent'],
            answer: 'By forty percent',
            concept: 'Números y porcentajes',
            explanation:
              'Dice "dropped by forty percent" (40%). La grafía correcta es forty (¡sin u!) — "fourty" es un error muy común. Ojo también con fourteen (14).',
          },
          {
            q: '¿Dónde presentarán los hallazgos?',
            options: ['In Berlin', 'In Berlim', 'On Berlin', 'At Berlin'],
            answer: 'In Berlin',
            concept: 'Complemento de lugar (in + ciudad)',
            explanation:
              'Dice "at the conference in Berlin". Con ciudades/países usamos "in": in Berlin.',
          },
          {
            q: '¿Cuándo será la conferencia?',
            options: ['Next month', 'Next mounth', 'Next monht', 'Nex month'],
            answer: 'Next month',
            concept: 'Expresiones de tiempo futuro',
            explanation: 'Dice "next month". Grafía correcta: month.',
          },
        ],
      },
      {
        id: 't3-e7',
        speaker: 'Hiker',
        ...V.usM,
        audioText:
          "Last weekend we went hiking in the mountains. The trail was longer than we expected, about twelve kilometres. We always stayed together for safety. At the top, we saw a beautiful waterfall and even spotted some deer near the trees. We were exhausted, but the view was absolutely worth it.",
        translation:
          "El fin de semana pasado fuimos de excursión a las montañas. El sendero era más largo de lo que esperábamos, unos doce kilómetros. Siempre nos mantuvimos juntos por seguridad. En la cima, vimos una hermosa cascada e incluso avistamos algunos ciervos cerca de los árboles. Estábamos agotados, pero la vista realmente valió la pena.",
        questions: [
          {
            q: '¿A dónde fueron de excursión?',
            options: ['In the mountains', 'In the montains', 'On the mountains', 'In the mountens'],
            answer: 'In the mountains',
            concept: 'Complemento de lugar (in the mountains)',
            explanation:
              'Dice "hiking in the mountains". La expresión fija es "in the mountains". Grafía correcta: mountains.',
          },
          {
            q: '¿Cuántos kilómetros era el sendero?',
            options: ['Twelve kilometres', 'Twenty kilometres', 'Twelve kilometers', 'Twelfe kilometres'],
            answer: 'Twelve kilometres',
            concept: 'Números',
            explanation:
              'Dice "about twelve kilometres" (12). Ojo con confundir twelve (12) y twenty (20). Aquí se usa la grafía británica kilometres.',
          },
          {
            q: '¿Con qué frecuencia se mantuvieron juntos?',
            options: ['Always', 'Never', 'Rarely', 'Sometimes'],
            answer: 'Always',
            concept: 'Adverbios de frecuencia',
            explanation: 'Dice "We always stayed together for safety". "Always" = siempre.',
          },
          {
            q: '¿Qué animales avistaron?',
            options: ['Deer', 'Dear', 'Deere', 'Dear deer'],
            answer: 'Deer',
            concept: 'Vocabulario · animales (homófonos)',
            explanation:
              'Dice "spotted some deer". Deer = ciervo(s). Cuidado con "dear" (querido/a), que suena igual pero se escribe distinto.',
          },
          {
            q: '¿Dónde vieron los ciervos?',
            options: ['Near the trees', 'Near the treees', 'On the trees', 'Near the tree'],
            answer: 'Near the trees',
            concept: 'Preposiciones de lugar (near) + plural',
            explanation: 'Dice "near the trees". "Near" = cerca de; el plural correcto es trees.',
          },
        ],
      },
      {
        id: 't3-e8',
        speaker: 'Airline',
        ...V.gbF,
        audioText:
          "This is an announcement from SkyLine Airlines. Flight number four eight two to Chicago has been delayed by two hours due to bad weather. The new departure time is six forty-five in the evening from gate fourteen. Passengers with connecting flights should speak to our staff at the information desk. We apologise for the inconvenience.",
        translation:
          "Este es un anuncio de SkyLine Airlines. El vuelo número cuatro ocho dos a Chicago se ha retrasado dos horas debido al mal tiempo. La nueva hora de salida es las seis cuarenta y cinco de la tarde desde la puerta catorce. Los pasajeros con vuelos de conexión deben hablar con nuestro personal en el mostrador de información. Pedimos disculpas por las molestias.",
        questions: [
          {
            q: '¿A qué ciudad va el vuelo?',
            options: ['Chicago', 'Chicargo', 'Chikago', 'Chigago'],
            answer: 'Chicago',
            concept: 'Vocabulario · lugares',
            explanation: 'Dice "to Chicago". La grafía correcta es Chicago.',
          },
          {
            q: '¿Cuánto tiempo se retrasó el vuelo?',
            options: ['Two hours', 'To hours', 'Two ours', 'Two hour'],
            answer: 'Two hours',
            concept: 'Números + vocabulario de tiempo',
            explanation:
              'Dice "delayed by two hours". Grafía correcta: two hours (la "h" de hours es muda pero se escribe).',
          },
          {
            q: '¿Cuál es la nueva hora de salida?',
            options: ['Six forty-five', 'Six fifteen', 'Six fourteen', 'Six forty'],
            answer: 'Six forty-five',
            concept: 'La hora (horas y minutos)',
            explanation: 'Dice "six forty-five in the evening" (6:45).',
          },
          {
            q: '¿Desde qué puerta sale el vuelo?',
            options: ['Gate fourteen', 'Gate forty', 'Gate fourty', 'Gate fourteem'],
            answer: 'Gate fourteen',
            concept: 'Números',
            explanation:
              'Dice "from gate fourteen" (14). Ojo con confundir fourteen (14) y forty (40).',
          },
          {
            q: '¿Con quién deben hablar los pasajeros con conexión?',
            options: ['Staff at the information desk', 'Staff at the informacion desk', 'Staf at the information desk', 'Staff in the information desk'],
            answer: 'Staff at the information desk',
            concept: 'Complemento de lugar (at)',
            explanation:
              'Dice "at the information desk". Usamos "at" para el mostrador. Grafía correcta: staff, information.',
          },
        ],
      },
      {
        id: 't3-e9',
        speaker: 'Teacher',
        ...V.usF,
        audioText:
          "Good morning, class. For tomorrow, please read chapter five and answer the questions on page thirty. We will have a short test on Thursday about the past tense. Remember that irregular verbs do not follow the normal rule. If you have doubts, you can always ask me during the break. Have a nice day.",
        translation:
          "Buenos días, clase. Para mañana, por favor lean el capítulo cinco y respondan las preguntas de la página treinta. Tendremos una prueba corta el jueves sobre el pasado simple. Recuerden que los verbos irregulares no siguen la regla normal. Si tienen dudas, siempre pueden preguntarme durante el recreo. Que tengan un buen día.",
        questions: [
          {
            q: '¿Qué capítulo deben leer?',
            options: ['Chapter five', 'Chapter fife', 'Chaptr five', 'Chapter fives'],
            answer: 'Chapter five',
            concept: 'Números',
            explanation: 'Dice "read chapter five". Grafía correcta: chapter five.',
          },
          {
            q: '¿En qué página están las preguntas?',
            options: ['Page thirty', 'Page thirteen', 'Page thurty', 'Page thirtie'],
            answer: 'Page thirty',
            concept: 'Números',
            explanation:
              'Dice "the questions on page thirty" (30). Ojo con confundir thirty (30) y thirteen (13).',
          },
          {
            q: '¿Qué día será la prueba?',
            options: ['On Thursday', 'On Thrusday', 'On Thursdai', 'In Thursday'],
            answer: 'On Thursday',
            concept: 'Preposición de tiempo (on + día)',
            explanation:
              'Dice "a short test on Thursday". Con días usamos "on". Grafía correcta: Thursday.',
          },
          {
            q: '¿Sobre qué tema es la prueba?',
            options: ['The past tense', 'The pass tense', 'The past tens', 'The past tence'],
            answer: 'The past tense',
            concept: 'Gramática · tiempos verbales',
            explanation:
              'Dice "a short test ... about the past tense". "Past tense" = pasado. Grafía correcta: past tense.',
          },
          {
            q: '¿Con qué frecuencia pueden preguntarle en el recreo?',
            options: ['Always', 'Never', 'Rarely', 'Once'],
            answer: 'Always',
            concept: 'Adverbios de frecuencia',
            explanation:
              'Dice "you can always ask me during the break". "Always" = siempre; aquí expresa posibilidad permanente.',
          },
        ],
      },
      {
        id: 't3-e10',
        speaker: 'Host',
        ...V.gbM,
        audioText:
          "Welcome to our cooking show. Today we will prepare a classic tomato pasta. First, boil the water and add a little salt. Then, cook the pasta for about ten minutes. Meanwhile, fry the garlic in olive oil and add fresh tomatoes. Finally, mix everything together and serve it hot with fresh basil on top.",
        translation:
          "Bienvenidos a nuestro programa de cocina. Hoy prepararemos una clásica pasta con tomate. Primero, hierva el agua y añada un poco de sal. Luego, cocine la pasta durante unos diez minutos. Mientras tanto, sofría el ajo en aceite de oliva y añada tomates frescos. Finalmente, mezcle todo y sírvalo caliente con albahaca fresca por encima.",
        questions: [
          {
            q: '¿Qué plato van a preparar?',
            options: ['Tomato pasta', 'Tomatoe pasta', 'Tomato pastta', 'Tomatto pasta'],
            answer: 'Tomato pasta',
            concept: 'Vocabulario · comida',
            explanation: 'Dice "a classic tomato pasta". Grafía correcta: tomato pasta (singular sin "e").',
          },
          {
            q: '¿Qué se hace primero?',
            options: ['Boil the water', 'Boyl the water', 'Boil the wather', 'Boil the watter'],
            answer: 'Boil the water',
            concept: 'Secuencia (first) + vocabulario',
            explanation:
              'Dice "First, boil the water". "First" ordena la secuencia. Grafía correcta: boil, water.',
          },
          {
            q: '¿Cuánto tiempo se cocina la pasta?',
            options: ['About ten minutes', 'About ten minits', 'About ten minuts', 'About tenn minutes'],
            answer: 'About ten minutes',
            concept: 'Vocabulario · tiempo',
            explanation: 'Dice "cook the pasta for about ten minutes". Grafía correcta: minutes.',
          },
          {
            q: '¿En qué se fríe el ajo?',
            options: ['In olive oil', 'In olif oil', 'On olive oil', 'In olive oyl'],
            answer: 'In olive oil',
            concept: 'Complemento (in) + vocabulario',
            explanation:
              'Dice "fry the garlic in olive oil". Grafía correcta: olive oil.',
          },
          {
            q: '¿Con qué se sirve por encima?',
            options: ['Fresh basil', 'Fresh basile', 'Fresh basel', 'Fres basil'],
            answer: 'Fresh basil',
            concept: 'Vocabulario · hierbas',
            explanation: 'Dice "with fresh basil on top". Grafía correcta: fresh basil.',
          },
        ],
      },
    ],
  },
];

// Total de preguntas (para mostrar en la UI)
export const TOTAL_QUESTIONS = tests.reduce(
  (sum, t) => sum + t.exercises.reduce((s, e) => s + e.questions.length, 0),
  0
);

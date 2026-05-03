import { createClient } from '@sanity/client';

// NOTE: You need a Sanity token with write access to run this script.
// Create one at https://www.sanity.io/manage
const client = createClient({
  projectId: 'buq7hmwv',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2025-04-04',
  token: process.env.SANITY_AUTH_TOKEN, 
});

const quizzes = [
  {
    title: "Cricket IQ Challenge: Are You a True Fan?",
    slug: "cricket-iq-challenge",
    category: "sports",
    excerpt: "Test your knowledge of the gentleman's game. From World Cup history to legendary records, see if you can score a century in this quiz!",
    questions: [
      {
        questionText: "Who is the only cricketer to score 100 international centuries?",
        options: ["Sachin Tendulkar", "Virat Kohli", "Ricky Ponting", "Kumar Sangakkara"],
        correctIndex: 0
      },
      {
        questionText: "Which country won the first ever ICC T20 World Cup in 2007?",
        options: ["India", "Pakistan", "Australia", "West Indies"],
        correctIndex: 0
      },
      {
        questionText: "What is the length of a cricket pitch in yards?",
        options: ["22 yards", "20 yards", "25 yards", "18 yards"],
        correctIndex: 0
      },
      {
        questionText: "Who holds the record for the fastest century in ODI cricket (31 balls)?",
        options: ["AB de Villiers", "Chris Gayle", "Shahid Afridi", "Corey Anderson"],
        correctIndex: 0
      },
      {
        questionText: "Which bowler has taken the most wickets in Test cricket history?",
        options: ["Muttiah Muralitharan", "Shane Warne", "James Anderson", "Anil Kumble"],
        correctIndex: 0
      }
    ]
  },
  {
    title: "Hollywood Movie Buff: The Ultimate Cinema Quiz",
    slug: "hollywood-movie-buff-quiz",
    category: "pop-culture",
    excerpt: "Lights, camera, action! Think you know everything about the silver screen? Take our ultimate Hollywood quiz and find out.",
    questions: [
      {
        questionText: "Which movie won the Academy Award for Best Picture in 2024?",
        options: ["Oppenheimer", "Barbie", "Poor Things", "The Holdovers"],
        correctIndex: 0
      },
      {
        questionText: "Who played the character of Iron Man in the Marvel Cinematic Universe?",
        options: ["Robert Downey Jr.", "Chris Evans", "Chris Hemsworth", "Mark Ruffalo"],
        correctIndex: 0
      },
      {
        questionText: "In 'The Godfather', what is the name of the head of the family?",
        options: ["Vito Corleone", "Michael Corleone", "Sonny Corleone", "Fredo Corleone"],
        correctIndex: 0
      },
      {
        questionText: "Which 1994 film features the character Forrest Gump?",
        options: ["Forrest Gump", "Pulp Fiction", "The Shawshank Redemption", "The Lion King"],
        correctIndex: 0
      },
      {
        questionText: "Who directed the sci-fi epic 'Interstellar'?",
        options: ["Christopher Nolan", "James Cameron", "Ridley Scott", "Denis Villeneuve"],
        correctIndex: 0
      }
    ]
  },
  {
    title: "The Tech Titan Quiz: Test Your Digital Knowledge",
    slug: "tech-titan-quiz",
    category: "pop-culture",
    excerpt: "From Silicon Valley legends to revolutionary gadgets, how much do you really know about the technology that shapes our world?",
    questions: [
      {
        questionText: "Which company is the world's largest search engine provider?",
        options: ["Google", "Bing", "Yahoo", "Baidu"],
        correctIndex: 0
      },
      {
        questionText: "What does VPN stand for?",
        options: ["Virtual Private Network", "Variable Path Node", "Visual Protocol Network", "Virtual Public Network"],
        correctIndex: 0
      },
      {
        questionText: "Who is the CEO of Tesla and owner of X (formerly Twitter)?",
        options: ["Elon Musk", "Jeff Bezos", "Bill Gates", "Tim Cook"],
        correctIndex: 0
      },
      {
        questionText: "What was the first version of the Android operating system named after?",
        options: ["Cupcake", "Apple", "Donut", "Eclair"],
        correctIndex: 0
      },
      {
        questionText: "In computing, what is the brain of the computer called?",
        options: ["CPU", "RAM", "GPU", "Hard Drive"],
        correctIndex: 0
      }
    ]
  },
  {
    title: "World History Trivia: A Journey Through Time",
    slug: "world-history-trivia",
    category: "pop-culture",
    excerpt: "Travel back in time and test your knowledge of the events and people that shaped human history.",
    questions: [
      {
        questionText: "Who was the first human to travel into space?",
        options: ["Yuri Gagarin", "Neil Armstrong", "Buzz Aldrin", "John Glenn"],
        correctIndex: 0
      },
      {
        questionText: "Which empire was ruled by Julius Caesar?",
        options: ["Roman Empire", "Greek Empire", "Persian Empire", "Ottoman Empire"],
        correctIndex: 0
      },
      {
        questionText: "In which year did World War II end?",
        options: ["1945", "1939", "1918", "1950"],
        correctIndex: 0
      },
      {
        questionText: "Who was the main author of the Declaration of Independence?",
        options: ["Thomas Jefferson", "Benjamin Franklin", "George Washington", "John Adams"],
        correctIndex: 0
      },
      {
        questionText: "The Berlin Wall fell in which year?",
        options: ["1989", "1991", "1985", "1979"],
        correctIndex: 0
      }
    ]
  }
];

async function seed() {
  console.log('🚀 Starting quiz migration...');
  
  for (const quizData of quizzes) {
    try {
      const doc = {
        _type: 'post',
        _id: `quiz-${quizData.slug}`, // Added unique ID for createOrReplace
        title: quizData.title,
        slug: { _type: 'slug', current: quizData.slug },
        category: quizData.category,
        excerpt: quizData.excerpt,
        publishedAt: new Date().toISOString(),
        body: [
          {
            _type: 'block',
            children: [{ _type: 'span', text: `Welcome to the ${quizData.title}! Dive in and test your expertise.` }],
            style: 'normal'
          },
          {
            _type: 'quiz',
            title: quizData.title,
            description: quizData.excerpt,
            questions: quizData.questions.map(q => ({
              _type: 'object',
              questionText: q.questionText,
              options: q.options,
              correctIndex: q.correctIndex
            }))
          },
          {
            _type: 'block',
            children: [{ _type: 'span', text: "How did you do? Share your score with your friends and challenge them to beat it!" }],
            style: 'normal'
          }
        ]
      };

      console.log(`Creating quiz: ${quizData.title}...`);
      await client.createOrReplace(doc);
      console.log(`✅ Success: ${quizData.slug}`);
    } catch (err) {
      console.error(`❌ Failed to create quiz ${quizData.slug}:`, err.message);
    }
  }
  
  console.log('✨ All quizzes processed.');
}

if (!process.env.SANITY_AUTH_TOKEN) {
  console.error('🛑 Error: SANITY_AUTH_TOKEN is missing.');
  console.log('Please run the script as: SANITY_AUTH_TOKEN=your_token node scripts/seed-quizzes.mjs');
  process.exit(1);
}

seed();

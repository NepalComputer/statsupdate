import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';

const client = createClient({
  projectId: 'buq7hmwv',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2025-04-04',
  token: process.env.SANITY_AUTH_TOKEN, 
});

const IMAGE_PATHS = {
  agents: 'C:\\Users\\anant\\.gemini\\antigravity\\brain\\6523de4b-66a2-434d-b5fb-8d69921e2de9\\ai_coding_agents_2026_1777829472113.png',
  ides: 'C:\\Users\\anant\\.gemini\\antigravity\\brain\\6523de4b-66a2-434d-b5fb-8d69921e2de9\\ai_native_ides_2026_1777829503377.png'
};

const articles = [
  {
    _id: 'article-coding-agents-2026',
    title: "5 Best Free AI Coding Agents in 2026: The Ultimate Guide",
    slug: "best-free-coding-agents-2026",
    category: "tech",
    seoTitle: "Best Free AI Coding Agents 2026 - Top 5 Comparison",
    seoDescription: "Discover the best free AI coding agents of 2026. Detailed review of Antigravity, OpenDevin, Aider, and more for autonomous software engineering.",
    excerpt: "The landscape of software development has been permanently altered by the rise of autonomous coding agents. In 2026, these tools aren't just autocomplete plugins—they are full-fledged collaborators.",
    imageKey: 'agents',
    body: [
      {
        _type: 'block',
        children: [{ _type: 'span', text: "In 2026, the definition of a 'productive developer' has fundamentally shifted. We no longer just write code; we orchestrate agents. If you aren't using an autonomous agent yet, you're likely working ten times harder than your peers." }],
        style: 'normal'
      },
      {
        _type: 'block',
        children: [{ _type: 'span', text: "1. Antigravity (Google DeepMind)" }],
        style: 'h2'
      },
      {
        _type: 'block',
        children: [{ _type: 'span', text: "Antigravity has become the gold standard for high-performance agentic coding. Leveraging the latest reasoning models from Google DeepMind, it excels at understanding massive codebases and executing complex, multi-file migrations without human intervention." }],
        style: 'normal'
      },
      {
        _type: 'block',
        children: [{ _type: 'span', text: "Key Highlight: Antigravity's 'Omni-Search' allows it to crawl your entire local documentation and git history to find the perfect context for any fix." }],
        style: 'blockquote'
      },
      {
        _type: 'block',
        children: [{ _type: 'span', text: "2. OpenDevin: The Open Source Powerhouse" }],
        style: 'h2'
      },
      {
        _type: 'block',
        children: [{ _type: 'span', text: "OpenDevin has evolved into a mature, community-driven ecosystem. In 2026, it supports a 'Bring Your Own Model' (BYOM) architecture, allowing you to use high-end local models or free API tiers from various providers." }],
        style: 'normal'
      },
      {
        _type: 'block',
        children: [{ _type: 'span', text: "3. Aider: The Speed Demon" }],
        style: 'h2'
      },
      {
        _type: 'block',
        children: [{ _type: 'span', text: "For developers who live in the terminal, Aider remains unbeatable. Its precision in applying diffs and its deep integration with Git makes it the preferred tool for rapid-fire feature development." }],
        style: 'normal'
      },
      {
        _type: 'block',
        children: [{ _type: 'span', text: "4. Sweep: Your Personal Junior Dev" }],
        style: 'h2'
      },
      {
        _type: 'block',
        children: [{ _type: 'span', text: "Sweep has carved out a niche as the king of small tasks. It automatically monitors your GitHub issues and submits Pull Requests for bugs and simple feature requests while you sleep." }],
        style: 'normal'
      },
      {
        _type: 'block',
        children: [{ _type: 'span', text: "5. Plandex: The Architectural Master" }],
        style: 'h2'
      },
      {
        _type: 'block',
        children: [{ _type: 'span', text: "When you need to refactor an entire subsystem, Plandex is the agent you call. Its hierarchical planning allows it to map out massive changes before writing a single line of code, reducing errors in large-scale projects." }],
        style: 'normal'
      }
    ]
  },
  {
    _id: 'article-ai-ides-2026',
    title: "Top 5 Free AI-Powered IDEs for Developers in 2026",
    slug: "best-free-ai-ides-2026",
    category: "tech",
    seoTitle: "Top 5 AI IDEs 2026 - Best Free Options Reviewed",
    seoDescription: "Compare the top AI-powered IDEs of 2026. From Cursor and Windsurf to Zed and PearAI, find the best free environment for your workflow.",
    excerpt: "Stop using plain text editors. By 2026, the line between a text editor and an AI assistant has vanished. Here are the best IDEs that integrate AI at their core.",
    imageKey: 'ides',
    body: [
      {
        _type: 'block',
        children: [{ _type: 'span', text: "Selecting an IDE in 2026 is no longer about which extensions it supports, but how well its 'context engine' understands your project. The following IDEs offer the most advanced AI features on the market today." }],
        style: 'normal'
      },
      {
        _type: 'block',
        children: [{ _type: 'span', text: "1. Cursor: Still the King" }],
        style: 'h2'
      },
      {
        _type: 'block',
        children: [{ _type: 'span', text: "Cursor continues to lead with its 'Composer' feature. By 2026, Composer can generate entire frontend pages from a simple screenshot or wireframe description with perfect Tailwind CSS implementation." }],
        style: 'normal'
      },
      {
        _type: 'block',
        children: [{ _type: 'span', text: "2. Windsurf: The Agentic IDE" }],
        style: 'h2'
      },
      {
        _type: 'block',
        children: [{ _type: 'span', text: "Windsurf's unique 'Flow' mode allows the IDE to act as a semi-autonomous agent. It doesn't just suggest code; it navigates your files, runs terminal commands, and validates its own fixes." }],
        style: 'normal'
      },
      {
        _type: 'block',
        children: [{ _type: 'span', text: "3. Zed: Blazing Fast with Native AI" }],
        style: 'h2'
      },
      {
        _type: 'block',
        children: [{ _type: 'span', text: "Zed remains the fastest editor on the market. In 2026, its GPUI-powered interface handles AI streaming with zero lag, making it feel like the AI is thinking as fast as you can type." }],
        style: 'normal'
      },
      {
        _type: 'block',
        children: [{ _type: 'span', text: "4. PearAI: The Open Source Alternative" }],
        style: 'h2'
      },
      {
        _type: 'block',
        children: [{ _type: 'span', text: "PearAI has become the go-to for privacy-conscious developers. Being fully open-source, it allows teams to run their own AI backends, ensuring that sensitive proprietary code never leaves the local network." }],
        style: 'normal'
      },
      {
        _type: 'block',
        children: [{ _type: 'span', text: "5. VS Code + Supermaven" }],
        style: 'h2'
      },
      {
        _type: 'block',
        children: [{ _type: 'span', text: "While VS Code is a veteran, the Supermaven extension has given it a second life. With a 1-million-token context window, it provides the most comprehensive autocomplete experience available in any editor." }],
        style: 'normal'
      }
    ]
  }
];

async function seed() {
  console.log('🚀 Starting deep SEO migration...');
  
  for (const article of articles) {
    try {
      console.log(`Processing: ${article.title}...`);
      
      let featuredImage;
      if (fs.existsSync(IMAGE_PATHS[article.imageKey])) {
        console.log(`Uploading image for ${article.slug}...`);
        const asset = await client.assets.upload('image', fs.createReadStream(IMAGE_PATHS[article.imageKey]), {
          filename: `${article.slug}.png`
        });
        featuredImage = {
          _type: 'image',
          asset: {
            _type: "reference",
            _ref: asset._id
          }
        };
      }

      const doc = {
        _type: 'post',
        _id: article._id,
        title: article.title,
        slug: { _type: 'slug', current: article.slug },
        category: article.category,
        excerpt: article.excerpt,
        seoTitle: article.seoTitle,
        seoDescription: article.seoDescription,
        featuredImage: featuredImage,
        publishedAt: new Date().toISOString(),
        body: article.body
      };

      await client.createOrReplace(doc);
      console.log(`✅ Success: ${article.slug}`);
    } catch (err) {
      console.error(`❌ Failed: ${article.slug}`, err.message);
    }
  }
  
  console.log('✨ All articles published with images and SEO metadata.');
}

if (!process.env.SANITY_AUTH_TOKEN) {
  console.error('🛑 SANITY_AUTH_TOKEN missing.');
  process.exit(1);
}

seed();

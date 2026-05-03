import { type SchemaTypeDefinition } from 'sanity'

export const schemaTypes: SchemaTypeDefinition[] = [
  // Author Document
  {
    name: 'author',
    title: 'Author',
    type: 'document',
    fields: [
      {
        name: 'name',
        title: 'Name',
        type: 'string',
        validation: (Rule) => Rule.required(),
      },
      {
        name: 'slug',
        title: 'Slug',
        type: 'slug',
        options: { source: 'name' },
      },
      {
        name: 'image',
        title: 'Profile Image',
        type: 'image',
        options: { hotspot: true },
      },
      {
        name: 'bio',
        title: 'Bio',
        type: 'text',
        rows: 4,
      },
      {
        name: 'twitter',
        title: 'Twitter / X Handle',
        type: 'string',
      },
    ],
  },

  // Post Document - Main Article Type
  {
    name: 'post',
    title: 'Post',
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Title',
        type: 'string',
        validation: (Rule) => Rule.required(),
      },
      {
        name: 'slug',
        title: 'Slug',
        type: 'slug',
        options: { source: 'title', maxLength: 96 },
        validation: (Rule) => Rule.required(),
      },
      {
        name: 'category',
        title: 'Category',
        type: 'string',
        options: {
          list: [
            { title: 'Sports', value: 'sports' },
            { title: 'Technology', value: 'tech' },
            { title: 'Pop Culture', value: 'pop-culture' },
            { title: 'Games', value: 'games' },
          ],
        },
        validation: (Rule) => Rule.required(),
      },
      {
        name: 'authors',
        title: 'Authors',
        type: 'array',
        of: [{ type: 'reference', to: { type: 'author' } }],
      },
      {
        name: 'featuredImage',
        title: 'Featured Image',
        type: 'image',
        options: { hotspot: true },
      },
      {
        name: 'excerpt',
        title: 'Excerpt',
        type: 'text',
        rows: 3,
      },
      {
        name: 'body',
        title: 'Body',
        type: 'array',
        of: [
          { type: 'block' },                    // Normal rich text (paragraphs, headings, lists, etc.)
          { 
            type: 'image', 
            options: { hotspot: true } 
          },                                    // Inline images
          { 
            type: 'quiz'                          // ← New Interactive Quiz Block
          },
        ],
      },
      {
        name: 'publishedAt',
        title: 'Published At',
        type: 'datetime',
      },
      {
        name: 'seoTitle',
        title: 'SEO Title',
        type: 'string',
      },
      {
        name: 'seoDescription',
        title: 'SEO Description',
        type: 'text',
        rows: 2,
      },
    ],
  },

  // Quiz Block Definition (Reusable Object)
  {
    name: 'quiz',
    title: 'Quiz',
    type: 'object',
    fields: [
      {
        name: 'title',
        title: 'Quiz Title',
        type: 'string',
        validation: (Rule) => Rule.required(),
      },
      {
        name: 'description',
        title: 'Short Description (optional)',
        type: 'text',
        rows: 2,
      },
      {
        name: 'questions',
        title: 'Questions',
        type: 'array',
        of: [
          {
            type: 'object',
            name: 'question',
            title: 'Question',
            fields: [
              {
                name: 'questionText',
                title: 'Question Text',
                type: 'string',
                validation: (Rule) => Rule.required(),
              },
              {
                name: 'options',
                title: 'Answer Options',
                type: 'array',
                of: [{ type: 'string' }],
                validation: (Rule) => Rule.min(2).max(4).required(),
              },
              {
                name: 'correctIndex',
                title: 'Correct Answer Index (starts from 0)',
                type: 'number',
                validation: (Rule) => Rule.required().min(0),
              },
            ],
          },
        ],
        validation: (Rule) => Rule.min(1),
      },
    ],
  },

  // Game Document - For Interactive Games
  {
    name: 'game',
    title: 'Game',
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Game Title',
        type: 'string',
        validation: (Rule) => Rule.required(),
      },
      {
        name: 'slug',
        title: 'Slug',
        type: 'slug',
        options: { source: 'title', maxLength: 96 },
        validation: (Rule) => Rule.required(),
      },
      {
        name: 'gameType',
        title: 'Game Type',
        type: 'string',
        options: {
          list: [
            { title: 'Name Place Animal Thing', value: 'npat' },
            // Add more game types here as needed
          ],
        },
        validation: (Rule) => Rule.required(),
      },
      {
        name: 'description',
        title: 'Description',
        type: 'text',
        rows: 4,
      },
      {
        name: 'featuredImage',
        title: 'Featured Image',
        type: 'image',
        options: { hotspot: true },
      },
      {
        name: 'maxPlayers',
        title: 'Maximum Players',
        type: 'number',
        validation: (Rule) => Rule.required().min(2).max(10),
      },
      {
        name: 'roundTime',
        title: 'Round Time (seconds)',
        type: 'number',
        validation: (Rule) => Rule.required().min(30).max(300),
      },
      {
        name: 'isActive',
        title: 'Is Active',
        type: 'boolean',
        initialValue: true,
      },
      {
        name: 'publishedAt',
        title: 'Published At',
        type: 'datetime',
      },
    ],
  },
]
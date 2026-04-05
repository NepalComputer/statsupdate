import { type SchemaTypeDefinition, defineType, defineField } from 'sanity'

export const schemaTypes: SchemaTypeDefinition[] = [
  // First, add the Author document type
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

  // Updated Post type with authors (array - future-proof)
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
            { title: 'Politics', value: 'politics' },
            { title: 'Pop Culture', value: 'pop-culture' },
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
        of: [{ type: 'block' }],
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
]
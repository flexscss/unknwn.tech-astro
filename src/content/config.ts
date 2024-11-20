import { defineCollection, reference, z } from 'astro:content'

const project = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    role: z.string().optional(),
    logo: z.string().optional(),
    subProjects: z.array(reference('project')).optional(),
    url: z.string().optional(),
    dateStart: z.coerce.date().optional(),
    dateEnd: z.coerce.date().optional(),
    tags: z.string().array().optional()
  })
})

const work = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    alias: z.string(),
    description: z.string(),
    heroImage: z.string().optional(),
    heroImageBlurAmount: z.number().optional()
  })
})

const example = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    alias: z.string(),
    description: z.string(),
    heroImage: z.string().optional(),
    heroImageBlurAmount: z.number().optional(),
    order: z.number()
  })
})

export const collections = { project, work, example }

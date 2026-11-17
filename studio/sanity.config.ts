import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'
import {structure, SINGLETONS} from './structure'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'REPLACE_WITH_PROJECT_ID'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

const singletonIds = new Set(SINGLETONS.map((s) => s.id))

export default defineConfig({
  name: 'default',
  title: 'SP Surya Admin',
  projectId,
  dataset,
  plugins: [structureTool({structure}), visionTool()],
  schema: {
    types: schemaTypes,
    // Singletons can't be created from the "+ New" menu
    templates: (templates) => templates.filter(({schemaType}) => !singletonIds.has(schemaType)),
  },
  document: {
    // Singletons can't be duplicated or deleted
    actions: (input, context) =>
      singletonIds.has(context.schemaType)
        ? input.filter(({action}) => action && ['publish', 'discardChanges', 'restore'].includes(action))
        : input,
  },
})

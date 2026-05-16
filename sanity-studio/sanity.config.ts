import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'drive-boundless',

  projectId: 'rs5e478x',
  dataset: 'driveboudless',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})

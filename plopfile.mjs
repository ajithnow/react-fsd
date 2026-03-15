export default function (plop) {
  // Helper to compare strings for layout selection
  plop.setHelper('eq', (a, b) => a === b);

  plop.setGenerator('feature', {
    description: 'Generate a new FSD feature slice',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Feature name? (e.g. payments, invoices, reports)',
        validate: (value) => {
          if (!value) return 'Feature name is required'
          if (!/^[a-z][a-z0-9-]*$/.test(value)) return 'Must be lowercase kebab-case'
          return true
        },
      },
      { type: 'confirm', name: 'hasLocales',     message: 'Include locales?',           default: true },
      { type: 'confirm', name: 'hasMocks',        message: 'Include MSW mocks?',         default: true },
      { type: 'confirm', name: 'hasPermissions',  message: 'Include permissions/RBAC?',  default: true },
      { type: 'confirm', name: 'hasStore',        message: 'Include Redux slice?',       default: true },
      { type: 'confirm', name: 'hasQueries',      message: 'Include TanStack Query hooks?', default: true },
      {
        type: 'list',
        name: 'layout',
        message: 'Which layout does this feature use?',
        choices: ['app', 'auth', 'none'],
        default: 'app',
      },
    ],
    actions: (data) => {
      const base = 'src/features/{{kebabCase name}}'
      const tpl = 'plop-templates/feature'
      const actions = []

      // Always generated
      actions.push(
        { type: 'add', path: `${base}/routes/{{kebabCase name}}.route.tsx`,       templateFile: `${tpl}/routes/route.tsx.hbs` },
        { type: 'add', path: `${base}/routes/index.ts`,                           templateFile: `${tpl}/routes/index.ts.hbs` },
        { type: 'add', path: `${base}/constants/routes.constants.ts`,             templateFile: `${tpl}/constants/routes.constants.ts.hbs` },
        { type: 'add', path: `${base}/pages/{{pascalCase name}}Page.tsx`,         templateFile: `${tpl}/pages/Page.tsx.hbs` },
        { type: 'add', path: `${base}/pages/index.ts`,                            templateFile: `${tpl}/pages/index.ts.hbs` },
        { type: 'add', path: `${base}/models/{{kebabCase name}}.model.ts`,        templateFile: `${tpl}/models/model.ts.hbs` },
        { type: 'add', path: `${base}/services/{{kebabCase name}}.service.ts`,    templateFile: `${tpl}/services/service.ts.hbs` },
        { type: 'add', path: `${base}/services/index.ts`,                         templateFile: `${tpl}/services/index.ts.hbs` },
        { type: 'add', path: `${base}/constants/index.ts`,                       templateFile: `${tpl}/constants/index.ts.hbs` },
        { type: 'add', path: `${base}/config.ts`,                                 templateFile: `${tpl}/config.ts.hbs` },
      )

      // Conditional
      if (data.hasLocales) {
        actions.push(
          { type: 'add', path: `${base}/locales/en.json`,     templateFile: `${tpl}/locales/en.json.hbs` },
          { type: 'add', path: `${base}/locales/index.ts`,    templateFile: `${tpl}/locales/index.ts.hbs` },
        )
      }

      if (data.hasMocks) {
        actions.push(
          { type: 'add', path: `${base}/mocks/{{kebabCase name}}.handlers.ts`,   templateFile: `${tpl}/mocks/handlers.ts.hbs` },
          { type: 'add', path: `${base}/mocks/index.ts`,                         templateFile: `${tpl}/mocks/index.ts.hbs` },
        )
      }

      if (data.hasPermissions) {
        actions.push(
          { type: 'add', path: `${base}/constants/permissions.constants.ts`,     templateFile: `${tpl}/constants/permissions.constants.ts.hbs` },
        )
      }

      if (data.hasStore) {
        actions.push(
          { type: 'add', path: `${base}/stores/{{kebabCase name}}.slice.ts`,     templateFile: `${tpl}/stores/slice.ts.hbs` },
          { type: 'add', path: `${base}/stores/index.ts`,                        templateFile: `${tpl}/stores/index.ts.hbs` },
        )
      }

      if (data.hasQueries) {
        actions.push(
          { type: 'add', path: `${base}/queries/{{kebabCase name}}.queries.ts`,  templateFile: `${tpl}/queries/queries.ts.hbs` },
          { type: 'add', path: `${base}/queries/index.ts`,                       templateFile: `${tpl}/queries/index.ts.hbs` },
        )
      }

      return actions
    },
  })
}

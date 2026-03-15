/**
 * Component Generator CLI
 * 
 * Usage: node scripts/generate-component.js <layer> <slice> <component-name>
 * Example: node scripts/generate-component.js features auth SocialLogin
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
if (args.length < 3) {
  console.error('Usage: node scripts/generate-component.js <layer> <slice> <component-name>');
  process.exit(1);
}

const [layer, slice, componentName] = args;
const baseDir = path.join(process.cwd(), 'src', layer, slice, 'components', componentName);

if (fs.existsSync(baseDir)) {
  console.error(`Component ${componentName} already exists in ${layer}/${slice}`);
  process.exit(1);
}

// Create directories
fs.mkdirSync(baseDir, { recursive: true });

// Templates
const componentTemplate = `import React from 'react';
import { ${componentName}Props } from './${componentName}.models';

/**
 * ${componentName} component description.
 */
export const ${componentName}: React.FC<${componentName}Props> = () => {
  return (
    <div className="${componentName.toLowerCase()}">
      <h1>${componentName}</h1>
    </div>
  );
};

export default ${componentName};
`;

const modelsTemplate = `export interface ${componentName}Props {
  className?: string;
}
`;

const indexTemplate = `export * from './${componentName}';
export * from './${componentName}.models';
`;

// Write files
fs.writeFileSync(path.join(baseDir, `${componentName}.tsx`), componentTemplate);
fs.writeFileSync(path.join(baseDir, `${componentName}.models.ts`), modelsTemplate);
fs.writeFileSync(path.join(baseDir, 'index.ts'), indexTemplate);

console.log(`Successfully created component ${componentName} at ${baseDir}`);

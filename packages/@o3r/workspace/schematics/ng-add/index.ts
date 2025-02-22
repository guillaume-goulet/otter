import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import * as fs from 'node:fs';
import * as path from 'node:path';
import type { PackageJson } from 'type-fest';
import { registerPackageCollectionSchematics } from '@o3r/schematics';
import { NgAddSchematicsSchema } from './schema';
import { RepositoryInitializerTask } from '@angular-devkit/schematics/tasks';
import { prepareProject } from './project-setup';

/**
 * Add Otter library to an Angular Project
 * @param options
 */
export function ngAdd(options: NgAddSchematicsSchema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const ownPackageJsonContent = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', '..', 'package.json'), {encoding: 'utf-8'})) as PackageJson;

    return () => chain([
      // Register the module in angular.json
      registerPackageCollectionSchematics(ownPackageJsonContent),

      // Prepare mono repo for Otter
      prepareProject(options),

      // Commit Otter setup
      (_, c) => {
        if (!options.projectName && !options.skipGit && options.commit) {
          const commit: {name?: string; email?: string; message?: string} = typeof options.commit == 'object' ? options.commit : {};
          commit.message = 'Setup of Otter Framework';
          c.addTask(new RepositoryInitializerTask(undefined, commit));
        }
      }
    ])(tree, context);
  };
}

import { chain, noop, Rule } from '@angular-devkit/schematics';
import { addVsCodeRecommendations, applyEsLintFix, getO3rPeerDeps, getWorkspaceConfig, install, ngAddPackages } from '@o3r/schematics';
import { NodeDependencyType } from '@schematics/angular/utility/dependencies';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { addWorkspacesToProject, filterPackageJsonScripts } from './helpers/npm-workspace';
import { generateRenovateConfig } from './helpers/renovate';
import { NgAddSchematicsSchema } from './schema';
import { shouldOtterLinterBeInstalled } from './helpers/linter';
import { updateGitIgnore } from './helpers/gitignore-update';

/**
 * Enable all the otter features requested by the user
 * Install all the related dependencies and import the features inside the application
 * @param options installation options to pass to the all the other packages' installation
 */
export const prepareProject = (options: NgAddSchematicsSchema): Rule => {
  const vsCodeExtensions = [
    'AmadeusITGroup.otter-devtools',
    'EditorConfig.EditorConfig',
    'angular.ng-template'
  ];
  const ownSchematicsFolder = path.resolve(__dirname, '..');
  const ownPackageJsonPath = path.resolve(ownSchematicsFolder, '..', 'package.json');
  const depsInfo = getO3rPeerDeps(ownPackageJsonPath);
  const ownPackageJsonContent = JSON.parse(fs.readFileSync(ownPackageJsonPath, { encoding: 'utf-8' }));

  return async (tree, context) => {
    if (!ownPackageJsonContent) {
      context.logger.error('Could not find @o3r/workspace package. Are you sure it is installed?');
    }
    const o3rCoreVersion = ownPackageJsonContent.version;
    const installOtterLinter = await shouldOtterLinterBeInstalled(context);
    const internalPackagesToInstallWithNgAdd = Array.from(new Set([
      ...(installOtterLinter ? ['@o3r/eslint-config-otter'] : []),
      ...depsInfo.o3rPeerDeps
    ]));

    if (installOtterLinter) {
      vsCodeExtensions.push('dbaeumer.vscode-eslint');
    }

    const workspaceConfig = getWorkspaceConfig(tree);

    return () => chain([
      generateRenovateConfig(ownSchematicsFolder),
      addVsCodeRecommendations(vsCodeExtensions),
      updateGitIgnore(workspaceConfig),
      addWorkspacesToProject(),
      filterPackageJsonScripts,
      ngAddPackages(internalPackagesToInstallWithNgAdd, {
        skipConfirmation: true,
        version: o3rCoreVersion,
        parentPackageInfo: '@o3r/workspace - setup',
        dependencyType: NodeDependencyType.Peer
      }),
      !options.skipLinter && installOtterLinter ? applyEsLintFix() : noop(),
      options.skipInstall ? noop() : install
    ])(tree, context);
  };
};

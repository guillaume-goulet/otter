import type { DirEntry, FileEntry } from '@angular-devkit/schematics';
import { SchematicsException, Tree } from '@angular-devkit/schematics';
import { NodeDependencyType } from '@schematics/angular/utility/dependencies';
import { sync as globbySync } from 'globby';
import { minimatch } from 'minimatch';
import * as path from 'node:path';
import type { PackageJson } from 'type-fest';
import type { WorkspaceProject, WorkspaceSchema } from '../interfaces/index';

function findFilesInTreeRec(memory: Set<FileEntry>, directory: DirEntry, fileMatchesCriteria: (file: string) => boolean, ignoreDirectories: string[]) {
  if (ignoreDirectories.some(i => directory.path.split(path.posix.sep).includes(i))) {
    return memory;
  }

  directory.subfiles
    .filter(fileMatchesCriteria)
    .forEach((file) => memory.add(directory.file(file)!));

  directory.subdirs
    .forEach((dir) => findFilesInTreeRec(memory, directory.dir(dir), fileMatchesCriteria, ignoreDirectories));

  return memory;
}

/**
 *
 * Helper function that looks for files in the Tree
 * @param directory where to perform the search
 * @param fileMatchesCriteria a function defining the criteria to look for
 * @param ignoreDirectories optional parameter to ignore folders
 */
export function findFilesInTree(directory: DirEntry, fileMatchesCriteria: (file: string) => boolean, ignoreDirectories: string[] = ['node_modules', '.git', '.yarn']) {
  const memory = new Set<FileEntry>();
  findFilesInTreeRec(memory, directory, fileMatchesCriteria, ignoreDirectories);
  return Array.from(memory);
}

/**
 * Load the angular.json file
 * @param tree File tree
 * @param angularJsonFile Angular.json file path
 * @throws Angular JSON invalid or non exist
 * @deprecate use {@link getWorkspaceConfig} function instead, will be removed in Otter v10
 */
export function readAngularJson(tree: Tree, angularJsonFile = '/angular.json'): WorkspaceSchema {
  if (!tree.exists(angularJsonFile)) {
    throw new SchematicsException('Could not find Angular workspace configuration');
  }
  const workspaceConfig = tree.readJson(angularJsonFile);
  return workspaceConfig as any;
}

/**
 * Load the Workspace configuration object
 * @param tree File tree
 * @param workspaceConfigFile Workspace config file path, /angular.json in an Angular project
 * @returns null if the given config file does not exist
 */
export function getWorkspaceConfig<T extends WorkspaceSchema = WorkspaceSchema>(tree: Tree, workspaceConfigFile = '/angular.json'): WorkspaceSchema | null {
  if (!tree.exists(workspaceConfigFile)) {
    return null;
  }
  return tree.readJson(workspaceConfigFile) as unknown as T;
}

/**
 * Update angular.json file
 * @param tree File tree
 * @param workspace Angular workspace
 * @param angularJsonFile Angular.json file path
 */
export function writeAngularJson(tree: Tree, workspace: WorkspaceSchema, angularJsonFile = '/angular.json') {
  tree.overwrite(angularJsonFile, JSON.stringify(workspace, null, 2));
  return tree;
}

/**
 * Load the target's package.json file
 * @param tree File tree
 * @param workspaceProject Angular workspace project
 * @throws Package JSON invalid or non exist
 */
export function readPackageJson(tree: Tree, workspaceProject: WorkspaceProject) {
  const packageJsonPath = `${workspaceProject.root}/package.json`;
  if (!tree.exists(packageJsonPath)) {
    throw new SchematicsException('Could not find NPM Package');
  }

  const workspaceConfig = tree.readJson(packageJsonPath);
  return workspaceConfig as PackageJson;
}

/**
 * Get the workspace project
 * @param tree File tree
 * @param projectName Name of the Angular project
 * @param projectType
 * @deprecated please use {@link getWorkspaceConfig} instead. Will be removed in v10
 */
export function getProjectFromTree(tree: Tree, projectName?: string | null, projectType?: 'application' | 'library'): WorkspaceProject & { name: string } | undefined {

  const workspace = getWorkspaceConfig(tree);
  if (!workspace) {
    return undefined;
  }

  const projectGuessedName = projectName || Object.keys(workspace.projects)[0];
  // eslint-disable-next-line max-len
  let workspaceProject: WorkspaceProject & { name: string } | undefined = projectGuessedName && workspace.projects[projectGuessedName] && (!projectType || workspace.projects[projectGuessedName]?.projectType === projectType) ?
    {
      ...workspace.projects[projectGuessedName],
      name: projectGuessedName
    } :
    undefined;

  // if not found we fallback to the more relevant first one
  if (!workspaceProject) {
    workspaceProject = Object.entries(workspace.projects)
      .filter(([, project]) => !projectType || project.projectType === projectType)
      .map(([name, project]) => ({ ...project, name }))[0];
  }
  return workspaceProject;
}

/**
 * Returns the root directory of a project with the given name ( a relative path from the project root)
 * @param tree Files tree
 * @param projectName Name of the project inside the workspace
 * @deprecated please use {@link getWorkspaceConfig} instead. Will be removed in v10
 */
export function getProjectRootDir(tree: Tree, projectName?: string | null) {
  return getProjectFromTree(tree, projectName)?.root;
}


/**
 * Return the type of install to run depending on the project type (Peer or default)
 * @deprecated please use {@link getProjectNewDependenciesType} instead. Will be removed in v10
 * @param tree
 */
export function getProjectDepType(tree: Tree) {
  const workspaceProject = tree.exists('angular.json') ? getProjectFromTree(tree) : undefined;
  const projectType = workspaceProject?.projectType || 'application';
  return projectType === 'application' ? NodeDependencyType.Default : NodeDependencyType.Peer;
}

/**
 * Return the type of install to run depending on the project type (Peer or default)
 * @param project
 * @param tree
 */
export function getProjectNewDependenciesType(project?: WorkspaceProject) {
  return project?.projectType === 'library' ? NodeDependencyType.Peer : NodeDependencyType.Default;
}

/**
 * Get the default project name
 * @deprecated use {@link getWorkspaceConfig} function instead, will be removed in Otter V10
 * @param projectType
 * @param tree File tree
 */
export function getDefaultProjectName(tree: Tree, projectType?: 'application' | 'library'): string | undefined {
  return getProjectFromTree(tree, null, projectType)?.name;
}

/**
 * Get the folder of the templates for a specific sub-schematics
 * @param rootPath Root directory of the schematics ran
 * @param currentPath Directory of the current sub-schematics ran
 * @param templateFolder Folder containing the templates
 */
export function getTemplateFolder(rootPath: string, currentPath: string, templateFolder = 'templates') {
  const templateFolderPath = path.resolve(currentPath, templateFolder).replace(/[\\]/g, '/');
  return path.relative(rootPath, templateFolderPath);
}

/**
 * Get the path of all the files in the Tree
 * @param basePath Base path from which starting the list
 * @param tree Schematics file tree
 * @param excludes Array of globs to be ignored
 * @param recursive determine if the function will walk through the sub folders
 */
export function getAllFilesInTree(tree: Tree, basePath = '/', excludes: string[] = [], recursive = true): string[] {
  if (excludes.length && excludes.some((e) => minimatch(basePath, e, {dot: true}))) {
    return [];
  }
  return [
    ...tree.getDir(basePath).subfiles.map((file) => path.posix.join(basePath, file)),
    ...(recursive ? tree.getDir(basePath).subdirs.flatMap((dir) => getAllFilesInTree(tree, path.posix.join(basePath, dir), excludes, recursive)) : [])
  ];
}

/**
 * Get all files with specific extension from the specified folder for all the projects described in the workspace
 * @deprecated please use {@link getFilesInFolderFromWorkspaceProjectsInTree}, will be removed in v9
 * @param tree
 * @param folderInProject
 * @param extension
 */
export function getFilesInFolderFromWorkspaceProjects(tree: Tree, folderInProject: string, extension: string) {
  const workspace = readAngularJson(tree);
  const projectSources = Object.values(workspace.projects)
    .map((project) => path.join(project.root, folderInProject, '**', `*.${extension}`).replace(/\\/g, '/'));

  return projectSources.reduce((acc, projectSource) => {
    acc.push(...globbySync(projectSource, {ignore: ['**/node_modules/**']}));
    return acc;
  }, [] as string[]);
}

/**
 * Get all files with specific extension from the specified folder for all the projects described in the workspace
 * @param tree
 * @param folderInProject
 * @param extension
 */
export function getFilesInFolderFromWorkspaceProjectsInTree(tree: Tree, folderInProject: string, extension: string) {
  const workspace = readAngularJson(tree);
  const extensionMatcher = new RegExp(`\\.${extension.replace(/^\./, '')}$`);
  const excludes = ['**/node_modules/**', '**/.cache/**'];
  return Object.values(workspace.projects)
    .flatMap((project) => getAllFilesInTree(tree, path.posix.join(project.root, folderInProject), excludes))
    .filter((filePath) => extensionMatcher.test(filePath));
}


/**
 * Get all files with specific extension from the tree
 * @param tree
 * @param extension
 */
export function getFilesWithExtensionFromTree(tree: Tree, extension: string) {
  const excludes = ['**/node_modules/**', '**/.cache/**'];
  const extensionMatcher = new RegExp(`\\.${extension}$`);
  return getAllFilesInTree(tree, '/', excludes)
    .filter((filePath) => extensionMatcher.test(filePath));
}

/**
 * Get all files with specific extension from the root of all the projects described in the workspace
 * @param tree
 * @param extension
 */
export function getFilesFromRootOfWorkspaceProjects(tree: Tree, extension: string) {
  return getFilesInFolderFromWorkspaceProjectsInTree(tree, '', extension);
}

/**
 * Get all files with specific extension from the src folder for all the projects described in the workspace
 * @param tree
 * @param extension
 */
export function getFilesFromWorkspaceProjects(tree: Tree, extension: string) {
  return getFilesInFolderFromWorkspaceProjectsInTree(tree, 'src', extension);
}


/**
 * Get all the typescript files from the src folder for all the projects described in the workspace
 * @param tree
 */
export function getSourceFilesFromWorkspaceProjects(tree: Tree) {
  return getFilesFromWorkspaceProjects(tree, 'ts');
}

import {
  addImportToAppModule,
  getDefaultExecSyncOptions,
  packageManagerExec,
  packageManagerInstall,
  packageManagerRun,
  prepareTestEnv,
  setupLocalRegistry
} from '@o3r/test-helpers';

const appName = 'test-app-configuration';
const o3rVersion = '999.0.0';
const execAppOptions = getDefaultExecSyncOptions();
let appFolderPath: string;

describe('new otter application with configuration', () => {
  setupLocalRegistry();
  beforeAll(async () => {
    appFolderPath = await prepareTestEnv(appName, 'angular-with-o3r-core');
    execAppOptions.cwd = appFolderPath;
  });
  test('should add configuration to existing application', () => {
    packageManagerExec(`ng add --skip-confirmation @o3r/configuration@${o3rVersion}`, execAppOptions);

    packageManagerExec('ng g @o3r/core:component test-component --use-otter-config=false', execAppOptions);
    packageManagerExec('ng g @o3r/configuration:add-config --path="src/components/test-component/container/test-component-cont.component.ts"', execAppOptions);
    addImportToAppModule(appFolderPath, 'TestComponentContModule', 'src/components/test-component');

    expect(() => packageManagerInstall(execAppOptions)).not.toThrow();
    expect(() => packageManagerRun('build', execAppOptions)).not.toThrow();
  });
});

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable quote-props */
module.exports = {
  'extends': [
    './typescript.cjs',
    'plugin:jest/recommended'
  ],
  'plugins': [
    'jest'
  ],
  'rules': {
    'jest/no-conditional-expect': 'warn',
    'jest/no-done-callback': 'warn'
  }
};

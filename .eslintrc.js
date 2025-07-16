module.exports = {
  // ... existing config ...
  rules: {
    // ... existing rules ...
    '@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': '^_', 'varsIgnorePattern': '^_' }],
  },
}; 
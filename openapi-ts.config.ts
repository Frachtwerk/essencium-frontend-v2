export default {
  input: './backend/openapi.yaml',
  output: 'src/generated/client',
  plugins: ['@tanstack/react-query'],
}

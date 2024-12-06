export default function getAPIKey() {
  const keys = [
    'b7811eef-adfc-44ba-a06b-915bd56f37e6',
    '44efe0ce-4eeb-4ea3-a425-d9355b61e886',
    '54859190-2d05-4882-b44e-41513d34bf99',
    'c8ca8d47-c03b-48a6-86e6-f8eaa3863e64',
    '64e73b69-f266-4cc8-bfbc-db7227346eb5',
    '98270eae-5ead-43d3-a2eb-2a0c150d660d',
    'b240cb9e-32b6-4d51-a448-605900dcadaa',
    '36338186-4ec8-4bb6-926b-6708908b299e',
    '650c4be4-ce15-446e-81ef-99525c200558',
    '3e9a1241-7241-4975-b2a1-77203e9c0333',
    '679a08be-aa49-4a79-ad31-80c65dda374a',
    'c8e3f2db-2125-41f0-b64a-c6a8337718cf',
    'bdc4ef88-3fea-43f2-8f54-9d4018fe15db',
  ]

  return keys[Math.floor(Math.random() * keys.length)]
}

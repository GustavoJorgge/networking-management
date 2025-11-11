// import { createIntencaoRoute } from '@/infra/http/routes/intencoes/create-intencao';
// import fastify from 'fastify';

// jest.mock('@/infra/prisma/client', () => ({
//     intencaoParticipar: {
//         create: jest.fn().mockResolvedValue({ id: '123e4567-e89b-12d3-a456-426614174000' })
//     }
// }));

// describe('Create Intenção Route', () => {
//     const server = fastify();
//     createIntencaoRoute(server);

//     beforeAll(async () => {
//         await server.ready();
//     });

//     afterEach(() => {
//         jest.clearAllMocks();
//     });

//     it('201 - Deve criar uma nova intenção de participação', async () => {
//         const newIntencao = {
//             name: 'João Silva',
//             email: 'joao.silvaa@email.com',
//             empresa: 'Empresa X',
//             motivo: 'Quero contribuir com o grupo'
//         };
//         const response = await server.inject({
//             method: 'POST',
//             url: '/intencoes',
//             payload: newIntencao
//         });

//         expect(response.statusCode).toBe(201);
//         expect(JSON.parse(response.payload)).toEqual({
//             message: 'Intenção de ser membro criada com sucesso',
//             id: '123e4567-e89b-12d3-a456-426614174000'
//         });
//     });
// });

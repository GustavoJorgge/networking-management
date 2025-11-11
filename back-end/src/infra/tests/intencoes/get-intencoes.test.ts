import { getIntencoesRoute } from '@/infra/http/routes/intencoes/get-intencoes';
import prisma from '@/infra/prisma/client';
import fastify from 'fastify';

jest.mock('@/infra/prisma/client', () => ({
  intencaoParticipar: {
    findMany: jest.fn(),
  },
}));

describe('Busca intencoes através de - GET /intencoes', () => {
  const app = fastify();

  beforeAll(() => {
    getIntencoesRoute(app);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('200 - Deve retornar a lista de Intenções', async () => {
    const mockIntencoes = [
      {
        id: 'c9b82a7c-2b51-4a69-b3b8-05de456ecfc3',
        name: 'Gustavo Jorge',
        email: 'gustavo@email.com',
        empresa: 'AG Sistemas',
        motivo: 'Quero fazer parte do grupo',
        status: 'PENDENTE',
      },
    ];

    (prisma.intencaoParticipar.findMany as jest.Mock).mockResolvedValueOnce(mockIntencoes);

    const response = await app.inject({
      method: 'GET',
      url: '/intencoes',
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);

    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThanOrEqual(1);
    expect(prisma.intencaoParticipar.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: 'desc' },
    });
  });

  it('deve retornar erro 500 se o Prisma lançar exceção', async () => {
    (prisma.intencaoParticipar.findMany as jest.Mock).mockRejectedValueOnce(new Error('DB error'));

    const response = await app.inject({
      method: 'GET',
      url: '/intencoes',
    });

    expect(response.statusCode).toBe(500);
  });
});

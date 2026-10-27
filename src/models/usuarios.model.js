// src/models/usuarios.model.js
const prisma = require('../database/prisma.js');

const usuarioModel = {
  async buscarPorEmail(email) {
    const client = prisma.default || prisma;

    return await client.usuarios.findUnique({
      where: { email }
    });
  },

  async listar() {
    const client = prisma.default || prisma;
    return await client.usuarios.findMany();
  },

  async buscar(id) {
    const client = prisma.default || prisma;
    return await client.usuarios.findUnique({
      where: { id: Number(id) }
    });
  },

  async adicionar(dados) {
    const client = prisma.default || prisma;
    return await client.usuarios.create({
      data: dados
    });
  },

  async atualizar(id, dados) {
    const client = prisma.default || prisma;
    return await client.usuarios.update({
      where: { id: Number(id) },
      data: dados
    });
  },

  async remover(id) {
    const client = prisma.default || prisma;
    return await client.usuarios.delete({
      where: { id: Number(id) }
    });
  }
};

module.exports = usuarioModel;
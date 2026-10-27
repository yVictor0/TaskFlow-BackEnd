const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

module.exports = {
    listar: async () => {
        return await prisma.projeto.findMany()
    },

    buscar: async (id) => {
        return await prisma.projeto.findUnique({
            where: { id: Number(id) }
        })
    },

    adicionar: async ({ nome, descricao }) => {
        return await prisma.projeto.create({
            data: {
                nome,
                descricao: descricao || null
            }
        })
    },

    atualizar: async (id, dados) => {
        try {
            return await prisma.projeto.update({
                where: { id: Number(id) },
                data: dados
            })
        } catch (error) {
            if (error.code === 'P2025') return null
            throw error
        }
    },

    remover: async (id) => {
        try {
            return await prisma.projeto.delete({
                where: { id: Number(id) }
            })
        } catch (error) {
            if (error.code === 'P2025') return null
            throw error
        }
    }
}
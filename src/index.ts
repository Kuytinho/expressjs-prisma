import { PrismaClient } from "@prisma/client";
import express from "express";
import cors from 'cors';

const prisma = new PrismaClient();

const app = express();
const port = process.env.PORT || 3002;

app.use(express.json());
app.use(express.raw({ type: "application/vnd.custom-type" }));
app.use(express.text({ type: "text/html" }));
app.use(
  cors({
    origin: ['http://localhost:3000', 'https://create-react-app-site-production-0690.up.railway.app'], // Adicione os URLs do frontend aqui
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Especifique os métodos permitidos
  })
);

app.get("/todos", async (req, res) => {
  const todos = await prisma.todo.findMany({
    orderBy: { createdAt: "desc" },
  });

  res.json(todos);
});

app.get('/users', async (req, res) => {
  const users = await prisma.cadastro.findMany()
  res.json(users)
})

app.post("/todos", async (req, res) => {
  const todo = await prisma.todo.create({
    data: {
      completed: false,
      createdAt: new Date(),
      text: req.body.text ?? "Empty todo",
    },
  });

  

  return res.json(todo);
});

app.post("/cadastros", async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    const cadastro = await prisma.cadastro.create({
      data: {
        nome,
        email,
        senha,
      },
    });

    return res.json(cadastro);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar o cadastro." });
  }
});

app.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  try {
    // Busque o usuário pelo email
    const user = await prisma.cadastro.findFirst({
      where: { email: email },
    });

    if (!user) {
      // Usuário não encontrado
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    if (user.senha !== senha) {
      // Senha incorreta
      return res.status(401).json({ error: "Senha incorreta" });
    }

    // Login bem-sucedido
    return res.json({ message: "Login bem-sucedido" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
});
app.get("/testes", async (req, res) => {
  try {
    const testes = await prisma.teste.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(testes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar os registros." });
  }
});

app.get("/todos/:id", async (req, res) => {
  const id = req.params.id;
  const todo = await prisma.todo.findUnique({
    where: { id },
  });

  return res.json(todo);
});

app.put("/todos/:id", async (req, res) => {
  const id = req.params.id;
  const todo = await prisma.todo.update({
    where: { id },
    data: req.body,
  });

  return res.json(todo);
});

app.delete("/todos/:id", async (req, res) => {
  const id = req.params.id;
  await prisma.todo.delete({
    where: { id },
  });

  return res.send({ status: "ok" });
});

app.get("/", async (req, res) => {
  res.send(
    `
  <h1>Todo REST API</h1>
  <h2>Available Routes</h2>
  <pre>
    GET, POST /todos
    GET, PUT, DELETE /todos/:id
  </pre>
  `.trim(),
  );
});

app.listen(Number(port), "0.0.0.0", () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

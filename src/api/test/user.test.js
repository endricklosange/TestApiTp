const request = require("supertest");
const app = "http://0.0.0.0:3000";

describe("Test des routes utilisateur", () => {
  let token;

  it("devrait créer un nouvel utilisateur", async () => {
    const res = await request(app)
      .post("/user/register")
      .send({ email: "endrickLosange@gmail.com", password: "password" });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("message", "Utilisateur crée :endrickLosange@gmail.com");
  });

  it("devrait retourner un token JWT valide lors de la connexion de l'utilisateur", async () => {
    const res = await request(app)
      .post("/user/login")
      .send({ email: "endrickLosange@gmail.com", password: "password" });
    expect(res.statusCode).toEqual(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
    console.log("token: "+token);
  });

  it("devrait retourner une erreur lors de l'accès à une ressource protégée sans token", async () => {
    const res = await request(app)
    .post("/posts")
    .send({ title: "NewPost"});
    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty("message", "Accès interdit");
  });
});

  
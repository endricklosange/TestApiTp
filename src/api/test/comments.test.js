const request = require("supertest");
const app = "http://0.0.0.0:3000";

describe("Test des routes comments", () => {
  let token;
  let postId;
  let commentId;

  beforeAll(async () => {
    // Créer un utilisateur et se connecter pour obtenir un token valide
    const res = await request(app)
      .post("/user/register")
      .send({ email: "john@example.com", password: "password" });
    expect(res.statusCode).toEqual(201);

    const res2 = await request(app)
      .post("/user/login")
      .send({ email: "john@example.com", password: "password" });
    expect(res2.statusCode).toEqual(200);
    expect(res2.body.token).toBeDefined();
    token = res2.body.token;

    // Créer un post pour les tests de commentaires
    const post = { title: "Mon post pour les tests de commentaires"};
    const res3 = await request(app)
      .post("/posts")
      .set("Authorization", token)
      .send(post);
    expect(res3.statusCode).toEqual(201);
    expect(res3.body).toHaveProperty("title", post.title);
    postId = res3.body._id;
  });

  // Test de création d'un commentaire
  it("devrait créer un nouveau commentaire sur un post existant", async () => {
    const comment = {name: "Mon premier commentaire",  message: "blabla" };
    const res = await request(app)
      .post(`/posts/${postId}/comments`)
      .send(comment);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("name", comment.name);
    expect(res.body).toHaveProperty("message", comment.message);
    expect(res.body).toHaveProperty("post_id", postId);
    commentId = res.body._id;
  });


  // Test de récupération de tous les commentaires d'un post
  it("devrait récupérer tous les commentaires du post créé précédemment", async () => {
    const res = await request(app)
      .get(`/posts/${postId}/comments`)
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  // Test de mise à jour d'un commentaire
  it("devrait mettre à jour le commentaire créé précédemment", async () => {
    const comment = {name: "Commentaire",  message: "blablanew"};
    const res = await request(app)
      .put(`/comments/${commentId}`)
      .send(comment);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("_id", commentId);
    expect(res.body).toHaveProperty("name", comment.name);
    expect(res.body).toHaveProperty("message", comment.message);
  });

  // Test de suppression d'un commentaire
  it("devrait supprimer le commentaire créé précédemment", async () => {
    const res = await request(app)
      .delete(`/comments/${commentId}`)
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message", "Commentaires supprimé");
  });
});





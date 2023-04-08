const request = require("supertest");
const app = "http://0.0.0.0:3000";

 

  describe("Test des routes post", () => {
    let token;
    let postId;

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
    });
  
    // Test de création d'un post
    it("devrait créer un nouveau post", async () => {
      const post = { title: "Mon premier post"};
      const res = await request(app)
        .post("/posts")
        .set("Authorization",token)
        .send(post);
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("title", post.title);
      postId = res.body._id;
      console.log("console.logggg "+ res.body.content);
    });
  
    // Test de récupération d'un post
    it("devrait récupérer le post créé précédemment", async () => {
      const res = await request(app)
        .get(`/posts/${postId}`)
        .set("Authorization",token);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("_id", postId);
      expect(res.body).toHaveProperty("title", "Mon premier post");
    });
  
    // Test de récupération de tous les posts
    it("devrait récupérer tous les posts", async () => {
      const res = await request(app)
        .get("/posts")
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  
    // Test de mise à jour d'un post
    it("devrait mettre à jour le post créé précédemment", async () => {
      const post = { title: "Mon post mis à jour", content: "Contenu de mon post mis à jour" };
      const res = await request(app)
        .put(`/posts/${postId}`)
        .set("Authorization", token)
        .send(post);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("_id", postId);
      expect(res.body).toHaveProperty("title", post.title);
      expect(res.body).toHaveProperty("content", post.content);
    });
  
    // Test de suppression d'un post
    it("devrait supprimer le post créé précédemment", async () => {
      const res = await request(app)
        .delete(`/posts/${postId}`)
        .set("Authorization",token);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("message", "Article supprimé");
    });
  });
  

const request = require("supertest");
const app = require("../app");

describe("User API", () => {
  let token = null;
  let id = null;
  let adminToken = null;

  beforeAll(async () => {
    const res = await request(app)
      .post("/api/v1/admin/auth/signin")
      .send({ email: "rahimov@gmail.com", password: "1234567" });

    adminToken = res.body.data.tokens.accessToken;
  });

  describe("SIGNUP user", () => {
    it("should return data with tokens", async () => {
      const res = await request(app).post("/api/v1/users/auth/signup").send({
        full_name: "Jon Doe",
        email: "jon@gmail.com",
        password: "1234567qW@",
        phone_number: "901234567",
      });

      expect(res.statusCode).toBe(200);

      id = res.body.data.user.id;
      token = res.body.data.accessToken;
    });

    it("should return 422 validation error", async () => {
      const res = await request(app).post("/api/v1/users/auth/signup").send({
        full_name: "Jon Doe",
        email: "jongmail.com",
        password: "1234567",
      });

      expect(res.statusCode).toBe(422);
    });
  });

  describe("SIGNIN user", () => {
    it("should return data with tokens", async () => {
      const res = await request(app)
        .post("/api/v1/users/auth/signin")
        .send({ email: "jon@gmail.com", password: "1234567qW@" });

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toHaveProperty("accessToken");
    });

    it("should return 422 validation error", async () => {
      const res = await request(app).post("/api/v1/users/auth/signup").send({
        email: "jongmail.com",
        password: "1234567",
      });

      expect(res.statusCode).toBe(422);
    });
  });

  describe("GET users", () => {
    it("should return all users", async () => {
      const res = await request(app)
        .get("/api/v1/users?page=1")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.records.length).toBeGreaterThan(0);
    });

    it("should return 401 if user unauthorized", async () => {
      const res = await request(app).get("/api/v1/users?page=1");
      expect(res.statusCode).toBe(401);
    });

    it("should return 422 validation error", async () => {
      const res = await request(app)
        .get("/api/v1/users?page")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(422);
    });
  });

  describe("GET user by ID", () => {
    it("should return user", async () => {
      const res = await request(app)
        .get(`/api/v1/users/${id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
    });

    it("should return 401 if user unauthorized", async () => {
      const res = await request(app).get(`/api/v1/users/${id}`);
      expect(res.statusCode).toBe(401);
    });

    it("should return 422 validation error", async () => {
      const res = await request(app)
        .get(`/api/v1/users/qwe`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(422);
    });

    it("should return 404 if user not found", async () => {
      const res = await request(app)
        .get(`/api/v1/users/507f1f77bcf86cd799439011`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(404);
    });
  });

  describe("PATCH user", () => {
    it("should return updated user", async () => {
      const res = await request(app)
        .patch(`/api/v1/users/${id}`)
        .send({ full_name: "Jon" })
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
    });

    it("should return 422 validation error", async () => {
      const res = await request(app)
        .patch(`/api/v1/users/qwerty`)
        .send({ full_name: "Jon" })
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(422);
    });

    it("should return 401 if user unauthorized", async () => {
      const res = await request(app)
        .patch(`/api/v1/users/${id}`)
        .send({ full_name: "Jon" });

      expect(res.statusCode).toBe(401);
    });

    it("should return 404 if admin not found", async () => {
      const res = await request(app)
        .patch(`/api/v1/users/507f1f77bcf86cd799439011`)
        .send({ full_name: "Jon" })
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(404);
    });
  });

  describe("DELETE user", () => {
    it("should return deleted msg", async () => {
      const res = await request(app)
        .delete(`/api/v1/users/${id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
    });

    it("should return 422 validation error", async () => {
      const res = await request(app)
        .delete(`/api/v1/users/qqq`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(422);
    });

    it("should return 401 if user unauthorized", async () => {
      const res = await request(app).delete(`/api/v1/users/${id}`);

      expect(res.statusCode).toBe(401);
    });

    it("should return 404 if user not found", async () => {
      const res = await request(app)
        .delete(`/api/v1/users/507f1f77bcf86cd799439011`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(404);
    });
  });
});

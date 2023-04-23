const request = require("supertest");
const app = require("../app");

describe("Admin API", () => {
  let token = null;
  let id = null;

  describe("SIGNUP admin", () => {
    it("should return data with tokens", async () => {
      const res = await request(app).post("/api/v1/admin/auth/signup").send({
        full_name: "Jon Doe",
        email: "jon@gmail.com",
        password: "1234567",
      });

      expect(res.statusCode).toBe(200);

      id = res.body.data.admin.id;
      token = res.body.data.accessToken;
    });

    it("should return 422 validation error", async () => {
      const res = await request(app).post("/api/v1/admin/auth/signup").send({
        full_name: "Jon Doe",
        email: "jongmail.com",
        password: "1234567",
      });

      expect(res.statusCode).toBe(422);
    });
  });

  describe("SIGNIN admin", () => {
    it("should return data with tokens", async () => {
      const res = await request(app)
        .post("/api/v1/admin/auth/signin")
        .send({ email: "rahimov@gmail.com", password: "1234567" });

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toHaveProperty("tokens");
    });

    it("should return 422 validation error", async () => {
      const res = await request(app).post("/api/v1/admin/auth/signup").send({
        email: "jongmail.com",
        password: "1234567",
      });

      expect(res.statusCode).toBe(422);
    });
  });

  describe("GET admins", () => {
    it("should return all admins", async () => {
      const res = await request(app)
        .get("/api/v1/admin?page=1")
        .set("Authorization", `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.records.length).toBeGreaterThan(0);
    });

    it("should return 401 if admin unauthorized", async () => {
      const res = await request(app).get("/api/v1/admin?page=1");
      expect(res.statusCode).toBe(401);
    });

    it("should return 422 validation error", async () => {
      const res = await request(app)
        .get("/api/v1/admin?page")
        .set("Authorization", `Bearer ${token}`);
      expect(res.statusCode).toBe(422);
    });
  });

  describe("GET admin by ID", () => {
    it("should return admin", async () => {
      const res = await request(app)
        .get(`/api/v1/admin/${id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
    });

    it("should return 401 if admin unauthorized", async () => {
      const res = await request(app).get(`/api/v1/admin/${id}`);
      expect(res.statusCode).toBe(401);
    });

    it("should return 422 validation error", async () => {
      const res = await request(app)
        .get(`/api/v1/admin/qwe`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(422);
    });

    it("should return 404 if admin not found", async () => {
      const res = await request(app)
        .get(`/api/v1/admin/507f1f77bcf86cd799439011`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(404);
    });
  });

  describe("PATCH admin", () => {
    it("should return updated admin", async () => {
      const res = await request(app)
        .patch(`/api/v1/admin/${id}`)
        .send({ full_name: "Shahzod Rahimov" })
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
    });

    it("should return 422 validation error", async () => {
      const res = await request(app)
        .patch(`/api/v1/admin/qwerty`)
        .send({ full_name: "Shahzod Rahimov" })
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(422);
    });

    it("should return 401 if admin unauthorized", async () => {
      const res = await request(app)
        .patch(`/api/v1/admin/${id}`)
        .send({ full_name: "Shahzod Rahimov" });

      expect(res.statusCode).toBe(401);
    });

    it("should return 404 if admin not found", async () => {
      const res = await request(app)
        .patch(`/api/v1/admin/507f1f77bcf86cd799439011`)
        .send({ full_name: "Shahzod Rahimov" })
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(404);
    });
  });

  describe("DELETE admin", () => {
    it("should return deleted msg", async () => {
      const res = await request(app)
        .delete(`/api/v1/admin/${id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
    });

    it("should return 422 validation error", async () => {
      const res = await request(app)
        .delete(`/api/v1/admin/qqq`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(422);
    });

    it("should return 401 if admin unauthorized", async () => {
      const res = await request(app).delete(`/api/v1/admin/${id}`);

      expect(res.statusCode).toBe(401);
    });

    it("should return 404 if admin not found", async () => {
      const res = await request(app)
        .delete(`/api/v1/admin/507f1f77bcf86cd799439011`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(404);
    });
  });
});

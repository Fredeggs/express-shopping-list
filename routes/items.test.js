process.env.NODE_ENV = "test";
const request = require("supertest");

const app = require("../app");
let items = require("../fakeDb");

let popsicle = { name: "popsicle", price: 1.45 };

beforeEach(function () {
    items.push(popsicle);
});

afterEach(function () {
    // make sure this *mutates*, not redefines, `cats`
    items.length = 0;
});

describe("GET /items", () => {
    test("Get all items", async () => {
        const res = await request(app).get("/items");
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({ items: [popsicle] })
    })
})

describe("GET /items/:name", () => {
test("Get item by name", async () => {
        const res = await request(app).get(`/items/${popsicle.name}`);
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({ item: popsicle })
    })
    test("Responds with 404 for invalid item", async () => {
        const res = await request(app).get(`/items/cherries`);
        expect(res.statusCode).toBe(404)
    })
})

describe("POST /items", () => {
    test("Creating an item", async () => {
        const res = await request(app).post("/items").send({ name: "water", price: 9.99 });
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({ added: { name: "water", price: 9.99 } });
    })
    test("Responds with 400 if name is missing", async () => {
        const res = await request(app).post("/items").send({price: 4.99});
        expect(res.statusCode).toBe(400);
    })
    test("Responds with 400 if price is missing", async () => {
        const res = await request(app).post("/items").send({name: "onions"});
        expect(res.statusCode).toBe(400);
    })
})

describe("/PATCH /items/:name", () => {    
    test("Updating an item's name", async () => {
        const res = await request(app).patch(`/items/${popsicle.name}`).send({ name: "water" });
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ updated: { name: "water", price: 1.45 } });
    })
    test("Updating an item's price", async () => {
        const res = await request(app).patch(`/items/${popsicle.name}`).send({ price: 2.49 });
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ updated: { name: "water", price: 2.49 } });
    })
    test("Responds with 404 for invalid name", async () => {
        const res = await request(app).patch(`/items/binky`).send({ name: "Monster" });
        expect(res.statusCode).toBe(404);
    })
    test("Responds with 400 if name and price are missing", async () => {
        const res = await request(app).patch(`/items/${popsicle.name}`).send({});
        expect(res.statusCode).toBe(400);
    })
})

describe("/DELETE /items/:name", () => {
    test("Deleting an item", async () => {
        const res = await request(app).delete(`/items/${popsicle.name}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: 'Deleted' })
    })
    test("Responds with 404 for deleting invalid item", async () => {
        const res = await request(app).delete(`/items/hamface`);
        expect(res.statusCode).toBe(404);
    })
})
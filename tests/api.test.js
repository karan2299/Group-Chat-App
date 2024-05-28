const request = require('supertest');
const app = require('../server');

describe('API Endpoints', () => {
    let token;

    beforeAll(async () => {
        // Register a new admin user
        await request(app).post('/users/register').send({
            username: 'admin',
            password: 'adminpass',
            role: 'admin'
        });

        // Login as admin user
        const res = await request(app).post('/users/login').send({
            username: 'admin',
            password: 'adminpass'
        });

        token =`Bearer ${res.body.token}`;
    });

    it('should register a new user', async () => {
        const res = await request(app).post('/users/register').send({
            username: 'testuser',
            password: 'password'
        });
        expect(res.statusCode).toEqual(201);
        console.log("testtoken",token)
        expect(res.body).toHaveProperty('token');
    });

    it('should login a user', async () => {
        const res = await request(app).post('/users/login').send({
            username: 'testuser',
            password: 'password'
        });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('token');
    });

    it('should create a new group', async () => {
        const res = await request(app)
            .post('/groups/create')
            .set('Authorization', token)
            .send({
                name: 'testgroup',
                members: []
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('group');
    });

    it('should send a message in the group', async () => {
        const groupRes = await request(app)
            .post('/groups/create')
            .set('Authorization', token)
            .send({
                name: 'testgroup2',
                members: []
            });

        const groupId = groupRes.body.group._id;
        const messageRes = await request(app)

            .post('/messages/send')
            .set('Authorization', token)
            .send({
                groupId: groupId,
                sender:"6655cb5c4f30ad14d8c6d8ee",
                content: "Hello group!"
            });
        console.log("msssssss", messageRes)
        expect(messageRes.statusCode).toEqual(201);
        expect(messageRes.body).toHaveProperty('message');
    });

    it('should like a message', async () => {
        const groupRes = await request(app)
            .post('/groups/create')
            .set('Authorization', token)
            .send({
                name: 'testgroup3',
                members: []
            });

        const groupId = groupRes.body.group._id;

        const messageRes = await request(app)
            .post('/messages/send')
            .set('Authorization', token)
            .send({
                groupId: groupId,
                sender:"6655cb5c4f30ad14d8c6d8ee",
                content: "Hello group!"
            });
        console.log("msg",messageRes)

        const messageId = messageRes.body.message._id;

        const likeRes = await request(app)
            .post(`/messages/like/${messageId}`)
            .set('Authorization', token);

        expect(likeRes.statusCode).toEqual(200);
        expect(likeRes.body.message.likes).toContainEqual(expect.any(String));
    });
});

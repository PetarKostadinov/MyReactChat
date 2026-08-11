const { describe, test } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { createApp } = require('../app');
const {
    canRemoveGroupMember,
    isChatMember,
    isGroupAdmin,
    isSameUser,
} = require('../domain/chatPermissions');

const app = createApp(['https://allowed.example']);

describe('HTTP application boundaries', () => {
    test('exposes a health endpoint', async () => {
        const response = await request(app).get('/').expect(200);
        assert.equal(response.text, 'API is running successfully');
    });

    test('rejects protected requests without a token', async () => {
        const response = await request(app).get('/api/chat').expect(401);
        assert.match(response.body.message, /not authorized/i);
    });

    test('allows only configured browser origins', async () => {
        const allowed = await request(app)
            .options('/api/user')
            .set('Origin', 'https://allowed.example')
            .expect(204);
        assert.equal(allowed.headers['access-control-allow-origin'], 'https://allowed.example');

        const rejected = await request(app)
            .options('/api/user')
            .set('Origin', 'https://untrusted.example')
            .expect(204);
        assert.equal(rejected.headers['access-control-allow-origin'], undefined);
    });

    test('returns a structured 404 response', async () => {
        const response = await request(app).get('/missing').expect(404);
        assert.match(response.body.message, /not found/i);
    });
});

describe('chat authorization rules', () => {
    const admin = { _id: 'admin-id' };
    const member = { _id: 'member-id' };
    const outsider = { _id: 'outsider-id' };

    test('compares populated users and raw IDs consistently', () => {
        assert.equal(isSameUser(admin, 'admin-id'), true);
        assert.equal(isSameUser(admin, member), false);
    });

    test('recognizes only chat members', () => {
        assert.equal(isChatMember([admin, 'member-id'], member), true);
        assert.equal(isChatMember([admin, member], outsider), false);
    });

    test('limits group administration to the administrator', () => {
        assert.equal(isGroupAdmin(admin, admin), true);
        assert.equal(isGroupAdmin(admin, member), false);
    });

    test('allows an admin to remove members and a member to leave', () => {
        assert.equal(canRemoveGroupMember(admin, admin, member), true);
        assert.equal(canRemoveGroupMember(admin, member, member), true);
        assert.equal(canRemoveGroupMember(admin, member, outsider), false);
    });
});

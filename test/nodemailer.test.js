'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const nodemailer = require('nodemailer');

test('composes an email and attachment locally without SMTP access', async () => {
    const transporter = nodemailer.createTransport({
        streamTransport: true,
        buffer: true,
        newline: 'unix'
    });
    const message = await transporter.sendMail({
        from: 'Example Sender <sender@example.invalid>',
        to: 'recipient@example.invalid',
        subject: 'Security dependency validation',
        text: 'Offline email composition',
        attachments: [{ filename: 'fixture.txt', content: Buffer.from('attachment fixture') }]
    });

    assert.deepEqual(message.envelope.to, ['recipient@example.invalid']);
    assert.equal(message.envelope.from, 'sender@example.invalid');
    assert.ok(Buffer.isBuffer(message.message));
    const mime = message.message.toString('utf8');
    assert.match(mime, /Subject: Security dependency validation/);
    assert.match(mime, /Content-Type: multipart\/mixed;/);
    assert.match(mime, /filename=fixture\.txt/);
    assert.ok(mime.includes(Buffer.from('attachment fixture').toString('base64')));
});

const {default: Axios} = require('axios');
var express = require('express');
var router = express.Router();
const axios = require('axios');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {title: 'Express'});
});

router.post('/link/card', async function (req, res, next) {
  try {
    // Current Body Format
    const body = {
      type: 'INTERCHANGE-US',
      info: {
        nickname: 'My Debit Card',
        card_number:
          'Zoo8g2vBUjt7TwmEpRW8f6eQT3AOEEYePw2LkoxD+mO9lOT5OemHlGwgamgLGUbrmWu3DPwnEr2IqDy5YMFVgvQWP3w9nLOFzFFSW43auDgsVAqZScoRf8nI+6/B9KvOEV4XI8JeyXT+O+y3p3RtbiXGmYQNJ56Hy3hs2E5O+yn+3fpLfJQpVvNc38V+aE21VEsJuXFFNtS/8r4jJ6Dx/etTEaE/rtcEUEbwLLHFHjPiOWaHWZPuhXFLtyYrR9zG8FWSJVFwNTG/mEpv2O7We1iCB+9WoEKqdHyGwjjBcVgkUlU5huJIXv9xj53RGNvmHkDFTqgrlHpKkb0E/Ot0Zg==',
        exp_date:
          'ctA4Zj1CP0WCiMefPYsyewVbIHNilfwA09X9NSCyWxft4WGwFZmZkhsBJh51QL751/iFkUHbd09ZpDYjS86PqyNPZ5LkBueGHDIghLwWyzH1l99RiIs8urOW9c4g3L1USD+kzzRAqG1DBkW47FAX6AhPSi3YgQd94ery1H+asaqDrP79ayzoJ+nRXeEqe83FIgNUk/J5+EcAz3JYnoBmp1sfz7a4zHkvk0eKCxQWLETdqvONyCZyXdC/4CkaCxJ/87VsN3i4+ToULtSluRv8xr1NpRhzipKiEKTYW1nvNDAaJQezTVP/+GxmTmQfnfpVNDpJbXjNrOTej1HgMFpg4w==',
        document_id:
          '2a4a5957a3a62aaac1a0dd0edcae96ea2cdee688ec6337b20745eed8869e3ac8',
      },
    };

    let _body = {
      type: req.body.type,
      info: {
        nickname: req.body.nickname,
        card_number: req.body.card_number,
        exp_date: req.body.exp_date,
        document_id: req.body.document_id,
      },
    };

    let link_card = await axios.post(
      process.env.BASE_URL + req.body.user_id + '/nodes',
      _body,
      {
        headers: {
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          fingerprint: process.env.FINGERPRINT,
          ip_address: req.body.ip_address,
          isProduction: false,
        },
      }
    );

    res.status(200).json({
      data: link_card,
      message: 'Card Linked Successfully',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Server Error',
    });
  }
});

router.post('/create/transaction', async function (req, res, next) {
  try {
    // Current Body Format
    const body = {
      to: {
        type: 'DEPOSIT-US',
        id: '5c8ac55542edab2b2665cbf1',
      },
      amount: {
        amount: 100.1,
        currency: 'USD',
      },
      extra: {
        ip: '127.0.0.1',
        note: 'Test transaction',
      },
    };

    let _body = {
      to: {
        type: req.body.to,
        id: req.body.id,
      },
      amount: {
        amount: req.body.amount,
        currency: req.body.currency,
      },
      extra: {
        ip: req.body.ip,
        note: req.body.note,
      },
    };

    let create_transaction = await axios.post(
      process.env.BASE_URL +
        req.body.user_id +
        '/nodes/' +
        req.body.node_id +
        '/trans#',
      _body,
      {
        headers: {
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          fingerprint: process.env.FINGERPRINT,
          ip_address: req.body.ip_address,
          isProduction: false,
        },
      }
    );

    res.status(200).json({
      data: create_transaction,
      message: 'Transaction done Successfully',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Server Error',
      error
    });
  }
});

module.exports = router;




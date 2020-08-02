const express = require('express');
const router = express.Router();
const db = require('../db');
const nodemon = require('nodemon');

/* GET home page. */
/* USANDO CALLBACK
router.get('/', function (req, res, next) {
  db.findCustomers((err, docs) => {
    if (err) return console.error(err);
    console.log(docs);
    res.render('index', { title: 'Express' });
  });
});
*/

router.get('/', (req, res, next) => {
  db.findCustomers()
    .then((docs) => {
      res.render('index', { title: 'Clientes', customers: docs });
    })
    .catch((err) => {
      console.error(err);
      res.render("error", { messsage: "Não foi possivel listar os clientes", error })
    });
});

router.get('/new', (req, res) => {
  res.render('customers', { title: 'Cadastrar', customer: {} })
});

router.post('/new', (req, res) => {
  if (!req.body.nome)
    return res.redirect(`/new?error="Valor inválido informado no campo 'Nome'"`);

  if (req.body.idade && !/[0-9]+/.test(req.body.idade))
    return res.redirect(`/new?error="Valor inválido informado no campo 'Idade'"`);

  if (!req.body.cidade)
    return res.redirect(`/new?error="Valor inválido informado no campo 'Cidade'"`);

  const nome = req.body.nome;
  const idade = parseInt(req.body.idade);
  const cidade = req.body.cidade;

  const customer = { nome, idade, cidade };
  db.insertCustomers(customer)
    .then(result => res.redirect('/'))
    .catch(error => {
      console.error(error);
      res.render("error", { messsage: "Não foi possivel salvar os dados do cliente", error });
    })

});

router.get('/edit/:id', (req, res) => {

  const id = req.params.id;

  db.findCustomer(id)
    .then(doc => {
      res.render('customers', { title: 'Editar', customer: doc });
    })
    .catch(error => {
      console.error(error);
      res.render("error", { messsage: "Não foi possivel carregar os dados do cliente", error });
    })

})

router.post('/edit', (req, res) => {

  if (!req.body.nome)
    return res.redirect(`/new?error="Valor inválido informado no campo 'Nome'"`);

  if (req.body.idade && !/[0-9]+/.test(req.body.idade))
    return res.redirect(`/new?error="Valor inválido informado no campo 'Idade'"`);

  if (!req.body.cidade)
    return res.redirect(`/new?error="Valor inválido informado no campo 'Cidade'"`);

  const nome = req.body.nome;
  const idade = parseInt(req.body.idade);
  const cidade = req.body.cidade;
  const id = req.body.id;

  const customer = { nome, idade, cidade };
  db.updateCustomer(id, customer)
    .then(result => res.redirect('/'))
    .catch(error => {
      console.error(error);
      res.render("error", { messsage: "Não foi possivel editar os dados do cliente", error });
    })
})

router.get('/delete/:id', (req, res) => {
  const id = req.params.id;

  db.deleteCustomer(id)
    .then(result => res.redirect('/'))
    .catch(error => {
      console.error(error);
      res.render("error", { messsage: "Não foi possivel remover o cliente", error });
    })
})

module.exports = router;

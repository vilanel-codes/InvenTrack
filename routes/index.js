const express = require('express');
const router = express.Router();
var path = require('path');
var authenticated = 'false';

router.get('/', (req, res, next) => {
    
    authenticated = req.cookies.authenticated;
    console.log(req.cookies.authenticated);
    // storage.setItem("ram","shyam");
    // console.log(authenticated)
    if(authenticated=="true")
    {
    res.redirect('/home');
    }
    else
    {
      res.render('login');
    }
    });

    router.get('/visualiser', (req, res, next) => {
      authenticated = req.cookies.authenticated;
      if(authenticated=="true")
      {
      res.render('canvas-home');
      // res.render('company_select');
    }
    else{
      res.redirect('/');
    }
    });

    router.get('/assets', (req, res, next) => {
      authenticated = req.cookies.authenticated;
      if(authenticated=="true")
      {
      res.render('canvas-assets');
      // res.render('company_select');
    }
    else{
      res.redirect('/');
    }
    });
  
    router.get('/signinphone', (req, res, next) => {
  
  
        res.render('signinphone');
    });
  
  
  router.get('/home', (req, res, next) => {
    authenticated = req.cookies.authenticated;
    if(authenticated=="true")
    {
    // res.render('canvas');
    res.render('company_select');
  }
  else{
    res.redirect('/');
  }
  });
  
  router.get('/form', (req, res, next) => {
    authenticated = req.cookies.authenticated;
    if(authenticated=="true")
    {
    // res.render('canvas');
    res.render('company_form');
  }
  else{
    res.redirect('/');
  }
  });



  module.exports = router;

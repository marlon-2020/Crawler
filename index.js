const mysql=require('mysql2');
const download = require('image-downloader');
const dotenv = require('dotenv');
dotenv.config();

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('ecommerce', 'root', 'msf131906', {
    host: 'localhost',
    dialect: 'mysql'
});

const Produtos = sequelize.define('produtos', {
    nomeProduto: {
        type: Sequelize.STRING
    },
    valor: {
        type: Sequelize.STRING
    },
    valorOri: {
        type: Sequelize.STRING
    },
    valorPar: {
        type: Sequelize.STRING
    },
    imagem: {
        type: Sequelize.STRING
    }
})

var Crawler = {
	request : null,
	cheerio : null,
	init : function(){
		Crawler.request = require('request');
		Crawler.cheerio = require('cheerio');
		Crawler.getProducts();
	},
	getProducts: function(){
		Crawler.request('https://www.magazineluiza.com.br/busca/cal%C3%A7ados/8/', function(err, res, body){
			if(err)
				console.log('Error: ' + err);
			var $ = Crawler.cheerio.load(body);
			$('.productShowCase li').each(function(){
				var nomeProduto  = $(this).find('.productTitle').text().trim().replace(/^\s+|\s+$/g, "");
                var valor = $(this).find('.productPrice .price').text().trim().replace(/^\s+|\s+$/g, "");
                var valorOri = $(this).find('.productPrice .originalPrice').text().trim().replace(/^\s+|\s+$/g, "");
				var valorPar = $(this).find('.productPrice .installmentPrice').text().trim().replace(/^\s+|\s+$/g, "");
				var imagem = $(this).find('.alignment-image .product-image').attr('data-original');
				if(nomeProduto!=""){
					Produtos.create({nomeProduto: `${nomeProduto}`,valor: `${valor}`,valorOri: `${valorOri}`,valorPar: `${valorPar}`,imagem: `${imagem}`})
				}
				console.log(imagem)
				const options = {
					url: `${imagem}`,
					dest: './imagens'                
				}
				download.image(options)
  					.then(({ filename }) => {
    					console.log('Saved to', filename)
  					})
				  	.catch((err) => console.error(err))
			});
		});
	}
};
Crawler.init();




 


   
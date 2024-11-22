
// Fait par TABOU MUKETE ALLAN WERNER; rendu du TP pour la création d'une API simple de gestion des articles 


require("dotenv").config();  // Chargement des variables d'environnement du fichier .env dans la racine du projet 
const express = require("express");  //Importation du module express
const {Pool} = require("pg");  // Importation de la bibliothèque Pool de pg pour les connexions avec la BD 

const app = express();
const port = process.env.PORT || 3000;  // Port du serveur 


// Création d'un pool de connexion vers PostgreSQL pour exécuter les requêtes SQL

const pool = new Pool({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    password:process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT, 
}); 

//Création de la table Articles 

pool.query(`CREATE TABLE IF NOT EXISTS articles(
    id SERIAL PRIMARY KEY,
    title TEXT,
    content TEXT, 
    author TEXT,
    price INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`)

// Pour vérifier l'existence de notre table lorsqu'on lance le serveur
.then (() => console.log("La table articles a été créée ou est déjà existante."))
.catch(err => console.log(`Erreur lors de la tentative de création de la table articles : ${err}.`))

// Middleware pour parser JSON
app.use(express.json());


// Création des routes 

// Route get pour afficher les articles 
app.get("/articles", async (req,res) => {
    try {
        const result = await pool.query("SELECT * FROM articles ORDER BY id ASC");

        if(result.rows.length <= 0 || !result.rows){
            throw new Error ("La table articles est vide ou inexistance !");
        }

        res.status(200).json(result.rows);
    }catch(err){
        res.status(500).json({
            message: `Erreur lors de la récupération des données : ${err}`,
        })
    }
})

//Route post pour créer un nouvel article 
app.post("/articles", async (req,res) => {
    try{
        const {title, content, author, price } = req.body;
        const result = await  pool.query("INSERT INTO articles(title, content, author, price) VALUES($1,$2,$3,$4) RETURNING*", [title, content, author, price]);
        res.status(201).json(result.rows[0]);
    }catch(err){
        console.error(err);
        res.status(500).json({
            message: `Erreur lors de l'insertion de l'utilisateur: ${err}`,
            req_body: `${JSON.stringify(req.body)}` 
        })
    }
})

// Route patch pour mettre à jour le titre
app.patch("/articles/edit/title", async (req,res) => {
    try{
        const {id, title} = req.body;

        const result =  await pool.query("UPDATE articles SET title=$2 WHERE id=$1", [id, title]);
        
        res.status(200).json({
            message: `L'article avec l'id ${id} a été mis à jour avec succès !`,
            result: result
        });

    }catch(err){
        res.status(500).json({
            "message" : `Echec de la tentative de mise à jour de la table articles : ${err}`,
            "req_body" : `${(req.body)}`
        });
    }
})
// Route patch pour mettre à jour le contenu
app.patch("/articles/edit/content", async (req,res) => {
    try{
        const {id, content} = req.body;

        const result =  await pool.query("UPDATE articles SET content=$2 WHERE id=$1", [id, content]);
        
        res.status(200).json({
            message: `L'article avec l'id ${id} a été mis à jour avec succès !`,
            result: result
        });

    }catch(err){
        res.status(500).json({
            "message" : `Echec de la tentative de mise à jour de la table articles : ${err}`,
            "req_body" : `${(req.body)}`
        });
    }
})
// Route patch pour mettre à jour le prix
app.patch("/articles/edit/prix", async (req,res) => {
    try{
        const {id, price} = req.body;

        const result =  await pool.query("UPDATE articles SET price=$2 WHERE id=$1", [id, price]);
        
        res.status(200).json({
            message: `L'article avec l'id ${id} a été mis à jour avec succès !`,
            result: result
        });

    }catch(err){
        res.status(500).json({
            "message" : `Echec de la tentative de mise à jour de la table articles : ${err}`,
            "req_body" : `${(req.body)}`
        });
    }
})
// Route patch pour mettre à jour l'auteur
app.patch("/articles/edit/author", async (req,res) => {
    try{
        const {id, author} = req.body;

        const result =  await pool.query("UPDATE articles SET author=$2 WHERE id=$1", [id, author]);
        
        res.status(200).json({
            message: `L'article avec l'id ${id} a été mis à jour avec succès !`,
            result: result
        });

    }catch(err){
        res.status(500).json({
            "message" : `Echec de la tentative de mise à jour de la table articles : ${err}`,
            "req_body" : `${(req.body)}`
        });
    }
})

// Route delete pour supprimer un article
app.delete("/articles/delete", async (req, res) => {
    try {
        const { id } = req.body;
        const result = await pool.query("DELETE FROM articles WHERE id=$1", [id]);

        res.status(200).json({
            message: `L'article avec l'id ${id} a été supprimé avec succès !`,
            result: result
        });
    } catch (err) {
        res.status(500).json({
            message: `Echec de la tentative de suppression de l'article : ${err}`,
            req_body: req.body
        });
    }
});

// On lance le serveur express
app.listen(port, () => console.log(`Le serveur écoute le port: ${port}`));
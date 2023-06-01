const mysql = require('mysql');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');

const API_ENDPOINT = "https://api.ipbase.com/v1/json/";
const fetchData = async () => {
    const response = await fetch(API_ENDPOINT);
    const data = await response.json();
    // console.log(data);
    return data;
}

app.get('/', async (req, res) => {

    const data = await fetchData();

    const latitud = data.latitude,
        longitud = data.longitude,
        ciudad = data.city,
        ip = data.ip,
        date = new Date()

    // Conexión a Base de datos Mysql
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'registro'
    })
    
    connection.connect((error) => {
        if(error){
            console.error(error);
        }
    });

    // Ingresa los datos a la tabla
    const sql = `INSERT INTO coordenadas (fecha,latitud,longitud,ciudad,ip) VALUES ('${date}','${latitud}', '${longitud}', '${ciudad}','${ip}')`;
    connection.query(sql, (err) => {  
        if (err) throw err; 
        });

    // Selecciona todos los datos de la Tabla Coordenadas
    connection.query('SELECT * FROM coordenadas', (error, results, fields) => {

        connection.end();

        // Hace el render hacia index.ejs para mostrar los resultados en el HTML cada ves que se regresca la página
        res.render('pages/index', {
            results
        });
    });
});

app.listen(port, () => {
    console.log(`App listening at port ${port}`)
});
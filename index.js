const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(bodyParser.json());

// Endpoint para recibir datos del ESP32
app.post('/api/weather', (req, res) => {
  const weatherData = req.body;

  // Guardar los datos en un archivo JSON
  fs.writeFile('weather.json', JSON.stringify(weatherData, null, 2), (err) => {
    if (err) {
      console.error('Error al guardar los datos:', err);
      return res.status(500).send('Error al guardar los datos');
    }
    console.log('Datos guardados correctamente');
    res.send('Datos guardados correctamente');
  });
});

// Endpoint para servir los datos al cliente web
app.get('/api/weather', (req, res) => {
  fs.readFile('weather.json', (err, data) => {
    if (err) {
      console.error('Error al leer los datos:', err);
      return res.status(500).send('Error al leer los datos');
    }
    res.send(JSON.parse(data));
  });
});

// Endpoint para controlar el LED
app.post('/api/led', (req, res) => {
  const { state } = req.body;
  if (state === "on" || state === "off") {
    fs.writeFile('led_state.json', JSON.stringify({ state }), (err) => {
      if (err) {
        console.error('Error al guardar el estado del LED:', err);
        return res.status(500).send('Error al guardar el estado del LED');
      }
      console.log('Estado del LED guardado correctamente');
      res.send(`LED ${state}`);
    });
  } else {
    res.status(400).send('Estado no válido');
  }
});

// Endpoint para servir el estado del LED
app.get('/api/led', (req, res) => {
  fs.readFile('led_state.json', (err, data) => {
    if (err) {
      console.error('Error al leer el estado del LED:', err);
      return res.status(500).send('Error al leer el estado del LED');
    }
    res.send(JSON.parse(data));
  });
});

// Servir la aplicación web estática
app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

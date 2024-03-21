// handler.js

const axios = require('axios');
const mongoose = require('mongoose');

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.getStarWarsData = async (event, context, callback) => {
  try {

    const queryParams = event.pathParameters;
    console.log(queryParams);
    let id = queryParams.id;
    const response = await axios.get(`https://swapi.py4e.com/api/people/${id}/`);
    const data = response.data;

    try {
      const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Item: {
          id: id.toString(),
          name: JSON.stringify(data)
        },
      };

      // write the todo to the database
      dynamoDb.put(params, (error) => {
        // handle potential errors
        if (error) {
          console.error(error);
          callback(null, {
            statusCode: error.statusCode || 501,
            headers: { 'Content-Type': 'text/plain' },
            body: 'Couldn\'t create the todo item.',
          });
          return;
        }
        // create a response
        const response = {
          statusCode: 200,
          body: JSON.stringify(params.Item),
        };
        callback(null, response);
      });
    } catch (error) {

    }

    // Transformar nombres de atributos a español aquí
    let translateObj = translateAttributesToSpanish(data);
    return {
      statusCode: 200,
      body: JSON.stringify(translateObj)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error)
    };
  }
};

module.exports.createModel = async (event) => {
  try {
    const requestData = JSON.parse(event.body);
    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Item: {
        id: id.toString(),
        name: JSON.stringify(requestData)
      },
    };
    dynamoDb.put(params, (error) => {
      // handle potential errors
      if (error) {
        console.error(error);
        callback(null, {
          statusCode: error.statusCode || 501,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Couldn\'t create the todo item.',
        });
        return;
      }
      // create a response
      const response = {
        statusCode: 200,
        body: JSON.stringify(params.Item),
      };
      callback(null, response);
    });
    return {
      statusCode: 200,
      body: JSON.stringify(newModel)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error)
    };
  }
};

function translateAttributesToSpanish(obj) {
  const translations = {
    name: "nombre",
    height: "altura",
    mass: "masa",
    hair_color: "color_de_cabello",
    skin_color: "color_de_piel",
    eye_color: "color_de_ojos",
    birth_year: "año_de_nacimiento",
    gender: "género",
    homeworld: "planeta_natal",
    films: "películas",
    species: "especies",
    vehicles: "vehículos",
    starships: "naves_espaciales",
    created: "creado",
    edited: "editado",
    url: "url"
  };

  const translatedObj = {};
  for (let key in obj) {
    if (translations[key]) {
      translatedObj[translations[key]] = obj[key];
    } else {
      translatedObj[key] = obj[key];
    }
  }

  return translatedObj;
}


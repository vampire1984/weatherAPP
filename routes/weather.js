var express = require('express');
var router = express.Router();
var httpRequest = require('request');
var moment = require('moment');
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

/* Function for check city and email */
function checkValues(req2) {
    var city1 = 'New York', city2 = 'London', email = req2.email, city = req2.city, cityVal = false, emailVal = false;

    if ((city1 == city) || (city2 == city)) {
       cityVal = true;
    } 

    if (check(email).isEmail()) {
        emailVal = true;
    }

    if (cityVal && emailVal) {
        return true;
    } else {
        return false;
    }
}

/* Function for formating data from get request */
function getFormated(data, body) {
    var json = {};
    json.created = moment(data.created).format('h:mm a');
    json.woeid = body.parent.woeid;
    json.title = body.title;
    json.country = body.parent.title;
    json.sun_rise = moment(body.sun_rise).format('h:mm a');
    json.sun_set = moment(body.sun_set).format('h:mm a');
    json.applicable_date = moment(data.applicable_date).format('Do MMM YYYY');
    json.weather_state_abbr = data.weather_state_abbr;
    json.weather_state_name = data.weather_state_name;
    json.max_temp = Math.round(data.max_temp);
    json.min_temp = Math.round(data.min_temp);
    json.wind_direction_compass = data.wind_direction_compass;
    json.wind_speed = Math.round(data.wind_speed);
    json.humidity = data.humidity;
    json.visibility = parseFloat(data.visibility.toFixed(2));
    json.air_pressure = Math.round(data.air_pressure);
    json.predictability = data.predictability;
    return json;
}
/* GET weather page with check and GET request. */
router.get('', function (req, res, next) {
    if (checkValues(req.query)) {
        var cityNo = (req.query.city == 'London') ? '44418' : '2459115',
            url = 'https://www.metaweather.com/api/location/'+cityNo;
            httpRequest.get(url, function (error, response, body) {
                if (response.statusCode == 201) {
                    res.render('weatherError', { title: 'Server is unavailable at moment. Please try later.' });
                } else {
                    var data = JSON.parse(body),
                        dataToday = data['consolidated_weather'][0],
                        dataFull = getFormated(dataToday, data);
                    res.render('weather', {
                        data: dataFull
                    });
                }
            }
        )
            
    } else {
        res.render('index', { title: 'Welcome to Weather App', email: req.query.email, city: req.query.city, error: 'throwError'} );  
        return;
    }
});
module.exports = router;
'use strict';

/**
 * @ngdoc function
 * @name outthedoorApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the outthedoorApp
 */
angular.module('outthedoorApp')
  .controller('MainCtrl', function ($scope, $http, $interval) {

    var transitInterval = 15000,
        weatherInterval = 300000;

    // Function to get and update transit data.
    var getTransitData = function() {
      $http.get('http://webservices.nextbus.com/service/publicXMLFeed?command=predictionsForMultiStops&a=ttc&useShortTitles=true&stops=504|2253&stops=504|7211&stops=511|7197').
      //$http.get('/publicXMLFeed.xml').
      success(function(data) {
        var x2js = new X2JS({ arrayAccessForm : 'property'});
        var json = x2js.xml_str2json(data);
        // Reset transit array.
        $scope.transit = [];

        // Iterate through our predictions and concatenate arrays.
        json.body.predictions_asArray.forEach(function(prediction) {
          var predictions = [];
          prediction.direction_asArray.forEach(function(direction) {
            predictions = predictions.concat(direction.prediction_asArray);
          });
          // Sort predictions in ascending order.
          predictions.sort(function(a,b) {
            return parseFloat(a._seconds) - parseFloat(b._seconds);
          });
          prediction.predictions = predictions;

          // Update our array text
          if (prediction._stopTag === '2253') {
            prediction._stopTitle = 'East - King St West At Bathurst St';
          }
          if (prediction._stopTag === '7211') {
            prediction._stopTitle = 'West - King St West At Bathurst St';
          }
          if (prediction._stopTag === '7197') {
            prediction._stopTitle = 'North - Bathurst St At King St West';
          }

          $scope.transit = $scope.transit.concat(prediction);
        });
        setTimeout(function(){
          getTransitData();
        }, transitInterval);
      });
    };

    // Function to get and update weather data.
    var getWeatherData = function(){
      $http.get('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20%3D%2012511881%20AND%20u%3D%22c%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys').
      success(function(data) {
        // Reset transit array.
        if (!!data.query.results.channel) {
          var weather = data.query.results.channel;
          // Get the correct temperature
          if (!!weather.wind.chill) {
            $scope.weatherTemp = weather.wind.chill;
          } else {
            $scope.weatherTemp = weather.item.condition.temp;
          }
          $scope.weatherIcon = setWeatherIcon(weather.item.condition.code);
          $scope.weatherDescription = weather.item.condition.text;
        }
        setTimeout(function(){
          getTransitData();
        }, weatherInterval);
      });
    };

    // Map yahoo codes to weather-icons
    // https://gist.githubusercontent.com/aloncarmel/8575527/raw/313aee5cfa2584a8cdbf4c756d0203bccd04d752/weathericon
    function setWeatherIcon(condid) {
      var weatherIcon;
      switch(condid) {
        case '0': weatherIcon = 'wi-tornado';
        break;
        case '1': weatherIcon = 'wi-storm-showers';
        break;
        case '2': weatherIcon = 'wi-tornado';
        break;
        case '3': weatherIcon = 'wi-thunderstorm';
        break;
        case '4': weatherIcon = 'wi-thunderstorm';
        break;
        case '5': weatherIcon = 'wi-snow';
        break;
        case '6': weatherIcon = 'wi-rain-mix';
        break;
        case '7': weatherIcon = 'wi-rain-mix';
        break;
        case '8': weatherIcon = 'wi-sprinkle';
        break;
        case '9': weatherIcon = 'wi-sprinkle';
        break;
        case '10': weatherIcon = 'wi-hail';
        break;
        case '11': weatherIcon = 'wi-showers';
        break;
        case '12': weatherIcon = 'wi-showers';
        break;
        case '13': weatherIcon = 'wi-snow';
        break;
        case '14': weatherIcon = 'wi-storm-showers';
        break;
        case '15': weatherIcon = 'wi-snow';
        break;
        case '16': weatherIcon = 'wi-snow';
        break;
        case '17': weatherIcon = 'wi-hail';
        break;
        case '18': weatherIcon = 'wi-hail';
        break;
        case '19': weatherIcon = 'wi-cloudy-gusts';
        break;
        case '20': weatherIcon = 'wi-fog';
        break;
        case '21': weatherIcon = 'wi-fog';
        break;
        case '22': weatherIcon = 'wi-fog';
        break;
        case '23': weatherIcon = 'wi-cloudy-gusts';
        break;
        case '24': weatherIcon = 'wi-cloudy-windy';
        break;
        case '25': weatherIcon = 'wi-thermometer';
        break;
        case '26': weatherIcon = 'wi-cloudy';
        break;
        case '27': weatherIcon = 'wi-night-cloudy';
        break;
        case '28': weatherIcon = 'wi-day-cloudy';
        break;
        case '29': weatherIcon = 'wi-night-cloudy';
        break;
        case '30': weatherIcon = 'wi-day-cloudy';
        break;
        case '31': weatherIcon = 'wi-night-clear';
        break;
        case '32': weatherIcon = 'wi-day-sunny';
        break;
        case '33': weatherIcon = 'wi-night-clear';
        break;
        case '34': weatherIcon = 'wi-day-sunny-overcast';
        break;
        case '35': weatherIcon = 'wi-hail';
        break;
        case '36': weatherIcon = 'wi-day-sunny';
        break;
        case '37': weatherIcon = 'wi-thunderstorm';
        break;
        case '38': weatherIcon = 'wi-thunderstorm';
        break;
        case '39': weatherIcon = 'wi-thunderstorm';
        break;
        case '40': weatherIcon = 'wi-storm-showers';
        break;
        case '41': weatherIcon = 'wi-snow';
        break;
        case '42': weatherIcon = 'wi-snow';
        break;
        case '43': weatherIcon = 'wi-snow';
        break;
        case '44': weatherIcon = 'wi-cloudy';
        break;
        case '45': weatherIcon = 'wi-lightning';
        break;
        case '46': weatherIcon = 'wi-snow';
        break;
        case '47': weatherIcon = 'wi-thunderstorm';
        break;
        case '3200': weatherIcon = 'wi-cloud';
        break;
        default: weatherIcon = 'wi-cloud';
        break;
      }
      return weatherIcon;
    }

    // Update the realtime clock.
    var updateTime = function() {
      $scope.date = new Date();
    };
    $interval(updateTime, 1000);

    // Perform initial data fetch.
    getTransitData();
    getWeatherData();
    updateTime();
  });

import React from 'react';
import './App.css';
import axios from 'axios';
const ccxt = require('ccxt');

function App() {
  const [time, setTime] = React.useState(Date());
  const [hours, setHours] = React.useState(Date());
  const [date, setDate] = React.useState(Date());
  const [weather, setWeather] = React.useState({
    location: undefined,
    temperature: undefined,
    weather: undefined,
    icon: undefined,
  });
  const [fx, setFx] = React.useState({
    btc: undefined,
    rub: undefined,
    gbp: undefined,
  });
  const [articles, setArticles] = React.useState({
    article1: undefined,
    article2: undefined,
    article3: undefined,
  });

  const getTime = () => {
    const today = new Date();
    const time =
      today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    setTime(time);
    setTimeout(getTime, 1000);
  };
  const getHours = () => {
    const today = new Date();
    const hours = today.getHours();
    setHours(hours);
    setTimeout(getHours, 1000);
  };
  const getDate = () => {
    const today = new Date();
    const date =
      today.getDate() +
      '/' +
      (today.getMonth() + 1) +
      '/' +
      today.getFullYear();
    setDate(date);
    setTimeout(getDate, 1000);
  };

  React.useEffect(() => {
    getTime();
    getHours();
    getDate();
  }, [time]);

  React.useEffect(() => {
    const getWeather = async () => {
      const response = await axios.get(
        'http://api.openweathermap.org/data/2.5/weather?lat=51.503997123761394&lon=-0.2010926482705607&appid=00d7999bc4292d35f071cd0dd83f4252&units=metric'
      );
      const location = response.data.name;
      const temperature = response.data.main.temp;
      const weather = response.data.weather[0].main;
      const icon = response.data.weather[0].icon;
      setWeather({
        location: location,
        temperature: temperature,
        weather: weather,
        icon: icon,
      });
    };
    getWeather();
    const interval = setInterval(() => getWeather(), 3600000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  React.useEffect(() => {
    const getFx = async () => {
      const market = new ccxt.binance();
      await market.loadMarkets();
      const symbol1 = 'BTC/USDT';
      const symbol2 = 'USDT/RUB';
      const symbol3 = 'GBP/USDT';
      const [orderbook1, orderbook2, orderbook3] = await Promise.all([
        market.fetchL2OrderBook(symbol1, 10),
        market.fetchL2OrderBook(symbol2, 10),
        market.fetchL2OrderBook(symbol3, 10),
      ]);

      const btcusdt = orderbook1.asks[0][0];
      const usdtrub = orderbook2.asks[0][0];
      const gbpusdt = orderbook3.asks[0][0];

      setFx({
        btc: btcusdt,
        rub: usdtrub,
        gbp: gbpusdt,
      });
    };
    getFx();
    const interval = setInterval(() => getFx(), 10000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  React.useEffect(() => {
    const getNews = async () => {
      const response = await axios.get(
        'https://newsapi.org/v2/top-headlines?sources=bloomberg&apiKey=1d9a7f0e91bf49eb8b4a463cfd4a1ac0'
      );
      const article1 = response.data.articles[0].title;
      const article2 = response.data.articles[1].title;
      const article3 = response.data.articles[2].title;

      setArticles({
        article1: article1,
        article2: article2,
        article3: article3,
      });
    };
    getNews();
    const interval = setInterval(() => getNews(), 3600000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="App">
      <div className="left">
        <div className="topLeft">
          <span className="time">
            <h3 style={{ fontSize: 60, marginTop: '50px' }}>{time}</h3>
          </span>
          <span style={{ fontSize: 30, marginTop: '-60px' }}>{date}</span>
        </div>
        <div className="bottomLeft">
          <img
            src={`http://openweathermap.org/img/wn/${weather.icon}.png`}
            alt="none"
            style={{ width: '75px', height: '75px' }}
          />
          <h3 style={{ fontSize: 80, marginTop: -10 }}>
            {Math.round(weather.temperature)} &#8451;
          </h3>
          <h6 style={{ fontSize: 30, marginTop: -50 }}>
            {weather.weather} in {weather.location}
          </h6>
        </div>
      </div>
      <div className="right">
        <div className="topRight">
          <h2 style={{ fontSize: 30, marginLeft: 5, marginTop: -5 }}>
            {hours <= 12 ? (
              <p>Good Morning Mr Kushner</p>
            ) : hours >= 12 && hours < 18 ? (
              <p>Good Afternoon Mr Kushner</p>
            ) : hours >= 18 ? (
              <p>Good Evening Mr Kushner</p>
            ) : (
              <p>Good Day Mr Kushner</p>
            )}
          </h2>
          <h3 style={{ fontSize: 25, marginLeft: 5, marginTop: -20 }}>
            Top news for you this hour:
          </h3>
          <ul style={{ fontSize: 20, marginTop: -20, listStyle: 'square' }}>
            <li style={{ marginTop: 5 }}>{articles.article1}</li>
            <li style={{ marginTop: 5 }}>{articles.article2}</li>
            <li style={{ marginTop: 5 }}>{articles.article3}</li>
          </ul>
        </div>
        <div className="bottomRight">
          <ul style={{ fontSize: 20, marginTop: -20, listStyle: 'square' }}>
            <li>BTC/USDT: {fx.btc}</li>
            <li>USD/RUB: {fx.rub}</li>
            <li>GBP/USD: {fx.gbp}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;

{
  /* <div>
        {hours <= 12 ? (
          <p>Good Morning Mr Kushner!</p>
        ) : hours >= 12 && hours < 18 ? (
          <p>Good Afternoon Mr Kushner!</p>
        ) : hours >= 18 ? (
          <p>Good Evening Mr Kushner!</p>
        ) : (
          <p>Good Day Mr Kushner!</p>
        )}
      </div>
      <div>
        <p>Today is {date}</p>
      </div>
      <div>
        <p>The time is {time}</p>
      </div>
      <div>
        Weather is:
        <ul>
          <li>Location: {weather.location}</li>
          <li>Temperature: {weather.temperature}</li>
          <li>Weather: {weather.weather}</li>
          <li>
            Icon:
            {
              <img
                src={`http://openweathermap.org/img/wn/${weather.icon}.png`}
                alt="none"
              />
            }
          </li>
        </ul>
      </div>
      <div>
        <ul>
          <li>BTC/USDT: {fx.btc}</li>
          <li>USD/RUB: {fx.rub}</li>
          <li>GBP/USD: {fx.gbp}</li>
        </ul>
      </div>
      <div>
        <h3>{articles.article1}</h3>
        <h3>{articles.article2}</h3>
        <h3>{articles.article3}</h3>
      </div> */
}

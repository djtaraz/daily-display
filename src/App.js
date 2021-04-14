import React from 'react';
import './App.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDollarSign,
  faRubleSign,
  faPoundSign,
} from '@fortawesome/free-solid-svg-icons';
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
    // eslint-disable-next-line
  }, [time]);

  React.useEffect(() => {
    const getWeather = async () => {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=51.503997123761394&lon=-0.2010926482705607&appid=${process.env.REACT_APP_OPENWEATHER_KEY}&units=metric`
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
        `https://gnews.io/api/v4/top-headlines?lang=en&token=${process.env.REACT_APP_GNEWS_KEY}`
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
    <div className="App" id="App">
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
          <h2
            style={{
              fontSize: 30,
              marginLeft: 15,
              marginTop: -5,
              borderBottom: '#0b4f9a solid 2px',
            }}
          >
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
          <ul style={{ fontSize: 20, marginTop: -20, listStyle: 'square' }}>
            <li style={{ marginTop: 5 }}>{articles.article1}</li>
            <li style={{ marginTop: 5 }}>{articles.article2}</li>
            <li style={{ marginTop: 5 }}>{articles.article3}</li>
          </ul>
        </div>
        <div className="bottomRight">
          <div style={{ fontSize: 25, marginTop: -33 }}>
            <h4 style={{ paddingLeft: 20, paddingTop: 5 }}>
              {
                <FontAwesomeIcon
                  style={{ color: '#FFD700' }}
                  icon={faDollarSign}
                />
              }{' '}
              1 ={' '}
              {
                <FontAwesomeIcon
                  style={{ color: '#FFD700' }}
                  icon={faRubleSign}
                />
              }{' '}
              {fx.rub}
            </h4>
            <h4 style={{ paddingLeft: 20, marginTop: -12 }}>
              {
                <FontAwesomeIcon
                  style={{ color: '#FFD700' }}
                  icon={faPoundSign}
                />
              }{' '}
              1 ={' '}
              <FontAwesomeIcon
                style={{ color: '#FFD700' }}
                icon={faDollarSign}
              />{' '}
              {fx.gbp}
            </h4>
            <h4 style={{ paddingLeft: 20, marginTop: -12 }}>
              {<i style={{ color: '#FFD700' }} className="fab fa-btc"></i>} 1 ={' '}
              {
                <FontAwesomeIcon
                  style={{ color: '#FFD700' }}
                  icon={faDollarSign}
                />
              }{' '}
              {fx.btc}
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

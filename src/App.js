import { useEffect, useState } from 'react'
import './App.css';
import axios from 'axios';

import ShareButtons from './components/ShareButtons';
import QuoteRating from './components/QuoteRating';

function App() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [quote, setQuote] = useState()

  useEffect(() => {
    setLoading(true)
    setError(false)
    let cancel
    axios({
      method: 'GET',
      url: 'http://quotes.stormconsultancy.co.uk/random.json',
      cancelToken: new axios.CancelToken(c => cancel = c)
    }).then(res => {
      setQuote(res.data)
      setLoading(false)
    }).catch(e => {
      if (axios.isCancel(e)) return
      setError(true)
    })
    return () => cancel()
  },[]);

  function handleGetNewQuote(e) {
    if(loading === true || error === true) return
    setLoading(true)
    setError(false)
    axios({
      method: 'GET',
      url: 'http://quotes.stormconsultancy.co.uk/random.json',
    }).then(res => {
      setQuote(res.data)
      setLoading(false)
    }).catch(e => {
      if (axios.isCancel(e)) return
      setError(true)
    })
  }

  return (
    <div className="App">
      <h1><img id="logo" src="/kabisa-logo-b729c8fe.svg" alt='Kabisa'></img>quote app</h1>
      {!loading && <h2>{quote?.quote}</h2>}
      {loading && <div> 'Loading...'</div>}
      {error && <div>'Error'</div>}
      
      {quote && <ShareButtons quote={quote?.quote} />}
      {quote && <QuoteRating quoteId={quote?.id}></QuoteRating>}
      <button onClick={handleGetNewQuote}>New Quote</button>
    </div>
  );
}

export default App;

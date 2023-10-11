import requests
from bs4 import BeautifulSoup
import time

# Initialize an empty cache dictionary
stock_cache = {}

def get_cached_price(ticker):
    # Check if ticker is in cache
    if ticker in stock_cache:
        cached_data = stock_cache[ticker]
        # Invalidate cache if older than 60 seconds
        if time.time() - cached_data['time'] < 60:
            return cached_data['price']
    return None

def set_cached_price(ticker, price):
    stock_cache[ticker] = {'price': price, 'time': time.time()}


def fetch_stock_prices(tickers):
    prices = {}
    headers = {'User-Agent': 'Mozilla/5.0'}

    for ticker in tickers:
        # Try to get price from cache first
        cached_price = get_cached_price(ticker)
        if cached_price:
            prices[ticker] = cached_price
            continue

        # Build the URL for each ticker
        url = f"https://finance.yahoo.com/quote/{ticker}?p={ticker}&.tsrc=fin-srch"

        # Fetch the webpage
        response = requests.get(url, headers=headers)

        # Create a BeautifulSoup object
        soup = BeautifulSoup(response.text, 'html.parser')

        parent_div = soup.find("div", {"class": "D(ib) Va(m) Maw(65%) Ov(h)"})

        if parent_div is not None:
            price_streamer = parent_div.find("fin-streamer", {"data-field": "regularMarketPrice"})
            if price_streamer is not None:
                prices[ticker] = price_streamer.text
            else:
                prices[ticker] = "Not Found (inside div)"
        else:
            prices[ticker] = "Not Found (div missing)"

        # Cache the fetched price
        set_cached_price(ticker, prices[ticker])

    return prices


if __name__ == "__main__":
    print(fetch_stock_price())


from flask import Flask, jsonify, request, render_template
from stock_scraper import fetch_stock_prices  # Make sure to import your actual scraper function
import csv
from flask_cors import CORS



def load_ticker_mapping(filename):
    ticker_map = {}
    with open(filename, mode='r') as infile:
        reader = csv.reader(infile)
        header = next(reader)  # Skip the header
        for row in reader:
            ticker_map[row[1].lower()] = row[0]  # Map company name to ticker
    return ticker_map

ticker_map = load_ticker_mapping('tickers.csv')  # Adjust the filename if needed
print(list(ticker_map.items())[:5])  # print first 5 items in the ticker_map

app = Flask(__name__)
CORS(app, origins=["http://127.0.0.1:5000"])


@app.route('/')
def home():
    return render_template('index.html')

@app.route('/stocks_by_name', methods=['GET'])
def stock_prices_by_name():
    names = request.args.get('names')
    if not names:
        return jsonify({"error": "No company names provided"}), 400

    names_list = names.lower().split(',')
    tickers_list = [ticker_map.get(name, "Unknown") for name in names_list]

    print("Tickers List:", tickers_list)  # Debugging line

    # Remove "Unknown" tickers
    tickers_list = [ticker for ticker in tickers_list if ticker != "Unknown"]

    if not tickers_list:
        return jsonify({"error": "No valid tickers found for provided names"}), 400

    price_data = fetch_stock_prices(tickers_list)
    return jsonify(price_data)




@app.route('/stocks', methods=['GET'])
def stock_prices():
    tickers = request.args.get('tickers')
    if not tickers:
        return jsonify({"error": "No tickers provided"}), 400

    tickers_list = tickers.split(',')
    price_data = fetch_stock_prices(tickers_list)
    return jsonify(price_data)

# ... (your existing imports and setup code)

@app.route('/suggest', methods=['GET'])
def suggest_company_names():
    partial_name = request.args.get('partial_name', '').lower()
    print(f"Partial name received: {partial_name}")  # Debugging line

    # New Filtering logic
    starts_with = {}
    contains = {}
    for name, ticker in ticker_map.items():
        if name.startswith(partial_name):
            starts_with[name] = ticker
        elif partial_name in name:
            contains[name] = ticker

    # Sort both dictionaries by their keys (company names)
    starts_with = dict(sorted(starts_with.items()))
    contains = dict(sorted(contains.items()))

    # Combine the two dictionaries, with 'starts_with' coming first
    matched_companies = {**starts_with, **contains}

    # Limit to 8 results (or you can adjust the number as needed)
    matched_companies = dict(list(matched_companies.items())[:8])

    print(f"Matched Companies: {matched_companies}")  # Debugging line

    return jsonify({"matched_companies": matched_companies})

# ... (your other existing routes)



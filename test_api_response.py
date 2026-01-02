import requests
import json

def test_api():
    url = "http://localhost:8000/products/"
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        
        print(f"Total products: {data.get('total')}")
        if data.get('items'):
            first_product = data['items'][0]
            print(f"First product name: {first_product.get('name')}")
            print(f"First product specs: {first_product.get('specs')}")
            print(f"First product images: {first_product.get('images')}")
            
            # Check if any product has specs
            products_with_specs = [p for p in data['items'] if p.get('specs')]
            print(f"Products with specs: {len(products_with_specs)}")
            if products_with_specs:
                print(f"Example specs: {products_with_specs[0].get('specs')}")
                
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_api()

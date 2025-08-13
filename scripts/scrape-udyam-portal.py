import requests
from bs4 import BeautifulSoup
import json
import re
from urllib.parse import urljoin

def scrape_udyam_form():
    """
    Scrape the Udyam registration portal to extract form fields, validation rules, and UI structure
    """
    url = "https://udyamregistration.gov.in/UdyamRegistration.aspx"
    
    try:
        # Set headers to mimic a real browser
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
        }
        
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Extract form structure
        form_data = {
            "steps": [],
            "validation_rules": {},
            "ui_components": {},
            "form_fields": []
        }
        
        # Find all forms on the page
        forms = soup.find_all('form')
        
        for form in forms:
            # Extract input fields
            inputs = form.find_all(['input', 'select', 'textarea'])
            
            for input_field in inputs:
                field_info = extract_field_info(input_field)
                if field_info:
                    form_data["form_fields"].append(field_info)
        
        # Extract validation patterns from JavaScript
        scripts = soup.find_all('script')
        for script in scripts:
            if script.string:
                validation_patterns = extract_validation_patterns(script.string)
                form_data["validation_rules"].update(validation_patterns)
        
        # Extract UI components (buttons, labels, etc.)
        ui_components = extract_ui_components(soup)
        form_data["ui_components"] = ui_components
        
        # Define the two main steps based on Udyam registration process
        form_data["steps"] = [
            {
                "step": 1,
                "title": "Aadhaar Verification",
                "description": "Enter Aadhaar number and verify with OTP",
                "fields": ["aadhaar_number", "otp"]
            },
            {
                "step": 2,
                "title": "PAN Verification", 
                "description": "Enter PAN details for verification",
                "fields": ["pan_number", "name_as_per_pan"]
            }
        ]
        
        # Add known validation rules for Indian government forms
        form_data["validation_rules"].update({
            "aadhaar_pattern": r"^\d{4}\s?\d{4}\s?\d{4}$",
            "pan_pattern": r"^[A-Z]{5}[0-9]{4}[A-Z]{1}$",
            "otp_pattern": r"^\d{6}$",
            "mobile_pattern": r"^[6-9]\d{9}$"
        })
        
        return form_data
        
    except requests.RequestException as e:
        print(f"Error fetching the page: {e}")
        return create_fallback_schema()
    except Exception as e:
        print(f"Error parsing the page: {e}")
        return create_fallback_schema()

def extract_field_info(input_field):
    """Extract information about a form field"""
    field_info = {
        "name": input_field.get('name', ''),
        "id": input_field.get('id', ''),
        "type": input_field.get('type', 'text'),
        "placeholder": input_field.get('placeholder', ''),
        "required": input_field.has_attr('required'),
        "maxlength": input_field.get('maxlength', ''),
        "pattern": input_field.get('pattern', ''),
        "class": input_field.get('class', [])
    }
    
    # Find associated label
    if field_info["id"]:
        label = input_field.find_parent().find('label', {'for': field_info["id"]})
        if label:
            field_info["label"] = label.get_text(strip=True)
    
    return field_info if field_info["name"] or field_info["id"] else None

def extract_validation_patterns(script_content):
    """Extract validation patterns from JavaScript code"""
    patterns = {}
    
    # Common patterns to look for
    pattern_searches = [
        (r'aadhaar.*?pattern.*?["\']([^"\']+)["\']', 'aadhaar_pattern'),
        (r'pan.*?pattern.*?["\']([^"\']+)["\']', 'pan_pattern'),
        (r'otp.*?pattern.*?["\']([^"\']+)["\']', 'otp_pattern'),
        (r'mobile.*?pattern.*?["\']([^"\']+)["\']', 'mobile_pattern')
    ]
    
    for pattern_regex, key in pattern_searches:
        match = re.search(pattern_regex, script_content, re.IGNORECASE)
        if match:
            patterns[key] = match.group(1)
    
    return patterns

def extract_ui_components(soup):
    """Extract UI components like buttons, headings, etc."""
    components = {
        "buttons": [],
        "headings": [],
        "labels": [],
        "error_messages": []
    }
    
    # Extract buttons
    buttons = soup.find_all(['button', 'input[type="submit"]', 'input[type="button"]'])
    for button in buttons:
        components["buttons"].append({
            "text": button.get_text(strip=True) or button.get('value', ''),
            "type": button.get('type', 'button'),
            "class": button.get('class', [])
        })
    
    # Extract headings
    headings = soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
    for heading in headings:
        components["headings"].append({
            "level": heading.name,
            "text": heading.get_text(strip=True),
            "class": heading.get('class', [])
        })
    
    # Extract labels
    labels = soup.find_all('label')
    for label in labels:
        components["labels"].append({
            "text": label.get_text(strip=True),
            "for": label.get('for', ''),
            "class": label.get('class', [])
        })
    
    return components

def create_fallback_schema():
    """Create a fallback schema based on known Udyam registration requirements"""
    return {
        "steps": [
            {
                "step": 1,
                "title": "Aadhaar Verification",
                "description": "Enter your Aadhaar number and verify with OTP",
                "fields": [
                    {
                        "name": "aadhaar_number",
                        "label": "Aadhaar Number",
                        "type": "text",
                        "required": True,
                        "pattern": r"^\d{4}\s?\d{4}\s?\d{4}$",
                        "placeholder": "Enter 12-digit Aadhaar number",
                        "maxlength": "14"
                    },
                    {
                        "name": "mobile_number",
                        "label": "Mobile Number",
                        "type": "tel",
                        "required": True,
                        "pattern": r"^[6-9]\d{9}$",
                        "placeholder": "Enter 10-digit mobile number",
                        "maxlength": "10"
                    },
                    {
                        "name": "otp",
                        "label": "OTP",
                        "type": "text",
                        "required": True,
                        "pattern": r"^\d{6}$",
                        "placeholder": "Enter 6-digit OTP",
                        "maxlength": "6"
                    }
                ]
            },
            {
                "step": 2,
                "title": "PAN Verification",
                "description": "Enter your PAN details for verification",
                "fields": [
                    {
                        "name": "pan_number",
                        "label": "PAN Number",
                        "type": "text",
                        "required": True,
                        "pattern": r"^[A-Z]{5}[0-9]{4}[A-Z]{1}$",
                        "placeholder": "Enter PAN number (e.g., ABCDE1234F)",
                        "maxlength": "10"
                    },
                    {
                        "name": "name_as_per_pan",
                        "label": "Name as per PAN",
                        "type": "text",
                        "required": True,
                        "placeholder": "Enter name exactly as per PAN card"
                    },
                    {
                        "name": "date_of_birth",
                        "label": "Date of Birth",
                        "type": "date",
                        "required": True
                    }
                ]
            }
        ],
        "validation_rules": {
            "aadhaar_pattern": r"^\d{4}\s?\d{4}\s?\d{4}$",
            "pan_pattern": r"^[A-Z]{5}[0-9]{4}[A-Z]{1}$",
            "otp_pattern": r"^\d{6}$",
            "mobile_pattern": r"^[6-9]\d{9}$"
        },
        "ui_components": {
            "primary_color": "#1e40af",
            "secondary_color": "#64748b",
            "success_color": "#16a34a",
            "error_color": "#dc2626",
            "buttons": {
                "primary": "bg-blue-600 hover:bg-blue-700 text-white",
                "secondary": "bg-gray-200 hover:bg-gray-300 text-gray-900"
            }
        }
    }

if __name__ == "__main__":
    print("Scraping Udyam registration portal...")
    form_data = scrape_udyam_form()
    
    # Save to JSON file
    with open('udyam-form-schema.json', 'w', encoding='utf-8') as f:
        json.dump(form_data, f, indent=2, ensure_ascii=False)
    
    print("Form schema saved to udyam-form-schema.json")
    print(f"Found {len(form_data.get('form_fields', []))} form fields")
    print(f"Extracted {len(form_data.get('validation_rules', {}))} validation rules")

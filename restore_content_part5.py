
import io

def inject_content():
    try:
        # Read the file with UTF-8 encoding
        with io.open(path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Regular expression to replace contentData object
        # We look for 'const contentData = {' and the closing '};'
        content_pattern = re.compile(r'const contentData = \{.*?\};', re.DOTALL)
        
        # Convert dictionary to JS formatted string
        # We use ensure_ascii=False to keep the emojis and characters intact
        js_content_string = "const contentData = " + json.dumps(content_data, ensure_ascii=False, indent=4) + ";"
        
        # Fix JS syntax (keys in JSON are strings, but we want them to look like JS keys if possible, 
        # but valid JSON is also valid JS, so we keep it simple. Only change is double quotes to single if preferred, 
        # but standard JSON is fine for JS execution)
        
        # Replace in content
        new_content = content_pattern.sub(js_content_string, content)

        # Regular expression to replace packagesData object
        packages_pattern = re.compile(r'const packagesData = \{.*?\};', re.DOTALL)
        js_packages_string = "const packagesData = " + json.dumps(packages_data, ensure_ascii=False, indent=4) + ";"
        
        new_content = packages_pattern.sub(js_packages_string, new_content)

        # Write back with UTF-8
        with io.open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print("Successfully restored content and packages data.")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    inject_content()


try:
    with open('index.html', 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # Script starts at line 621 (0-indexed: 620)
    # <script> // SUPABASE CONFIGURATION
    # content starts after that.
    # Ends at line 1096 (0-indexed: 1095)
    # </script>
    
    # We want lines 621 to 1095 inclusive (1-indexed) => indices 620 to 1095
    # Wait, line 620 is <script>. 
    # Let's verify line content.
    if '<script> // SUPABASE CONFIGURATION' in lines[619]:
        start = 620
    elif '<script> // SUPABASE CONFIGURATION' in lines[620]: # user might have line numbers off by 1?
        # view_file said 620: ...
        start = 621 # content starts
    else:
        # Search for it
        for i, line in enumerate(lines):
            if '<script> // SUPABASE CONFIGURATION' in line:
                start = i + 1
                break
        else:
            print("Could not find start of script")
            exit(1)

    # Search for end
    end = 0
    for i in range(start, len(lines)):
        if '</script>' in lines[i]:
            end = i
            break
            
    script_content = lines[start:end]
    
    with open('debug_script.js', 'w', encoding='utf-8') as f:
        f.writelines(script_content)
        
    print(f"Extracted script to debug_script.js ({len(script_content)} lines)")

except Exception as e:
    print(f"Error: {e}")

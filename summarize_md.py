import os

def read_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        return file.read()

def summarize_content(content):
    # This is a simple summarization function. You can enhance it as needed.
    lines = content.split('\n')
    summary = []
    for line in lines:
        if line.startswith('#'):
            summary.append(line)
        elif line.strip() and not line.startswith('```'):
            summary.append(line)
    return '\n'.join(summary)

def main():
    file_path = r"C:\Users\Mralo\OneDrive\Desktop\development-guide.md"
    
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return
    
    content = read_file(file_path)
    summary = summarize_content(content)
    
    summary_file_path = r"C:\Users\Mralo\OneDrive\Desktop\development-guide-summary.md"
    with open(summary_file_path, 'w', encoding='utf-8') as file:
        file.write(summary)
    
    print(f"Summary has been written to: {summary_file_path}")

if __name__ == "__main__":
    main()

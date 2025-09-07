import sys
import os
sys.path.append('game-rules-flask-backend')

try:
    import PyPDF2
    with open('game-rules-flask-backend/catan_base_rules.pdf', 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        print(f'PDF loaded successfully: {len(reader.pages)} pages')
        print(f'First page preview: {reader.pages[0].extract_text()[:200]}...')
        print('PDF processing test: PASSED')
except Exception as e:
    print(f'PDF processing test: FAILED - {e}')

import os
from devin import load_prompt_template

def test_template_loading():
    print("Testing template loading functionality...")
    
    result = load_prompt_template("scope_prompt", 
                                issue_title="Test Issue Title", 
                                issue_body="Test issue description")
    
    print("Scope template result:")
    print(result)
    print("\n" + "="*50 + "\n")
    
    result2 = load_prompt_template("solve_prompt")
    print("Solve template result:")
    print(result2)
    
    print("\nTemplate loading test completed!")

if __name__ == "__main__":
    test_template_loading()

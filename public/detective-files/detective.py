import anthropic
import os
from pathlib import Path

def read_crime_scene():
    """Read the crime scene description from file"""
    with open('crime_scene.txt', 'r') as f:
        return f.read()

def read_evidence_files():
    """Read all files from the evidence folder"""
    evidence_dir = Path('evidence')
    evidence_files = {}

    if evidence_dir.exists() and evidence_dir.is_dir():
        for file_path in sorted(evidence_dir.glob('*.txt')):
            with open(file_path, 'r') as f:
                evidence_files[file_path.name] = f.read()

    return evidence_files

def format_evidence_content(crime_scene_text, evidence_files):
    """Format all content with clear labels for each file"""
    formatted_content = "=" * 80 + "\n"
    formatted_content += "CRIME SCENE REPORT\n"
    formatted_content += "=" * 80 + "\n\n"
    formatted_content += crime_scene_text + "\n\n"

    if evidence_files:
        formatted_content += "=" * 80 + "\n"
        formatted_content += "ADDITIONAL EVIDENCE FILES\n"
        formatted_content += "=" * 80 + "\n\n"

        for filename, content in evidence_files.items():
            formatted_content += "-" * 80 + "\n"
            formatted_content += f"SOURCE: {filename.upper()}\n"
            formatted_content += "-" * 80 + "\n"
            formatted_content += content + "\n\n"

    return formatted_content

def solve_crime(crime_scene_text, evidence_files):
    """Send crime scene and evidence to Claude for analysis"""

    # Initialize the Anthropic client
    client = anthropic.Anthropic(
        api_key=os.environ.get("ANTHROPIC_API_KEY")
    )

    system_prompt = """Role: You are a world-renowned detective, expert in solving difficult and clueless crime scenes. Your personality is like Benoit Blanc (Knives Out) - polite, dramatic and sharp.

Task: Solve a murder crime scene with multiple evidence sources.

Instructions:
1. Chain of thoughts - before you conclude, briefly describe your suspicion for every character
2. Motives - every character has a potential motive
3. Ranking - rank the suspicion probability (1-10) for every suspect. Give a higher weight for characters that are more close to the victim (family/business relation), and how likely they would murder the victim
4. Weapon - try to understand the weapon used
5. CONTRADICTIONS ANALYSIS - This is critical! You must:
   - Identify ALL contradictions between different evidence sources
   - Note timeline mismatches between witness statements and forensic evidence
   - Highlight inconsistencies in witness testimonies (when they change their stories)
   - Compare physical evidence against witness claims
   - Determine which contradictions are significant vs. innocent mistakes
   - Use contradictions to identify who is lying and why
   - Create a timeline that reconciles or explains the contradictions

Format your analysis with these sections:
- Chain of Thoughts (each suspect)
- Contradictions Discovered (be thorough and specific)
- Timeline Reconstruction (reconcile the contradictions)
- Motives Analysis
- Ranking (1-10 for each suspect)
- Final Conclusion

Tone: Always be a gentleman. Be theatrical but thorough."""

    # Format all content with clear labels
    formatted_content = format_evidence_content(crime_scene_text, evidence_files)

    # Create message with Claude
    message = client.messages.create(
        model="claude-sonnet-4-5-20250929",
        max_tokens=8000,
        system=system_prompt,
        messages=[
            {
                "role": "user",
                "content": f"Please analyze this crime scene and all evidence files, paying special attention to contradictions:\n\n{formatted_content}"
            }
        ]
    )

    return message.content[0].text

def main():
    print("=" * 80)
    print("DETECTIVE AI - ADVANCED CRIME SCENE ANALYSIS")
    print("=" * 80)
    print("\nReading crime scene file...")

    # Read the crime scene
    crime_scene = read_crime_scene()
    print("✓ Crime scene loaded")

    # Read evidence files
    print("\nReading evidence files...")
    evidence_files = read_evidence_files()

    if evidence_files:
        print(f"✓ Found {len(evidence_files)} evidence file(s):")
        for filename in evidence_files.keys():
            print(f"  - {filename}")
    else:
        print("⚠ No evidence files found in /evidence folder")

    print("\nConsulting with Detective Claude...")
    print("(This may take a moment due to the complexity of the case)")
    print("=" * 80)

    # Get Claude's analysis
    analysis = solve_crime(crime_scene, evidence_files)

    # Display the result
    print(analysis)
    print("\n" + "=" * 80)

if __name__ == "__main__":
    main()

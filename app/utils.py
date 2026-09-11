from pwdlib import PasswordHash
import re


# Password hashing
password_hash = PasswordHash.recommended()


def hash_password(password: str) -> str:
    return password_hash.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str
) -> bool:
    return password_hash.verify(
        plain_password,
        hashed_password
    )


# Resume parsing
def parse_resume_text(text: str):
    return {
        "name": extract_name(text),
        "email": extract_email(text),
        "phone": extract_phone(text),
        "skills": extract_skills(text),
        "education": [],
        "experience": []
    }


def extract_email(text: str):
    match = re.search(
        r'[\w.-]+@[\w.-]+\.\w+',
        text
    )

    return match.group(0) if match else None


def extract_phone(text: str):
    match = re.search(
        r'(\+91[- ]?)?[6-9]\d{9}',
        text
    )

    return match.group(0) if match else None


def extract_name(text: str):
    lines = [
        line.strip()
        for line in text.split("\n")
        if line.strip()
    ]

    return lines[0] if lines else None


def extract_skills(text: str):
    common_skills = [
        "Python",
        "Java",
        "JavaScript",
        "React",
        "SQL",
        "FastAPI",
        "Spring Boot",
        "Docker",
        "AWS",
        "Git",
        "PHP"
    ]

    found = []

    for skill in common_skills:
        if skill.lower() in text.lower():
            found.append(skill)

    return found
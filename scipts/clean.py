import json
import re
from pathlib import Path

# Load JSON data from outfile5.json
with Path('outfile5.json').open() as f:
    courses = json.load(f)

# Define a regex for a valid course id.
# This pattern matches strings like "MA 232" or "MA-222".
course_id_regex = re.compile(r'^[A-Z]+[ -]\d{3}$')

def is_valid_course_id(item):
    """Return True if item is a string that matches the course id pattern."""
    if isinstance(item, str):
        return course_id_regex.fullmatch(item.strip()) is not None
    return False

invalid_courses = []

for course in courses:
    prereqs = course.get('prereqs', [])
    invalid_entries = []

    # Iterate over each entry in the prereqs list.
    for entry in prereqs:
        # If the entry is a list (denoting multiple valid options)
        if isinstance(entry, list):
            # Check if all elements in the list are valid course ids.
            if not all(is_valid_course_id(sub) for sub in entry):
                invalid_entries.append(entry)
        # If the entry is a string, check it directly.
        elif isinstance(entry, str):
            if not is_valid_course_id(entry):
                invalid_entries.append(entry)
        else:
            # If the entry is neither a list nor a string, flag it.
            invalid_entries.append(entry)

    # If we found any invalid prereq entries for this course, record it.
    if invalid_entries:
        invalid_courses.append({
            "course_id": course.get("course_id"),
            "prereqs": prereqs,
            "invalid_entries": invalid_entries
        })

# Write out the list of courses with invalid prereq fields to a file.
with Path('invalid_prereqs.txt').open('w') as f:
    json.dump(invalid_courses, f, indent=2)

print(f"Found {len(invalid_courses)} courses with invalid prereq entries out of {len(courses)} total.")
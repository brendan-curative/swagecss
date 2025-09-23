# Agent Configuration for CSS Constraint

## Objective
Create an AI agent that generates CSS code exclusively based on the predefined CSS rules found in the `src/css/foundation/` directory. The agent should not create, modify, or reference any CSS rules outside this directory.

## Instructions

- **Scope of CSS rules**: Only utilize the CSS rules defined within the files located in `src/css/foundation/`.
- **No rule creation**: Do not create new CSS rules outside those provided.
- **No modifications**: Never modify or alter the existing rules unless explicitly instructed.
- **Reference only provided rules**: When generating CSS, only reference the classes, IDs, and properties defined in `src/css/foundation/`.

## Implementation Details

- Provide the content of `src/css/foundation/` to the agent as context.
- Ensure the prompt explicitly states the constraint:  
   *"Use only the CSS rules found in `src/css/foundation/`."*
- Optionally, include a validation step to verify that generated code complies with the rules.

## Example prompt fragment

> Generate the CSS for the webpage, but strictly base all styles on the rules found in `src/css/foundation/`. Do not write or assume any custom rules outside of those provided.

## Notes
This setup enforces rigorous adherence to the provided CSS, ensuring style consistency and avoiding unintended modifications.

---

*End of agents.md*



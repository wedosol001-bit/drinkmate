# Configuration Directory

This directory contains configuration templates and examples.

## Files

- `env.template` - Environment variables template
- `security.example` - Security configuration example

## Setup

1. Copy `env.template` to `.env` in the server root
2. Update all values with your actual credentials
3. Copy `security.example` to `security-config.js` if needed

## Important Notes

- Never commit `.env` files to version control
- Use `env.template` as a reference for required variables
- All sensitive values should be stored in environment variables

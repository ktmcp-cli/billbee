# Billbee CLI - Agent Instructions

This is the Billbee CLI, part of the KTMCP project.

## What This CLI Does
- Manage e-commerce orders and shipments
- Create and update products
- View customer information and order history
- Get enum values for order states, payment types, carriers
- Track events and webhooks

## Authentication
Uses HTTP Basic Auth with username and API key.

## Common Commands
- `billbee config set --username USER --api-key KEY` - Configure credentials
- `billbee orders list` - List orders
- `billbee products list` - List products
- `billbee customers list` - List customers

## API Reference
https://app.billbee.io/swagger/ui/index

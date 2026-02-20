![Banner](https://raw.githubusercontent.com/ktmcp-cli/billbee/main/banner.svg)

> "Six months ago, everyone was talking about MCPs. And I was like, screw MCPs. Every MCP would be better as a CLI."
>
> — [Peter Steinberger](https://twitter.com/steipete), Founder of OpenClaw
> [Watch on YouTube (~2:39:00)](https://www.youtube.com/@lexfridman) | [Lex Fridman Podcast #491](https://lexfridman.com/peter-steinberger/)

# Billbee CLI

> **⚠️ Unofficial CLI** - Not officially sponsored or affiliated with Billbee.

Manage orders, products, customers, and shipping operations from the command line using the Billbee API.

## Installation
```bash
npm install -g @ktmcp-cli/billbee
```

## Quick Start
```bash
billbee config set --username YOUR_USERNAME --api-key YOUR_API_KEY
billbee orders list
billbee products list
```

Get your API credentials from: https://app.billbee.io/

## Commands

### Configuration
```bash
billbee config set --username USER --api-key KEY
billbee config show
```

### Orders
```bash
billbee orders list                    # List orders
billbee orders get <orderId>           # Get order details
billbee orders ship <orderId>          # Create shipment
billbee orders ship <orderId> --tracking TRACK123
```

### Products
```bash
billbee products list                  # List products
billbee products get <productId>       # Get product details
billbee products create --title "My Product" --sku "SKU123" --price 29.99
```

### Customers
```bash
billbee customers list                 # List customers
billbee customers get <customerId>     # Get customer details
billbee customers orders <customerId>  # Get customer orders
```

### Enums
```bash
billbee enums order-states             # List order states
billbee enums payment-types            # List payment types
billbee enums shipping-carriers        # List shipping carriers
```

### Events & Webhooks
```bash
billbee events                         # List events
billbee events --min-date 2024-01-01T00:00:00
billbee webhooks                       # List webhooks
```

## Why CLI > MCP?
No server to run. No protocol overhead. Just install and go.

## License
MIT — Part of the [Kill The MCP](https://killthemcp.com) project.

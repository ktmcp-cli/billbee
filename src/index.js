import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { getConfig, setConfig, isConfigured } from './config.js';
import { listOrders, getOrder, patchOrder, createShipment, listProducts, getProduct, createProduct, updateProduct, listCustomers, getCustomer, getCustomerOrders, listCustomerAddresses, getOrderStates, getPaymentTypes, getShipmentTypes, getShippingCarriers, listEvents, listWebhooks } from './api.js';

const program = new Command();

program
  .name('billbee')
  .description('CLI for Billbee API - manage orders, products, customers and shipping')
  .version('1.0.0');

// Config command
const config = program.command('config');
config.command('set')
  .description('Configure API credentials')
  .option('--username <username>', 'Billbee username')
  .option('--api-key <key>', 'Billbee API key')
  .option('--api-password <password>', 'Billbee API password (optional)')
  .action((opts) => {
    if (opts.username) setConfig('username', opts.username);
    if (opts.apiKey) setConfig('apiKey', opts.apiKey);
    if (opts.apiPassword) setConfig('apiPassword', opts.apiPassword);
    console.log(chalk.green('✓ Configuration saved'));
  });

config.command('show')
  .description('Show current configuration')
  .action(() => {
    const username = getConfig('username');
    const apiKey = getConfig('apiKey');
    console.log(chalk.bold('Current config:'));
    console.log(`  Username: ${username ? chalk.green(username) : chalk.red('not set')}`);
    console.log(`  API Key: ${apiKey ? chalk.green('****' + apiKey.slice(-6)) : chalk.red('not set')}`);
  });

// Orders commands
const orders = program.command('orders').description('Manage orders');

orders.command('list')
  .description('List orders')
  .option('--page <n>', 'Page number', '1')
  .option('--page-size <n>', 'Page size', '50')
  .action(async (opts) => {
    if (!isConfigured()) return console.error(chalk.red('Run: billbee config set --username USER --api-key KEY'));
    const spinner = ora('Fetching orders...').start();
    try {
      const data = await listOrders({ page: opts.page, pageSize: opts.pageSize });
      spinner.succeed('Orders fetched');
      const items = data.Data || [];
      if (items.length === 0) return console.log(chalk.yellow('No orders found'));
      items.forEach(order => {
        console.log(`${chalk.cyan(order.Id)} | ${chalk.bold(order.OrderNumber || 'N/A')} | ${order.Customer?.Name || 'N/A'} | ${order.TotalGross || 0} ${order.Currency || ''} | ${order.State || 'N/A'}`);
      });
    } catch (e) {
      spinner.fail('Failed to fetch orders');
      console.error(chalk.red(e.response?.data?.ErrorMessage || e.message));
    }
  });

orders.command('get <orderId>')
  .description('Get order details')
  .action(async (orderId) => {
    if (!isConfigured()) return console.error(chalk.red('Run: billbee config set --username USER --api-key KEY'));
    const spinner = ora('Fetching order...').start();
    try {
      const data = await getOrder(orderId);
      spinner.succeed('Order details');
      console.log(JSON.stringify(data, null, 2));
    } catch (e) {
      spinner.fail('Failed');
      console.error(chalk.red(e.response?.data?.ErrorMessage || e.message));
    }
  });

orders.command('ship <orderId>')
  .description('Create shipment for order')
  .option('--provider <provider>', 'Shipping provider')
  .option('--tracking <tracking>', 'Tracking number')
  .action(async (orderId, opts) => {
    if (!isConfigured()) return console.error(chalk.red('Run: billbee config set --username USER --api-key KEY'));
    const spinner = ora('Creating shipment...').start();
    try {
      const payload = {};
      if (opts.provider) payload.ShippingProviderId = opts.provider;
      if (opts.tracking) payload.TrackingNumber = opts.tracking;
      const data = await createShipment(orderId, payload);
      spinner.succeed('Shipment created');
      console.log(chalk.green(`Shipment created for order ${orderId}`));
    } catch (e) {
      spinner.fail('Failed');
      console.error(chalk.red(e.response?.data?.ErrorMessage || e.message));
    }
  });

// Products commands
const products = program.command('products').description('Manage products');

products.command('list')
  .description('List products')
  .option('--page <n>', 'Page number', '1')
  .option('--page-size <n>', 'Page size', '50')
  .action(async (opts) => {
    if (!isConfigured()) return console.error(chalk.red('Run: billbee config set --username USER --api-key KEY'));
    const spinner = ora('Fetching products...').start();
    try {
      const data = await listProducts({ page: opts.page, pageSize: opts.pageSize });
      spinner.succeed('Products fetched');
      const items = data.Data || [];
      if (items.length === 0) return console.log(chalk.yellow('No products found'));
      items.forEach(product => {
        console.log(`${chalk.cyan(product.Id)} | ${chalk.bold(product.Title || 'N/A')} | SKU: ${product.SKU || 'N/A'} | Price: ${product.Price || 0}`);
      });
    } catch (e) {
      spinner.fail('Failed');
      console.error(chalk.red(e.response?.data?.ErrorMessage || e.message));
    }
  });

products.command('get <productId>')
  .description('Get product details')
  .action(async (productId) => {
    if (!isConfigured()) return console.error(chalk.red('Run: billbee config set --username USER --api-key KEY'));
    const spinner = ora('Fetching product...').start();
    try {
      const data = await getProduct(productId);
      spinner.succeed('Product details');
      console.log(JSON.stringify(data, null, 2));
    } catch (e) {
      spinner.fail('Failed');
      console.error(chalk.red(e.response?.data?.ErrorMessage || e.message));
    }
  });

products.command('create')
  .description('Create a product')
  .requiredOption('--title <title>', 'Product title')
  .option('--sku <sku>', 'Product SKU')
  .option('--price <price>', 'Product price')
  .action(async (opts) => {
    if (!isConfigured()) return console.error(chalk.red('Run: billbee config set --username USER --api-key KEY'));
    const spinner = ora('Creating product...').start();
    try {
      const product = { Title: opts.title };
      if (opts.sku) product.SKU = opts.sku;
      if (opts.price) product.Price = parseFloat(opts.price);
      const data = await createProduct(product);
      spinner.succeed('Product created');
      console.log(chalk.green(`Product ID: ${data.Data?.Id || 'N/A'}`));
    } catch (e) {
      spinner.fail('Failed');
      console.error(chalk.red(e.response?.data?.ErrorMessage || e.message));
    }
  });

// Customers commands
const customers = program.command('customers').description('Manage customers');

customers.command('list')
  .description('List customers')
  .option('--page <n>', 'Page number', '1')
  .option('--page-size <n>', 'Page size', '50')
  .action(async (opts) => {
    if (!isConfigured()) return console.error(chalk.red('Run: billbee config set --username USER --api-key KEY'));
    const spinner = ora('Fetching customers...').start();
    try {
      const data = await listCustomers({ page: opts.page, pageSize: opts.pageSize });
      spinner.succeed('Customers fetched');
      const items = data.Data || [];
      if (items.length === 0) return console.log(chalk.yellow('No customers found'));
      items.forEach(customer => {
        console.log(`${chalk.cyan(customer.Id)} | ${chalk.bold(customer.Name || 'N/A')} | ${customer.Email || 'N/A'}`);
      });
    } catch (e) {
      spinner.fail('Failed');
      console.error(chalk.red(e.response?.data?.ErrorMessage || e.message));
    }
  });

customers.command('get <customerId>')
  .description('Get customer details')
  .action(async (customerId) => {
    if (!isConfigured()) return console.error(chalk.red('Run: billbee config set --username USER --api-key KEY'));
    const spinner = ora('Fetching customer...').start();
    try {
      const data = await getCustomer(customerId);
      spinner.succeed('Customer details');
      console.log(JSON.stringify(data, null, 2));
    } catch (e) {
      spinner.fail('Failed');
      console.error(chalk.red(e.response?.data?.ErrorMessage || e.message));
    }
  });

customers.command('orders <customerId>')
  .description('Get customer orders')
  .action(async (customerId) => {
    if (!isConfigured()) return console.error(chalk.red('Run: billbee config set --username USER --api-key KEY'));
    const spinner = ora('Fetching orders...').start();
    try {
      const data = await getCustomerOrders(customerId);
      spinner.succeed('Customer orders');
      console.log(JSON.stringify(data, null, 2));
    } catch (e) {
      spinner.fail('Failed');
      console.error(chalk.red(e.response?.data?.ErrorMessage || e.message));
    }
  });

// Enums commands
const enums = program.command('enums').description('Get enum values');

enums.command('order-states')
  .description('List order states')
  .action(async () => {
    if (!isConfigured()) return console.error(chalk.red('Run: billbee config set --username USER --api-key KEY'));
    const spinner = ora('Fetching order states...').start();
    try {
      const data = await getOrderStates();
      spinner.succeed('Order states');
      console.log(JSON.stringify(data, null, 2));
    } catch (e) {
      spinner.fail('Failed');
      console.error(chalk.red(e.response?.data?.ErrorMessage || e.message));
    }
  });

enums.command('payment-types')
  .description('List payment types')
  .action(async () => {
    if (!isConfigured()) return console.error(chalk.red('Run: billbee config set --username USER --api-key KEY'));
    const spinner = ora('Fetching payment types...').start();
    try {
      const data = await getPaymentTypes();
      spinner.succeed('Payment types');
      console.log(JSON.stringify(data, null, 2));
    } catch (e) {
      spinner.fail('Failed');
      console.error(chalk.red(e.response?.data?.ErrorMessage || e.message));
    }
  });

enums.command('shipping-carriers')
  .description('List shipping carriers')
  .action(async () => {
    if (!isConfigured()) return console.error(chalk.red('Run: billbee config set --username USER --api-key KEY'));
    const spinner = ora('Fetching carriers...').start();
    try {
      const data = await getShippingCarriers();
      spinner.succeed('Shipping carriers');
      console.log(JSON.stringify(data, null, 2));
    } catch (e) {
      spinner.fail('Failed');
      console.error(chalk.red(e.response?.data?.ErrorMessage || e.message));
    }
  });

// Events command
program.command('events')
  .description('List events')
  .option('--min-date <date>', 'Minimum date (ISO 8601)')
  .option('--max-date <date>', 'Maximum date (ISO 8601)')
  .action(async (opts) => {
    if (!isConfigured()) return console.error(chalk.red('Run: billbee config set --username USER --api-key KEY'));
    const spinner = ora('Fetching events...').start();
    try {
      const params = {};
      if (opts.minDate) params.minDate = opts.minDate;
      if (opts.maxDate) params.maxDate = opts.maxDate;
      const data = await listEvents(params);
      spinner.succeed('Events fetched');
      console.log(JSON.stringify(data, null, 2));
    } catch (e) {
      spinner.fail('Failed');
      console.error(chalk.red(e.response?.data?.ErrorMessage || e.message));
    }
  });

// Webhooks command
program.command('webhooks')
  .description('List webhooks')
  .action(async () => {
    if (!isConfigured()) return console.error(chalk.red('Run: billbee config set --username USER --api-key KEY'));
    const spinner = ora('Fetching webhooks...').start();
    try {
      const data = await listWebhooks();
      spinner.succeed('Webhooks fetched');
      console.log(JSON.stringify(data, null, 2));
    } catch (e) {
      spinner.fail('Failed');
      console.error(chalk.red(e.response?.data?.ErrorMessage || e.message));
    }
  });

program.parse(process.argv);

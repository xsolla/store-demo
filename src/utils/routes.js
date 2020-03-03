const routes = {
  items: '/',
  currencies: '/crystals',
  physical: '/physical',
  inventory: '/inventory',
  entitlement: '/entitlement',
  manage: '/manage',
  purchase: '/purchase',
  specificProject: '/projects/:projectID'
}

const navItems = [
  {
    route: routes.items,
    label: 'Items'
  },
  {
    route: routes.currencies,
    label: 'Currencies',
  },
  {
    route: routes.physical,
    label: 'Merchandise',
  },
  {
    route: routes.inventory,
    label: 'Inventory',
  },
  {
    route: routes.entitlement,
    label: 'Entitlement',
  },
  {
    route: routes.manage,
    label: 'Manage',
  },
  {
    route: routes.purchase,
    label: 'Server purchase',
  },
];

export const getMenuItems = items => navItems
  .filter(x => items.includes(x.route))
  .sort((a, b) => items.indexOf(a.route) - items.indexOf(b.route));

export { routes, navItems };